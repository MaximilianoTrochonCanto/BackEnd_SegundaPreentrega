const mongoose = require("mongoose")

const collectionName = "Carts"

const cartSchema = mongoose.Schema({
    
    number:{
        type:Number,
        required:true,
        unique:true
    },
    
    products:{
        type:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Products'
                },
                cantidad:{
                    type:Number,
                    required:true
                }
            }
        ],
        default:[]       
    }    
    
})

cartSchema.pre('find',function(){
    this.populate("products.product")
})

const cartsModel = mongoose.model(collectionName, cartSchema)

module.exports = cartsModel