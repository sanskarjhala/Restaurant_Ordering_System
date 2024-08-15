const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // Reference to the Order model
    }]
}, {
    timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
