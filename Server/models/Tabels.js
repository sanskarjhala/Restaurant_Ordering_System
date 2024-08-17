const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Occupied" , "Free"],
        default: 'Occupied'
    }
}, {
    timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
