const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    paymentDate: {
        type: String,
        required: true
    }
}, {timestamps: true})

const paymentModel = mongoose.model("Transactions", paymentSchema)

module.exports = paymentModel