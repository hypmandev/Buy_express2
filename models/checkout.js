const mongoose = require("mongoose")

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        required: true
    },
    productIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }],
    grandTotal: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: String
    }
},{timestamps: true})

const checkoutModel = mongoose.model("Checkout", checkoutSchema)

module.exports = checkoutModel