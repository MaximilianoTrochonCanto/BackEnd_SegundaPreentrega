const { Router } = require("express")
const path = require("path");
const CartManager = require("../cartManager")
const ProductManager = require("../productManager")
const { uploader } = require("../utils");
const router = Router()

const manager = new CartManager(path.join(__dirname,"../carts.json"))
const pManager = new ProductManager(path.join(__dirname,"../products.json"))

router.get(`/:cid`,async(req,res) =>{
    try{
    const cartProds = await manager.getProducts(req.params.cid)
    return res.json({
        ok:true,
        carts:cartProds,
    });
    }catch(error){
        return res.json({
            ok:false,
            message:error,
        }); 
    }
})

router.post(`/:cid/product/:pid`,async(req,res) => {
    try{
        const prod = await pManager.getProductById(req.params.pid)
        if(prod){
        await manager.addProduct(req.params.cid,req.params.pid)       
        res.json({
            ok:true,
        })
        }else{
            res.json({
                ok:false,
                message:"No existe el producto"
            })   
        } 
    }catch(error){
        console.log(error)
    }
})




module.exports = router