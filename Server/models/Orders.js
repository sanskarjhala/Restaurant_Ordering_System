const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table', // Reference to the Table model
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (manager)
        required: false
    },
    waiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (waiter)
        required: true
    },
    items:[
       {
        menuItems:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Menu"
        },
        quantity:{
            type:"Number",
            required:true,
            default:1,
        }
       }
    ],
    status:{
        type:String,
        enum:["Completed" , "onGoing"],
        default:"onGoing",
        required:true,
    }
    
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
