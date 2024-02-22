const { Router } = require("express")
const path = require("path");

const CartManager = require("../dao/fileManagers/cartManager")
const { uploader } = require("../utils");
const cartsModel = require("../dao/model/carts.models");
const productsModel = require("../dao/model/products.models");
const router = Router()

const manager = new CartManager(path.join(__dirname, "../carts.json"))


router.get(`/:cid`, async (req, res) => {
    try {
        const cartProds = await cartsModel.findOne({_id:req.params.cid}).populate("products.product")

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

router.post("/",async(req,res) => {
    try{
        const cartBody = req.body
        let newCart = await cartsModel.create(cartBody)
        return res.json({
            ok:true,
            message:"Se agrego el carrito nuevo",
            cart:newCart
        })
    }catch(error){
        return res.json({
            ok:false,
            message:error
        })
    }
})


router.post(`/:cid/product/:pid`, async (req, res) => {
    try {                
        if(await productsModel.findOne({_id:req.params.pid}) !== undefined && await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        const cart = await cartsModel.findOne({_id:req.params.cid})        
        const cantidad = (req.body.cantidad !== undefined)?req.body.cantidad:1

        if(await cartsModel.findOne({_id:req.params.cid,"products.product":req.params.pid})===null){
        await cart.products.push({product:req.params.pid,cantidad:cantidad})
        await cartsModel.updateOne({_id:req.params.cid },cart)       
        }else
        await cartsModel.updateOne({_id:req.params.cid,"products.product":req.params.pid},{$inc:{"products.$.cantidad":cantidad}})
        res.json({
            ok: true,
            message:"Producto agregado al carrito " + req.params.cid,
            productos: await cartsModel.findOne({_id:req.params.cid}).populate("products.product")
        })
        }
         
    } catch (error) {
        res.json({
            ok: false,
            message: "El producto o el carrito no existen"
        })
    }
})

router.put(`/:cid/product/:pid`, async (req, res) => {
    try {                
        if(await productsModel.findOne({_id:req.params.pid}) !== undefined && await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        const cart = await cartsModel.findOne({_id:req.params.cid})        
        const cantidad = req.body.cantidad
        await cartsModel.updateOne({_id:req.params.cid,"products.product":req.params.pid},{$set:{"products.$.cantidad":cantidad}})

        //.find(p => p.product === req.params.pid)
        
        //  prod.cantidad = cantidad        
        //  await cartsModel.updateOne({_id:req.params.cid },cart)       
        res.json({
            ok: true,
            message:"Actualizado",
            productos: await cartsModel.findOne({_id:req.params.cid}).populate("products.product")
            //"La cantidad de unidades del producto " + req.params.pid + " fue actualizada." 
        })
        }
    
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
})

router.delete(`/:cid/product/:pid`, async (req, res) => {
    try {                
        if(await productsModel.findOne({_id:req.params.pid}) !== undefined && await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        const cart = await cartsModel.findOne({_id:req.params.cid})        
        const cantidad = req.body.cantidad
        await cartsModel.updateOne({_id:req.params.cid},{$pull:{products:{product:req.params.pid}}})

        res.json({
            ok: true,
            message:"Producto borrado del carrito",
            productos: await cartsModel.findOne({_id:req.params.cid}).populate("products.product")

        })
        }
    
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
})

router.put(`/:cid`, async (req, res) => {
    try {                
        if(await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        const newProducts = req.body.products
        await cartsModel.updateOne({_id:req.params.cid},{$set:{products:newProducts}})

        res.json({
            ok: true,
            message:"La lista de productos fue actualizada"

        })
        }
    
    } catch (error) {
        res.json({
            ok: false,
            message: error.message
        })
    }
})

router.delete(`/:cid`, async (req, res) => {
    try {                
        if(await cartsModel.findOne({_id:req.params.cid})!== undefined){        
        
        await cartsModel.updateOne({_id:req.params.cid},{$set:{products:[]}})

        res.json({
            ok: true,
            message:"La lista de productos fue borrada"

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