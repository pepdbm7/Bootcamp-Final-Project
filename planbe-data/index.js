const mongoose = require('mongoose')
const User = require('./schemas/schema-user')
const Order = require('./schemas/schema-order')
const Product = require('./schemas/schema-product')


module.exports = {
    mongoose,
    models: {
    Order: mongoose.model('Order', Order),
    User: mongoose.model('User', User),
    Product: mongoose.model('Product', Product)
    }
}
