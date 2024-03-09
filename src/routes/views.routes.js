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
  console.log("El user: " + req.session.user)
  res.render("products", { products: prods, user: req.session.user });
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/failogin",
    failureFlash: true,
  }),async(req,res) => {
    req.session.user = req.user.name 
  }
  
);
router.get("/registro", async (req, res) => {
  res.render("registro");
});

router.post(
  "/registro",
  passport.authenticate("registro", {
    successRedirect: "/products",
    failureRedirect: "/failregister",
    failureFlash: true,
  }),async(req,res) => {
    req.session.user = req.user.name 
  }
);


router.get("/failregister", async (req, res) => {
  res.send({ error: "Ocurrio un error!" });
});
router.get("/failogin", async (req, res) => {
  res.send({ error: "Ocurrio un error!" });
});
router.get("/githubfailure", async (req, res) => {
  
  res.send({ error: "Algo ta pasando con github 8=D" });
});

module.exports = router;
