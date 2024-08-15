const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin" , "Waiter" , "Manager" , "Customer" , "Cook"]
    },
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : 'Order'
        }
    ],
    tabel:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Table',
        }
    ],
    token:{
        type:String
    },
})

module.exports = mongoose.model("User" , userSchema)