const { required } = require("joi")
const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    productIds : [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Products"
    }]
}, {timestamps: true})

const categoriesModel = mongoose.model("Category", categoriesSchema)

module.exports = categoriesModel