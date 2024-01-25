const { Router } = require("express")
const path = require("path");
const ProductManager = require("../productManager")
const productos = require("../products.json");
const { uploader } = require("../utils");
const { title } = require("process");
const router = Router()

const manager = new ProductManager(path.join(__dirname, "../products.json"))





    let result;
        router.get(`/`, async (req, res) => {
            (req.query.limit>0)?result = await manager.getProducts().products.slice(0,req.query.limit):result = await manager.getProducts()             
            return res.json({
                ok: true,
                products: result.products
            });
        })




    router.get(`/:productId`, async(req, res) => {
        const productId = req.params.productId;
        // if (isNaN(productId)) {
        //     return res.status(400).json({
        //         ok: true,
        //         message: `No existe el producto con el id ${productId}`,
        //         queryParams: req.query
        //     })
        // }
        
        
        const producto = await manager.getProductById(productId)
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
                    id: (lastId + 1).toString(),
                    thumbnails: `http://localhost:8080/public/uploads/${file.filename}`,
                    status: true,
                    ...product
                }
            }else{
                 newProduct = {
                    id: (lastId + 1).toString(),                    
                    status: true,
                    ...product
                }
            }
            if (newProduct.title != "" || newProduct.description != "" || newProduct.code != "" || newProduct.price != "") {
                await manager.createProduct(newProduct)
                res.json({
                    ok: true,
                    message: `Nuevo producto creado`,
                    product: newProduct
                })
            }
        })





router.put(`/:productId`, async(req, res) => {
    const productId = req.params.productId;    
    const productouevo = req.body;   
    
    let productoBuscado = await manager.getProductById(productId)
    let newProduct = {
        id:productId,
        ...productoBuscado        
    }
    
    if(productouevo.title !== undefined)
        newProduct.title = productouevo.title
    
    if(productouevo.description !== undefined)
    newProduct.description = productouevo.description

    if(productouevo.code !== undefined)
    newProduct.code = productouevo.code

    if(productouevo.price !== undefined)
    newProduct.price = productouevo.price

    if(productouevo.status !== undefined)
    newProduct.status = productouevo.status

    if(productouevo.category !== undefined)
    newProduct.category = productouevo.category

    if(productouevo.thumbnails !== undefined)
    newProduct.thumbnails = productouevo.thumbnails
                    
    await manager.updateProduct(productId,newProduct)
    res.json({
        ok:true,
        message:"El producto fue actualizado",
        producto:newProduct
    })

})





        router.delete(`/:productId`, async(req, res) => {            
            await manager.deleteProduct(req.params.productId) 
            res.json({
                ok:true,
                message:"El producto fue Borrado"
            }
            )
        })






module.exports = router