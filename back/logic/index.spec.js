const { mongoose, models: { Product, Order, User } } = require('planbe-data')

//      ..\back> mocha logic/index.spec.js

const logic = require('.')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')


const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/planbe-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let type, name, surname, email, username, password

            beforeEach(() => {
                type = 'Corporate'
                name = `Joe`
                surname = `Doe`
                email = `jd@jdjd.com`
                username = `joedoe`
                password = `123`
                
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(type, name, surname, email, username, password)

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')

                expect(user.type).to.equal('Corporate')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
            })

            it('should fail on undefined type', () => {
                expect(() => logic.registerUser(undefined, name, surname, username, email, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty type', () => {
                expect(() => logic.registerUser('', name, surname, username, email, password)).to.throw(ValueError, 'type is empty or blank')
            })

            it('should fail on blank type', () => {
                expect(() => logic.registerUser('   \t\n', name, surname, username, email, password)).to.throw(ValueError, 'type is empty or blank')
            })

            it('should fail on number type', () => {
                expect(() => logic.registerUser(123, name, surname, email, username, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean type', () => {
                expect(() => logic.registerUser(true, name, surname, email, username, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array type', () => {
                expect(() => logic.registerUser(['one', 'two'], name, surname, email, username, password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object type', () => {
                expect(() => logic.registerUser({ key: 'value' }, name, surname, email, username, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(type, undefined, surname, username, email, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser(type, '', surname, username, email, password)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser(type, '   \t\n', surname, username, email, password)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on number name', () => {
                expect(() => logic.registerUser(type, 123, surname, email, username, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean name', () => {
                expect(() => logic.registerUser(type, true, surname, email, username, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array name', () => {
                expect(() => logic.registerUser(type, ['one', 'two'], surname, email, username, password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object name', () => {
                expect(() => logic.registerUser(type, { key: 'value' }, surname, email, username, password)).to.throw(TypeError, '[object Object] is not a string')
            })
            


            it('should fail on undefined surname', () => {
                expect(() => logic.registerUser(type, name, undefined, username, email, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(type, name, '', username, email, password)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on blank surname', () => {
                expect(() => logic.registerUser(type, name, '   \t\n', username, email, password)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on number surname', () => {
                expect(() => logic.registerUser(type, name, 123, email, username, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean surname', () => {
                expect(() => logic.registerUser(type, name, true, email, username, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array surname', () => {
                expect(() => logic.registerUser(type, name, ['one', 'two'], email, username, password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object surname', () => {
                expect(() => logic.registerUser(type, name, { key: 'value' }, email, username, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined email', () => {
                expect(() => logic.registerUser(type, name, surname, undefined, username, password)).to.throw(TypeError, 'undefined is not a string')
            })
            
            it('should fail on empty email', () => {
                expect(() => logic.registerUser(type, name, surname, '', username, password)).to.throw(ValueError, 'email is empty or blank')
            })
            
            it('should fail on blank email', () => {
                expect(() => logic.registerUser(type, name, surname, '   \t\n', username, password)).to.throw(ValueError, 'email is empty or blank')
            })

            it('should fail on number email', () => {
                expect(() => logic.registerUser(type, name, surname, 123, username, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean email', () => {
                expect(() => logic.registerUser(type, name, surname, true, username, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array email', () => {
                expect(() => logic.registerUser(type, name, surname, ['one', 'two'], username, password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object email', () => {
                expect(() => logic.registerUser(type, name, surname, { key: 'value' }, username, password)).to.throw(TypeError, '[object Object] is not a string')
            })
            

            
            it('should fail on undefined username', () => {
                expect(() => logic.registerUser(type, name, surname, email, undefined, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(type, name, surname, email, '', password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.registerUser(type, name, surname, email, '   \t\n', password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on number username', () => {
                expect(() => logic.registerUser(type, 123, surname, email, 123, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean username', () => expect(() => logic.registerUser(type, true, surname, email, true, password)).to.throw(TypeError, 'true is not a string'))

            it('should fail on array username', () => {
                expect(() => logic.registerUser(type, name, surname, email, ['one', 'two'], password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object username', () => {
                expect(() => logic.registerUser(type, name, surname, email, { key: 'value' }, password)).to.throw(TypeError, '[object Object] is not a string')
            })
            


            it('should fail on undefined password', () => {
                expect(() => logic.registerUser(type, name, surname,  email, username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.registerUser(type, name, surname,  email, username, '')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.registerUser(type, name, surname,  email, username, '   \t\n')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on number password', () => {
                expect(() => logic.registerUser(type, name, surname, email, username, 123)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean password', () => {
                expect(() => logic.registerUser(type, name, surname, email, username, true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array password', () => {
                expect(() => logic.registerUser(type, name, surname, email, username, ['one', 'two'])).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object password', () => {
                expect(() => logic.registerUser(type, name, surname, email, username, { key: 'value' })).to.throw(TypeError, '[object Object] is not a string')
            })

        

            // it('should fail if email is already used', async () => {

            //     expect(() => logic.registerUser('Individual', 'Joe', 'Doe', email, 'joedoe', '123')).to.throw(AlreadyExistsError, `Email jd@jdjd.com already registered`)
                
            // })

            // it('should fail if username is already used', async () => {

            //     expect(() => logic.registerUser('Individual', 'Joe', 'Doe', 'jd@jd.com', username, '123')).to.throw(AlreadyExistsError, `Username joedoe already registered`)
            
            // })


            it('should fail if email is already used', async () => {

                try {
                    
                    await logic.registerUser(type, name, surname, email, username, password)

                    await logic.registerUser('Individual', 'Joe', 'Doe', email, 'joed', '123')

                } catch (err) {

                    expect(err).to.be.instanceof(AlreadyExistsError) 

                    expect(err.message).to.equal('Email jd@jdjd.com already registered')
                }
                
            })

            it('should fail if username is already used', async () => {

                try {
                    
                    await logic.registerUser(type, name, surname, email, username, password)

                    await logic.registerUser('Individual', 'Joe', 'Doe', 'jd@jd.com', username, '123')
                    
                } catch (err) {

                    expect(err).to.be.instanceof(AlreadyExistsError) 

                    expect(err.message).to.equal('Username joedoe already registered')
                }

            
            })
        })



        describe('authenticate', () => {
            let user


            beforeEach(() => (user = new User({ type: 'Individual', name: 'John', surname: 'Doe', email: 'jd@jd.com', username: 'jd', password: '123' })).save())


            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })


            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.authenticateUser('', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.authenticateUser('   \t\n', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on number username', () => {
                expect(() => logic.authenticateUser(123, user.password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean username', () => {
                expect(() => logic.authenticateUser(true, user.password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array username', () => {
                expect(() => logic.authenticateUser(['one', 'two'], user.password)).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object username', () => {
                expect(() => logic.authenticateUser({ key: 'value' }, user.password)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.authenticateUser(user.username, '')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.authenticateUser(user.username, '   \t\n')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on number password', () => {
                expect(() => logic.authenticateUser(user.username, 123)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean password', () => {
                expect(() => logic.authenticateUser(user.username, true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array password', () => {
                expect(() => logic.authenticateUser(user.username, ['one', 'two'])).to.throw(TypeError, 'one,two is not a string')
            })

            it('should fail on object password', () => {
                expect(() => logic.authenticateUser(user.username, { key: 'value' })).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on incorrect password', async () => {

                try {
                    
                    await logic.authenticateUser(user.username, 'wrong')
                    
                } catch (err) {

                    expect(err).to.be.instanceof(AuthError)

                    expect(err.message).to.equal('invalid username or password')
                }
            })

            it('should fail on unregistered user', async () => {

                try {
                    
                    await logic.authenticateUser('notregistered', user.password)
                    
                } catch (err) {

                    expect(err).to.be.instanceof(AuthError)

                    expect(err.message).to.equal('invalid username or password')
                }
            })

        })



        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({ type: 'Individual', name: 'John', surname: 'Doe', email: 'jd@jd.com', username: 'jd', password: '123' })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, type, name, surname, username, email, password, orders } = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(type).to.equal(user.type)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(email).to.equal(user.email)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(orders).not.to.exist
            })

            it('should fail on undefined id', () => {
                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.retrieveUser(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on null id', () => {
                expect(() => logic.retrieveUser(null).to.throw(TypeError, 'null is not a string'))
            })

            it('should fail on blank id', () => {
                expect(() => logic.retrieveUser('    \n').to.throw(ValueError, 'name is empty or blank'))
            })

            it('should fail on number id', () => {
                expect(() => logic.retrieveUser(123).to.throw(TypeError, '123 is not a string'))
            })

            it('should fail on boolean id', () => {
                expect(() => logic.retrieveUser(true).to.throw(TypeError, 'true is not a string'))
            })

            it('should fail on array id', () => {
                expect(() => logic.retrieveUser(['one', 'two']).to.throw(TypeError, 'one,two is not a string'))
            })

            it('should fail on object id', () => {
                expect(() => logic.retrieveUser({ key: 'value' }).to.throw(TypeError, '[object Object] is not a string'))
            })
        })



        describe('update', () => {
            let user

            beforeEach(() => (user = new User({ type: 'Individual', name: 'John', surname: 'Doe', email: 'jd@jd.com', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {
                const { id, type, name, surname, email, username, password } = user

                const newType = 'Corporate'
                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newEmail = `${email}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                const res = await logic.updateUser(id, newType, newName, newSurname, newEmail, newUsername, newPassword, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.type).to.equal(newType)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.email).to.equal(newEmail)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
            })

            it('should fail on undefined id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(undefined, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(null, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser('     \n', type, name, surname, email, username, newPassword, password)).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on number id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(123, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(true, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser([1, 2], type, name, surname, email, username, newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object id', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser({ key: 'value' }, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(undefined, type, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, null, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, '     \n', name, surname, email, username, newPassword, password)).to.throw(ValueError, 'type is empty or blank')
            })

            it('should fail on number type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, 123, name, surname, email, username, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, true, name, surname, email, username, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, [1, 2], name, surname, email, username, newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object type', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, { key: 'value' }, name, surname, email, username, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, undefined, surname, email, username, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, null, surname, email, username, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, '     \n', surname, email, username, newPassword, password)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on number name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, 123, surname, email, username, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, true, surname, email, username, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, [1, 2], surname, email, username, newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object name', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, { key: 'value' }, surname, email, username, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, undefined, email, username, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, null, email, username, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, '     \n', email, username, newPassword, password)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on number surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, 123, email, username, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, true, email, username, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, [1, 2], email, username, newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object surname', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, { key: 'value' }, email, username, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, undefined, username, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, null, username, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, '     \n', username, newPassword, password)).to.throw(ValueError, 'email is empty or blank')
            })

            it('should fail on number email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, 123, username, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, true, username, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, [1, 2], username, newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object email', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, { key: 'value' }, username, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, undefined, newPassword, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, null, newPassword, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, '     \n', newPassword, password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on number username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, 123, newPassword, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, true, newPassword, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, [1, 2], newPassword, password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object username', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, { key: 'value' }, newPassword, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, undefined, password)).to.throw(TypeError, 'undefined is not a string')
            }),

            it('should fail on null newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, null, password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, '     \n', password)).to.throw(ValueError, 'newPassword is empty or blank')
            })

            it('should fail on number newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, 123, password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, true, password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, [1, 2], password)).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object newPassword', () => {
                const { id, type, name, surname, email, username, newPassword, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, { key: 'value' }, password)).to.throw(TypeError, '[object Object] is not a string')
            })



            it('should fail on undefined password', () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user
                
                expect(() =>  logic.updateUser(id, type, name, surname, email, username, newPassword, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on null password', () => {

                const newPassword = 'jd123'
                const { id, type, name, surname, email, username, password } = user
                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, null)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on blank password', async () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, '     \n')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on number password', async () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, 123)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on boolean password', async () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, true)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on array password', async () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, [1, 2])).to.throw(TypeError, '1,2 is not a string')
            })

            it('should fail on object password', async () => {

                const newPassword = 'jd123'

                const { id, type, name, surname, email, username, password } = user

                expect(() => logic.updateUser(id, type, name, surname, email, username, newPassword, { key: 'value' })).to.throw(TypeError, '[object Object] is not a string')
            })



            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({ type: 'Individual', name: 'John', surname: 'Doe', email: 'jd@jd2.com', username: 'jd2', password: '123' })

                    await user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, type, name, surname, email, username, password } = user2
                    const newPassword = '246'

                    const newUsername = 'jd1234'

                    try {
                        const res = await logic.updateUser(id, type, name, surname, email, newUsername, newPassword, password)

                        await res.save()

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)
                    } finally {
                        const _user = await User.findById(id)
                        debugger
                        expect(_user.id).to.equal(id)
                        expect(_user.type).to.equal(type)
                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.email).to.equal(email)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    }
                })
            })
        })
    })


    describe('products', () => {

        let product1, product2, product3, product4, productId, userId
        
        beforeEach(async () => {

            product1 = new Product({type: "sandwich", name: "Beirut", price: 3.5, image: "foto.png", quantity: "1", description: "Cucumber, Hummus, Olive cream & Mezclum"})
            
            await product1.save()
            
            product2 = new Product({type: "sandwich", name: "Damasco", price: 3.5, image: "foto.png", quantity: "1", description: "Carrot, Tender onion, Egg, BabaGanoush & Arugula"})
            
            await product2.save()
            
            product3 = new Product({type: "sandwich", name: "Shanghai", price: 3.5, image: "foto.png", quantity: "1", description: "Turkey, Tender Onion, Cheddar, Mezclum & Hoisin"})
            
            await product3.save()
            
            product4 = new Product({type: "sandwich", name: "Oslo", price: 4.9, image: "foto.png", quantity: "1", description: "Smoked Salmon, Cucumber, Canons & Citrus"})
            
            await product4.save()


            productId = product1.id
    
            let user
    
            user = new User({ type: 'Individual', name: 'James', surname: 'Doe', email: 'james@jd.com', username: 'jamesd', password: '123' })
    
            await user.save()
    
            userId = user.id
            
        })
        
        describe('retrieve all products', () => {

            it('should succeed on retrieving all products from database ', async () => {
                
                try {
                    
                    await logic.retrieveAllProducts()
                    
                } catch (err) {
                    
                    expect(err).to.be.instanceof(NotFoundError)
                    
                    expect(err.message).to.equal('products not found')
                }
                
            })

            it('should fail on retrieving a non-existent product from database ', async () => {

                await Promise.all([Product.deleteMany()])

                try {
                    await logic.retrieveAllProducts()
                    
                } catch (err) {
                    
                    expect(err).to.be.instanceof(NotFoundError)
                    
                    expect(err.message).to.equal('products not found')
                }
                
            })
                
        })

        describe('add a product to the user cart', () => {

            it('should succeed on adding a product to user Cart', async () => {
                
                await logic.addProductToUserCart(userId, productId)
                    
            })


            it('should fail on undefined userId', () => {

                expect(() => logic.addProductToUserCart(undefined, productId)).to.throw(TypeError, 'undefined is not a string')

            }),


            it('should fail on null userId', () => {

                expect(() => logic.addProductToUserCart(null, productId)).to.throw(TypeError, 'null is not a string')

            })


            it('should fail on blank userId', () => {

                expect(() => logic.addProductToUserCart('     \n', productId)).to.throw(ValueError, 'id is empty or blank')

            })


            it('should fail on number userId', () => {

                expect(() => logic.addProductToUserCart(123, productId)).to.throw(TypeError, '123 is not a string')
            })


            it('should fail on boolean userId', () => {

                expect(() => logic.addProductToUserCart(true, productId)).to.throw(TypeError, 'true is not a string')
            })


            it('should fail on array userId', () => {

                expect(() => logic.addProductToUserCart([1, 2], productId)).to.throw(TypeError, '1,2 is not a string')
            })


            it('should fail on object userId', () => {

                expect(() => logic.addProductToUserCart({ key: 'value' }, productId)).to.throw(TypeError, '[object Object] is not a string')
            })




            it('should fail on undefined userId', () => {

                expect(() => logic.addProductToUserCart(userId, undefined)).to.throw(TypeError, 'undefined is not a string')

            }),


            it('should fail on null userId', () => {

                expect(() => logic.addProductToUserCart(userId, null)).to.throw(TypeError, 'null is not a string')

            })


            it('should fail on blank userId', () => {

                expect(() => logic.addProductToUserCart(userId, '     \n')).to.throw(ValueError, 'productId is empty or blank')

            })


            it('should fail on number userId', () => {

                expect(() => logic.addProductToUserCart(userId, 123)).to.throw(TypeError, '123 is not a string')
            })


            it('should fail on boolean userId', () => {

                expect(() => logic.addProductToUserCart(userId, true)).to.throw(TypeError, 'true is not a string')
            })


            it('should fail on array userId', () => {

                expect(() => logic.addProductToUserCart(userId, [1, 2])).to.throw(TypeError, '1,2 is not a string')
            })

            
            it('should fail on object userId', () => {

                expect(() => logic.addProductToUserCart(userId, { key: 'value' })).to.throw(TypeError, '[object Object] is not a string')
            })


        })
    })

    afterEach(() => Promise.all([User.deleteMany()]))

    after(() => mongoose.disconnect())
    
})