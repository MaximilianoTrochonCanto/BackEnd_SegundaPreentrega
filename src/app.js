const Server = require('socket.io')
const express = require("express")
const productsRoutes = require("./routes/productsRoutes")
const cartsRoutes = require("./routes/cartsRoutes")
const viewsRoutes = require("./routes/views.routes")
const handlebars = require("express-handlebars")
const path = require("path")
const app = express()
const PORT = 8080
const fs = require("fs/promises")
const ProductManager = require("./productManager")

const pManager = new ProductManager(path.join(__dirname, "./products.json"))

const httpServer = app.listen(PORT,()=>console.log(`Up N'running ${PORT}`))

const io = new Server.Server(httpServer)
const API_PREFIX = "api"



app.get("/",async(req,res)=>{
    const products = await pManager.getProducts()
    res.render("home",products)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
console.log()
app.use(express.static(__dirname+"/public"))
app.engine("handlebars",handlebars.engine())
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","handlebars")


app.use(`/${API_PREFIX}/products`,productsRoutes)
app.use(`/${API_PREFIX}/carts`,cartsRoutes)
app.use(`/`,viewsRoutes)




io.on("connection", async(socket) => {
    let prods = await pManager.getProducts()
   socket.emit("prod-logs",prods.products)
    console.log("New client connected", socket.id)
    socket.on("new-prod",async(data) =>{        
        const lastId = prods.products[prods.products.length - 1].id
        await pManager.createProduct({
            id:(Number(lastId)+ 1).toString(),
            status:true,
            ...data
          })  
          prods = await pManager.getProducts()
        
        
      
    //   pr.push(p)
      io.emit("prod-logs",prods)
      // PORQUE NO ME DEJA SEGUIR AGREGANDO Y SOBREESCRIBE???  
      app.get("/realtimeproducts",async(req,res) => {
        res.render("realTimeProducts",prods.products)
    })      
      
      
    })

    socket.on("borrar-prod",async(data) => {    
       await pManager.deleteProduct(data)
       prods = await pManager.getProducts()
        io.emit("prod-logs",prods.products)
        
    })

})


module.exports = io;