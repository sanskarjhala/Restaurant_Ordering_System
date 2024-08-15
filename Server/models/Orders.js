const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (customer)
        required: true
    },
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
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (cook)
        required: true
    },
    items:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Menu"
        }
    ]

}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
