const passport = require("passport");
const local = require("passport-local");
const userModel = require("../dao/model/user.models");
const GithubStrategy = require("passport-github2");
const { createHash, isValidPassword } = require("../utils/encrypt");

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy({
      clientID: "0e219baa67562fc4ce9d",
      clientSecret: "9b76d5bbd4519adee249e379c7987ee5fcec7ad3",
      callbackURL: "http://localhost:8080/api/session/github/callback",
      scope: ['user:email'],
    },
    async(accessToken,refreshToken,profile,done) => {
      try{
        let user = await userModel.findOne({email:profile.emails[0].value})
        console.log(profile.emails[0].value)
        if(!user){
          let addNewUser = {
            name:profile._json.name,
            email:profile.emails[0].value,
            password:"XX"
          }
          let newUser = await userModel.create(addNewUser)
          done(null,newUser)
        }else{
          
          done(null,user)
        }
      }catch(error){
        console.log(error)
      }
    })
  );

  passport.use(
    "registro",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, res, username, done) => {
        const { name, email, password } = req.body;

        try {
          let user = await userModel.findOne({ email: username });
          console.log(email);
          if (user) return done(null, false);

          const pwdHashed = await createHash(password);

          const createOk = await userModel.create({
            name: name,
            email: email,
            password: pwdHashed,
          });
          req.session.user = name;
          return done(null, createOk);
        } catch (error) {
          console.log("algo salio mal");
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, res, username, done) => {
        const { email, password } = req.body;
        try {
          const user = await userModel.findOne({ email: email });
          if (!user) return done(null, false);

          if (!isValidPassword(password, user.password))
            return done(null, false);
          return done(null, user);
        } catch (error) {}
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    let user = await userModel.findById({ _id: _id });
    done(null, user);
  });
};

module.exports = initializePassport;
