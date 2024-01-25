const { Router } = require("express")
const path = require("path");
const CartManager = require("../cartManager")
const { uploader } = require("../utils");
const router = Router()

const manager = new CartManager(path.join(__dirname,"../carts.json"))


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
        await manager.addProduct(req.params.cid,req.params.pid)       
        res.json({
            ok:true,
        }
        ) 
    }catch(error){
        console.log(error)
    }
})




module.exports = router