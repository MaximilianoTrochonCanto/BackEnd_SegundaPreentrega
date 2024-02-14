const mongoose = require("mongoose")

const collectionName = "Carts"

const cartSchema = mongoose.Schema({
    
    number:{
        type:Number,
        required:true,
    },
    
    products:{
        type:Array,        
    }    
    
})

const cartsModel = mongoose.model(collectionName, cartSchema)

module.exports = cartsModel