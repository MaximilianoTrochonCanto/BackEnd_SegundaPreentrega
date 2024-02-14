const mongoose = require("mongoose")

const collectionName = "Products"

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    code:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    thumbnails:{
        type:Array,        
    }    
    
})

const productsModel = mongoose.model(collectionName, productSchema)

module.exports = productsModel