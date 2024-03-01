const {Router} = require("express")
const express = require("express")
const ProductManager = require("../dao/fileManagers/productManager")
const path = require("path");
const messagesModel = require("../dao/model/messages.models");
const productsModel = require("../dao/model/products.models");
const cartsModel = require("../dao/model/carts.models");
const manager = new ProductManager(path.join(__dirname, "../products.json"))

const router = Router()


router.get("/",async(req,res)=>{
    const products = await productsModel.find()
    res.render("home",{products})
})

router.get("/carts/:cid",async(req,res) =>{
    const cart = await cartsModel.findOne({_id:req.params.cid}).lean()
    const cartProds = await cartsModel.findOne({_id:req.params.cid}).populate("products.product")

    console.log(cartProds.products)     
        res.render("productsCart",{cart:cart,products:cartProds.products})
        //res.render("productsCart",{cart:cart,products:cartProds})

})

router.get("/realtimeproducts",async(req,res) => {
   
    res.render("realTimeProducts")
})

router.get("/chat",async(req,res) => {
    res.render("chat")
})

router.get("/products",async(req,res)=>{
    
    const body = req.query
    console.log(body)    
    if(body.email === "adminCoder@coder.com" && body.password === "adminCod3r123")
    req.session.admin = true

    req.session.user = body.email

    console.log(req.session.user)
    // res.cookie("cookieUser",{userEmail:`${body.email}`,
    // userPassword:body.password,
    // maxAge:20000,
    // signed:true
    // }).send()
    const prods = await productsModel.find().lean()
    res.render("products",{products:prods, user:req.session.user})
    
})

router.get("/login",async(req,res) =>{
    res.render("login")
})

router.get("/registro",async(req,res) =>{
    res.render("registro")
})
  

module.exports = router