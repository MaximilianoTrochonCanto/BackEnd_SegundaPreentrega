const { Router } = require("express");
const userModel = require("../dao/model/user.models");
const productsModel = require("../dao/model/products.models");

const router = Router();


router.get("/loginusuario",async(req,res) => {

  const { email, password } = req.query;

  
  const buscado = await userModel.findOne({email:email})

  

  if (email === "" || password === "") {
    res.send({
      error:
        "Debe completar todos los campos.",
    });
  } else 
  
  


  if (password === buscado.password) {
       req.session.user = buscado.name;
       const prods = await productsModel.find().lean();
       res.render("products", { products: prods, user: req.session.user });
    }else{
      res.send({
        error:
          "La contraseña no coincide",
      });
    } 
});





router.post("/logout", (req, res) => {
  res.render("login");

  req.session.destroy((err) => {
    if (!err) res.render("login");
    else res.send({ status: "Error en logout", body: err });
  });
});

router.get("/altausuario", async (req, res) => {
  const { name, email, password, password2 } = req.query;

  


  if (name === "" || email === "" || password === "" || password2 === "") {
    res.send({
      error:
        "Ocurrio un error al registrar al usuario. Asegurese de que todos los campos esten completos y que el correo no figure en nuestra lista de usuarios.",
    });
  } else if (password === password2) {
    

    if ((await userModel.findOne({ email: email })) === null) {
      await userModel.create({
        name: name,
        email: email,
        password: password,
      });
      req.session.user = name;
      const prods = await productsModel.find().lean();
      res.render("products", { products: prods, user: req.session.user });
    } else res.send({ error: "El mail ya existe" });
  } else res.send({ error: "Las contraseñas no coinciden" });
});

module.exports = router;
// deleteCookie
