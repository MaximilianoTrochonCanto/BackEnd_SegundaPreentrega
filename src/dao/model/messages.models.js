const mongoose = require("mongoose")

const collectionName = "Messages"

const messageschema = mongoose.Schema({
    user:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    
    
})

const messagesModel = mongoose.model(collectionName, messageschema)

module.exports = messagesModel