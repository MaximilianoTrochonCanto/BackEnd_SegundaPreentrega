const {Router} = require("express")
const express = require("express")
const ProductManager = require("../productManager")
const path = require("path");
const manager = new ProductManager(path.join(__dirname, "../products.json"))

const router = Router()


router.get("/",(req,res)=>{
    res.render("home")
})


router.get("/realtimeproducts",async(req,res) => {
    const products = await manager.getProducts()
    res.render("realTimeProducts",products)
})

module.exports = router