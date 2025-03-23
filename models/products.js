const mongoose = require("mongoose")

const productDetailsSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        imageUrl: {
            type: String,
        },

        publicId: {
            type: String,
        }
    },
    categoryId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Categories",
        require: true
    },
    categoryName: {
        type: String
    }

}, { timestamps: true })

const productModel = mongoose.model("Products", productDetailsSchema)

module.exports = productModel