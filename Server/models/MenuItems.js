const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }
})

module.exports = mongoose.model('Menu' , menuItemSchema)