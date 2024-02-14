const { Router } = require("express")
const path = require("path");
const ProductManager = require("../dao/fileManagers/productManager")
const productos = require("../products.json");
const handlebars = require("express-handlebars")
const { uploader } = require("../utils");
const { title } = require("process");
const router = Router()
const express = require("express")
const app = express()
const io = require("../app");
const productsModel = require("../dao/model/products.models");
const prodsData = require("../data/products");


const manager = new ProductManager(path.join(__dirname, "../products.json"))

app.engine("handlebars",handlebars.engine())
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","handlebars")

router.get(`/insertion`,async(req,res) =>{
    try{
        let result = await productsModel.insertMany(prodsData)
        return res.json({
            message:"Massive insert successful",
            products:result
        }
        )
    }catch(err){
        console.log(err)
    }
})

    let result;
        router.get(`/`, async (req, res) => {
            try{                
                (req.query.limit>0)?result = await productsModel.find().limit(req.query.limit):result = await productsModel.find()             

                return res.json({
                    ok: true,
                    products: result
                });
            }catch(error){
                return res.json({
                    ok: false,
                    products: error.message
                });
            }
        })



     
    router.get(`/:productId`, async(req, res) => {
       try{
           const productId = req.params.productId;                   
                   const producto = await productsModel.find({
                    _id:productId
                   })
                   if (!producto) {
                       return res.status(400).json({
                           ok: true,
                           message: `No existe el producto con el id ${productId}`,
                           queryParams: req.query
                        })
                    }
                                                                        
                    return res.json({
                        ok: true,
                        product: producto
                    });
                }catch(error){
                    return res.json({
                        ok: false,
                        product: error.message
                    });
                }

                
            })
            
            
            
            



            router.post(`/`,uploader.single("thumbnails"),async(req, res) => {
            const prods = await manager.getProducts()
            const file = req.file;
            console.log(req.file)
            
            const product = req.body;
            const lastId = prods.products[prods.products.length - 1].id
            console.log(lastId)
            let newProduct;
            if(file){
                 newProduct = {
                    id: (Number(lastId) + 1).toString(),
                    thumbnails: `http://localhost:8080/public/uploads/${file.filename}`,
                    status: true,
                    ...product
                }
            }else{
                 newProduct = {
                    id: (Number(lastId) + 1).toString(),                    
                    status: true,
                    ...product
                }
            }
            if (newProduct.title != "" || newProduct.description != "" || newProduct.code != "" || newProduct.price != "") {
                //await manager.createProduct(newProduct)
                productsModel.insertOne(newProduct)
            }
        })





router.put(`/:productId`, async(req, res) => {
    try{
    const productId = req.params.productId;    
    const productouevo = req.body;   
    
    let productoBuscado = productsModel.find({_id:productId})
    
    if(productouevo.title !== undefined)
   await productsModel.updateOne({_id:productId}, {$set:{title:productouevo.title}})
    
    if(productouevo.description !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{description:productouevo.description}})

    if(productouevo.code !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{code:productouevo.code}})

    if(productouevo.price !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{price:productouevo.price}})

    if(productouevo.status !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{status:productouevo.status}})

    if(productouevo.category !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{category:productouevo.category}})

    if(productouevo.thumbnails !== undefined)
    await productsModel.updateOne({_id:productId}, {$set:{thumbnails:productouevo.thumbnails}})
    
   // await manager.updateProduct(productId,newProduct)
    res.json({
        ok:true,
        message:"El producto fue actualizado",
        producto: await productsModel.find({_id:productId})
    })
    }catch(error){
        res.json({
            ok:false,
            message:error.message,            
        })  
    }
})





        router.delete(`/:productId`, async(req, res) => {            
            try{
                await productsModel.deleteOne({_id:req.params.productId})
               // await manager.deleteProduct(req.params.productId); 
                
                res.json({
                    ok:true,
                    message:"El producto fue Borrado"
                })
            }catch(error){
                res.json({
                    ok:false,
                    message:error.message
                })
            }
        })






module.exports = router