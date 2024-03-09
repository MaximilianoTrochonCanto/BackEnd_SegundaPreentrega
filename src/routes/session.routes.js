const { Router } = require("express");
const userModel = require("../dao/model/user.models");
const productsModel = require("../dao/model/products.models");
const { createHash, isValidPassword } = require("../utils/encrypt");
const passport = require("passport");

const router = Router();

router.get("/github",
  passport.authenticate("github"),
  async(req,res) => {}
)

router.get("/github/callback",
  passport.authenticate("github",{failureRedirect:"/githubfailure"}),
  async(req,res)=>{
    try{
      req.session.user = req.user.name
      res.redirect("/products")
    }catch(error){
      console.log(error)
    }
  }
)


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const buscado = await userModel.findOne({ email: email });

  if (email === "" || password === "") {
    res.send({
      error: "Debe completar todos los campos.",
    });
  } else if (!buscado) return res.send({ error: "El usuario no existe" });

  const isValidCompare = await isValidPassword(password, buscado.password);

  if (isValidCompare) {
    req.session.user = req.user.name;
    res.redirect("/products");
  } else {
    res.send({
      error: "La contraseña no coincide",
    });
  }
});

router.post("/logout", (req, res) => {  
  req.session.destroy((err) => {
    if (!err) res.redirect("/login");
    else res.send({ status: "Error en logout", body: err });
  });
});

router.post("/registro", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  if (name === "" || email === "" || password === "" || password2 === "") {
    res.send({
      error:
        "Ocurrio un error al registrar al usuario. Asegurese de que todos los campos esten completos y que el correo no figure en nuestra lista de usuarios.",
    });
  } else if (password === password2) {
    const pwdHashed = await createHash(password);

    if ((await userModel.findOne({ email: email })) === null) {
      await userModel.create({
        name: name,
        email: email,
        password: pwdHashed,
      });
      req.session.user = req.user.name;
      const prods = await productsModel.find().lean();
      res.redirect("/products");
    } else res.send({ error: "El mail ya existe" });
  } else res.send({ error: "Las contraseñas no coinciden" });
});

module.exports = router;
// deleteCookie
