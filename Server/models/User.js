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
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin" , "Waiter" , "Manager" , "Cook"]
    },
    token:{
        type:String
    },
})

module.exports = mongoose.model("User" , userSchema)