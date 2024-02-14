const {Router} = require("express")
const express = require("express")
const ProductManager = require("../dao/fileManagers/productManager")
const path = require("path");
const messagesModel = require("../dao/model/messages.models");
const manager = new ProductManager(path.join(__dirname, "../products.json"))

const router = Router()


router.get("/",(req,res)=>{
    res.render("home")
})


router.get("/realtimeproducts",async(req,res) => {
    const products = await manager.getProducts()
    res.render("realTimeProducts",products)
})

router.get("/chat",async(req,res) => {
    res.render("chat")
})

module.exports = router