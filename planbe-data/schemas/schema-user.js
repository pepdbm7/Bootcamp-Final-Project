const { Schema, SchemaTypes:{ObjectId} } = require('mongoose')
const Order = require('../schemas/schema-order')


const User = new Schema({
    type: {
        type: String,
        require: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    basket: [{
        type: ObjectId,
        ref: 'Product'
    }],
    orders: [Order]
})

module.exports = User