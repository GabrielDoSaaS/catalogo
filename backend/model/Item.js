const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageString: { type: String, required: true },
    category: {type: String, require: false},
    variants: { type: Array, default: []}
});

module.exports = mongoose.model('Item', ItemSchema);