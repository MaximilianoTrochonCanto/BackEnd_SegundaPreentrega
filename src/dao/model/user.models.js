const mongoose = require("mongoose")

const collectionName = "Users"

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    admin:{
        type:Boolean,        
    }

    
})
const userModel = mongoose.model(collectionName, userSchema)

module.exports = userModel