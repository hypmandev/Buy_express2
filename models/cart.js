const { required } = require("joi");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users"
    },
    products: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Products"
        },
        quantity: {
            type: Number,
            default: 1
        },
        unitPrice: {
            type: Number,
            required: true
        },
        unitTotal: {
            type: Number,
            required: true
        },
        productName: {
            type: String,
            required: true
        }
    }],
    grandTotal: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const cartModel = mongoose.model("Cart", cartSchema)

module.exports = cartModel