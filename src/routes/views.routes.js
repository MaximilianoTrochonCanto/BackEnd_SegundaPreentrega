const {Router} = require("express")
const express = require("express")
const ProductManager = require("../dao/fileManagers/productManager")
const path = require("path");
const messagesModel = require("../dao/model/messages.models");
const productsModel = require("../model/products.models");
const manager = new ProductManager(path.join(__dirname, "../products.json"))

const router = Router()


router.get("/",async(req,res)=>{
    const products = await productsModel.find()
    res.render("home",{products})
})


router.get("/realtimeproducts",async(req,res) => {
   
    res.render("realTimeProducts")
})

router.get("/chat",async(req,res) => {
    res.render("chat")
})

module.exports = router