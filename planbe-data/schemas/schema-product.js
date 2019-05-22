const { Schema } = require('mongoose')

const Product = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        data: Buffer,
        required: true 
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = Product


