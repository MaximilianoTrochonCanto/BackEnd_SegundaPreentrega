const express = require("express")
const productsRoutes = require("./routes/productsRoutes")
const cartsRoutes = require("./routes/cartsRoutes")


const app = express()
const PORT = 8080
const API_PREFIX = "api"

app.use(express.json())
app.use(express.urlencoded({extended:true}))
console.log()
app.use(express.static(__dirname+"/public"))



app.use(`/${API_PREFIX}/products`,productsRoutes)
app.use(`/${API_PREFIX}/carts`,cartsRoutes)


app.listen(PORT,()=>{
    console.log(`Up N'running ${PORT}`)
})