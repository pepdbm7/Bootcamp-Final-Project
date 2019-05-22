const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Order = new Schema({

    products: [{
        type: ObjectId,
        ref: 'Product',
        required: true
    }],
    total: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: false,
    },    
    day:{
        type: String,
        required: false,
    },
    month:{
        type: String,
        required: false,
    },
    year:{
        type: String,
        required: false,
    },    
    time: {
        type: String,
        required: false
    },
    comments: {
        type: String,
        required: false
    },
    paid: {
        type: Boolean,
        required: false
    }
})

module.exports = Order


