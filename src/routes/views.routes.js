const { Router } = require("express");
const express = require("express");
const ProductManager = require("../dao/fileManagers/productManager");
const path = require("path");
const messagesModel = require("../dao/model/messages.models");
const productsModel = require("../dao/model/products.models");
const cartsModel = require("../dao/model/carts.models");
const passport = require("passport");
const manager = new ProductManager(path.join(__dirname, "../products.json"));

const router = Router();

router.get("/", async (req, res) => {
  const products = await productsModel.find();
  res.render("home", { products });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await cartsModel.findOne({ _id: req.params.cid }).lean();
  const cartProds = await cartsModel
    .findOne({ _id: req.params.cid })
    .populate("products.product");

  console.log(cartProds.products);
  res.render("productsCart", { cart: cart, products: cartProds.products });
  //res.render("productsCart",{cart:cart,products:cartProds})
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  if (req.session.user === "CoderAdmin") req.session.admin = true;

  const prods = await productsModel.find().lean();
  
  res.render("products", { products: prods, user: req.user.name });
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/failogin",
  })
  
);
router.get("/registro", async (req, res) => {
  res.render("registro");
});

router.post(
  "/registro",
  async(req,res) => {
    req.session.user = req.user
  },
  passport.authenticate("registro", {
    successRedirect: "/products",
    failureRedirect: "/failregister",  
  })
);


router.get("/failregister", async (req, res) => {
  res.render("registro",{ error: "Error. Revise que el correo no exista y ambas contraseñas coincidan." });
});
router.get("/failogin", async (req, res) => {
  res.render("login",{ error: "El usuario o contraseña son incorrectos" });
});
router.get("/githubfailure", async (req, res) => {
  
  res.send({ error: "Algo esta pasando con github"  });
});

module.exports = router;
