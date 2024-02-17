const { Router } = require("express")
const path = require("path");

const CartManager = require("../dao/fileManagers/cartManager")
const { uploader } = require("../utils");
const cartsModel = require("../dao/model/carts.models");
const productsModel = require("../model/products.models");
const router = Router()

const manager = new CartManager(path.join(__dirname, "../carts.json"))


router.get(`/:cid`, async (req, res) => {
    try {
        const cartProds = await cartsModel.findOne({_id:req.params.cid}).distinct("products")
        
        return res.json({
            ok: true,
            products: cartProds,
        });
    } catch (error) {
        return res.json({
            ok: false,
            message: error,
        });
    }
})

router.post(`/:cid/product/:pid`, async (req, res) => {
    try {                
        if(await productsModel.findOne({_id:req.params.pid}) !== undefined && await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        const prods = await cartsModel.findOne({_id:req.params.cid}).distinct("products")        
        prods.push(req.params.pid)        
        await cartsModel.updateOne({_id:req.params.cid},{$set:{products:new Array(prods)}})
       // await manager.addProduct(req.params.cid, req.params.pid)
        res.json({
            ok: true,
            message:"Producto agregado al carrito " + req.params.cid
        })
        }
         
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
})




module.exports = router