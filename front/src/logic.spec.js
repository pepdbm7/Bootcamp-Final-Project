const { mongoose, models: { Product, Order, User } } = require('planbe-data')

// normal -> $ mocha src/logic.spec.js
// debug -> $ mocha debug src/logic.spec.js

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const logic = require('./logic')

logic.url = 'http://localhost:5000/api'

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/planbe-test'


describe('logic', () => {

    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany()]))

    describe('users', () => {
        describe('register', () => {

            it('should succeed on correct data', () =>
                logic.registerUser('Individual', 'John', 'Doe', 'jd@jd.com', `jd-${Math.random()}`, '123')
                    .then(() => expect(true).to.be.true)
            )

            it('should fail on undefined name', () => {
                expect(() =>
                    logic.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string')
            })

        })

        describe('login', () => {

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

        })

    })
    
})