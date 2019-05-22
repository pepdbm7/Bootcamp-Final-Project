const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')

const jsonBodyParser = bodyParser.json()  //solo lo usamos para posts/puts, para parsear data d los forms

const router = express.Router()

const { env: { JWT_SECRET } } = process



//Let's define the routes of our API interface to transfer data from our app to our DB:

//to add a new registered user to DB:
router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { type, name, surname, email, username, password } = req.body
        return logic.registerUser(type, name, surname, email, username, password)
            .then(()=> logic.sendConfirmationRegistration(name, email))
            .then(() => {
                res.status(201)
                    res.json({
                        message: `${username} successfully registered`
                })
            })
    }, res)
})

//to send and authenticate login input data:
router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

//to retrieve all data of user from our DB:
router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

//to update user's account:
router.patch('/update/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { type, name, surname, email, username, newPassword, password } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, type, name, surname, email, username, newPassword, password)
            .then(() => {
                logic.sendAccountUpdated(name, email, username, newPassword)
            })
            .then(() =>
                res.json({
                    message: 'user updated!'
            })
        )
    }, res)
})



// CONTACT FORM:
router.post('/contact/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { subject, textarea } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.setContactEmailData(id, subject, textarea)   
    }, res)
})


//HOME PRODUCTS:

//Retrieve products to list them in Home:
router.get('/home', (req, res) => {
    routeHandler(() => {
        return logic.retrieveAllProducts()
            .then(product => res.json({
                    data: product
                })
            )
    }, res)
})



//CART:

//add a new product to cart: (we use patch as we EDIT the attribute 'basket' of User)
router.patch('/cart/:id/product/:productId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {

    routeHandler(() => {
        const { sub, params: { id, productId } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addProductToUserCart(id, productId)
            .then(() => res.json({
                message: 'product added to user.s basket'
            })
        )

    }, res)
})

router.patch('/cart/:id/more/:productId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {

    routeHandler(() => {
        const { sub, params: { id, productId } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addMore(id, productId)
            .then(() => res.json({
                message: 'product added to user.s basket'
            })
        )

    }, res)
})

//Retrieve user's basket's products to list them in Cart:
router.get('/cart/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')
        return logic.listCartProducts(id)
            .then(basket => res.json({
                data: basket
            })
        )
    }, res)
})


//Delete a product
router.delete('/cart/product/:productId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { productId } } = req

        if (!sub) throw Error('invalid user or token')

        return logic.removeProduct(sub, productId)
            .then(() => res.json({
                message: 'product removed'
            }))
    }, res)
})



//LAST ORDERS:

//create new Order and embed it into User DB:
router.post('/cart/:id',  [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { products, total } } = req
     
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.createNewOrder(id, products, total)
        .then(() => {
          
                res.status(201)
                res.json({
                    message: `Order successfully created`
                })
            })
    }, res)
})

//to delete it when going back:
router.delete('/setorder/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (!sub) throw Error('invalid user or token')
    
        return logic.deleteUnfinishedOrders(id)
            .then(() => res.json({
                message: 'Unfinished orders have been removed!'
            }))
    }, res)
})

//to add dropping details to order (PATCH):
router.patch('/setorder/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { place, day, month, year, time, comments, paid } } = req

        if (id !== sub) throw Error('token sub does not match user id')
        return logic.addDroppingDetails(id, place, day, month, year, time, comments, paid)
            .then(ok => {                

                res.json({
                message: 'Order successfully completed!'
            })}
        )

    }, res)
})

//retrieve Orders:
router.get('/vieworders/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveOrders(id)
        .then(orders => res.json({
            data: orders
        }))
    }, res)
})

//to get current order to get its _id:
// router.get('/setorder/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
//     routeHandler(() => {
//         const { sub, params: { id } } = req

//         if (id !== sub) throw Error('token sub does not match user id')

//         return logic.listOrders(id)
//             .then(orders => res.json({
//                 data: orders
//             }))
//     }, res)
// })

module.exports = router