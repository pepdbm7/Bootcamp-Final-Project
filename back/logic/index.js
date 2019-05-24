const {
  models: { Product, Order, User }
} = require("planbe-data");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const {
  env: { SENDGRID_KEY }
} = process;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_KEY
    }
  })
);

const {
  AlreadyExistsError,
  AuthError,
  NotAllowedError,
  NotFoundError
} = require("../errors");
const validate = require("../utils/validate");

const logic = {
  /**
   * Register a user
   *
   * @param {*} type
   * @param {*} name
   * @param {*} surname
   * @param {*} username
   * @param {*} email
   * @param {*} password
   *
   * @throws {AlreadyExistsError} On already registered user with that username
   * @throws {AlreadyExistsError} On already registered user with that email
   */

  registerUser(type, name, surname, email, username, password) {
    validate([
      { key: "type", value: type, type: String },
      { key: "name", value: name, type: String },
      { key: "surname", value: surname, type: String },
      { key: "email", value: email, type: String },
      { key: "username", value: username, type: String },
      { key: "password", value: password, type: String }
    ]);

    return (async () => {
      let user = await User.findOne({ username });
      let _email = await User.findOne({ email });

      if (user)
        throw new AlreadyExistsError(`Username ${username} already registered`);
      if (_email)
        throw new AlreadyExistsError(`Email ${email} already registered`);

      user = new User({ type, name, surname, email, username, password });
      await user.save();
    })();
  },

  /**
   * send confirmation email of registration!
   *
   * @param {*} name
   * @param {*} email
   */

  sendConfirmationRegistration(name, email) {
    validate([
      { key: "name", value: name, type: String },
      { key: "email", value: email, type: String }
    ]);

    return transporter
      .sendMail({
        to: email, // email del cliente
        from: "hola@eatplanbe.com", // email de la empresa
        subject: "Sign in completed",
        html: `<h1>Hey ${name}!!</h1>
            <h2><font color="red">You have succesfully registered!</font></h2><br/><br/>
            <p><i><u>Planbe</u> Team</i></p>`
      })
      .then(() =>
        transporter.sendMail({
          to: "pepdbm7@gmail.com", // email del cliente
          from: "hola@eatplanbe.com", // email de la empresa
          subject: "New user registered!",
          html: `<h1>Hey ${name}!!</h1>
            <h2>You have a new user:</h2><br/><br/>
            <p>name: ${name}</p>
            <p>email: ${email}</p>`
        })
      );
  },

  /**
   * Authenticate a user
   *
   * @param {*} username
   * @param {*} password
   * @throws {AuthError} if no user with that username found, or if password is wrong
   */

  authenticateUser(username, password) {
    validate([
      { key: "username", value: username, type: String },
      { key: "password", value: password, type: String }
    ]);

    return (async () => {
      const user = await User.findOne({ username });

      if (!user || user.password !== password)
        throw new AuthError("invalid username or password");

      return user.id;
    })();
  },

  /**
   * Retrieve a user
   *
   * @param {*} id
   *
   * @throws {NotFoundError} on user not found
   */

  retrieveUser(id) {
    validate([{ key: "id", value: id, type: String }]);

    return (async () => {
      const user = await User.findById(id, {
        _id: 0,
        password: 0,
        orders: 0,
        __v: 0
      }).lean();

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      user.id = id;

      return user;
    })();
  },

  /**
   * update profile of a user
   *
   * @param {*} id
   * @param {*} type
   * @param {*} name
   * @param {*} surname
   * @param {*} email
   * @param {*} username
   * @param {*} newPassword
   * @param {*} password
   *
   * @throws {NotFoundError} on not found user with that id
   * @throws {AuthError} on invalid password
   * @throws {AlreadyExistsError} on user with that username already existing
   * @throws {AlreadyExistsError} on user with that email already existing
   */

  updateUser(id, type, name, surname, email, username, newPassword, password) {
    validate([
      { key: "id", value: id, type: String },
      { key: "type", value: type, type: String },
      { key: "name", value: name, type: String },
      { key: "surname", value: surname, type: String },
      { key: "email", value: email, type: String },
      { key: "username", value: username, type: String },
      { key: "newPassword", value: newPassword, type: String },
      { key: "password", value: password, type: String }
    ]);

    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      if (user.password !== password) throw new AuthError("invalid password");

      const _user = await User.findOne({ username });
      const _email = await User.findOne({ email });

      //avisamos q ese ya está cogido:
      if (_user)
        throw new AlreadyExistsError(`username ${username} already exists`);
      if (_email) throw new AlreadyExistsError(`email ${email} already used`);

      //cambiamos campos del usario, y salvamos:
      user.type = type;
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.username = username;
      user.password = newPassword;

      await user.save();
    })();
  },

  /**
   * send confirmation email of Profile Updated!
   *
   * @param {*} name
   * @param {*} email
   * @param {*} username
   * @param {*} newPassword
   */

  sendAccountUpdated(name, email, username, newPassword) {
    validate([
      { key: "name", value: name, type: String },
      { key: "email", value: email, type: String },
      { key: "username", value: username, type: String },
      { key: "newPassword", value: newPassword, type: String }
    ]);
    return transporter
      .sendMail({
        to: email, // email del cliente
        from: "planbe@gmail.com",
        subject: "Account Updated",
        html: `<h1>Hey ${name}!!</h1>
            <h2><font color="red">you have succesfully updated your account!<font></h2><br/><br/>
            <p><strong>Your new username is:</strong> ${username}</p><br/>
            <p><strong>Your new password is:</strong> ${newPassword}</p><br/><br/>
            <p><i><u>Planbe</u> Team</i></p>`
      })
      .then(res => {
        //(it was a promise)
        res.status(201);
        res.json({
          message: "Email correctly sent !!"
        });
      });
  },

  /**
   * send inquiry to the planbe team (for Next Iteration!)
   *
   * @param {*} id
   * @param {*} subject
   * @param {*} textarea
   *
   * @throws {NotFoundError} on not found user with that id
   */

  setContactEmailData(id, subject, textarea) {
    validate([
      { key: "id", value: id, type: String },
      { key: "subject", value: subject, type: String },
      { key: "textarea", value: textarea, type: String }
    ]);
    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      //enviamos datos de la orden a su email:
      const name = user.name;
      const username = user.username;
      const email = user.email;
      debugger;

      await this.sendContactEmail(subject, textarea, name, username, email);
    })();
  },

  sendContactEmail(subject, textarea, name, username, email) {
    debugger;
    validate([
      { key: "subject", value: subject, type: String },
      { key: "textarea", value: textarea, type: String },
      { key: "name", value: name, type: String },
      { key: "username", value: username, type: String },
      { key: "email", value: email, type: String }
    ]);
    // to the company:
    return transporter.sendMail({
      to: "pepdbm7@gmail.com", //'hola@eatplanbe.com',
      from: "planbe@gmail.com", //email,
      subject: subject,
      html: `<h1>Message from your client ${name}!!</h1>
        <p><strong>Client's username:</strong> ${username}<br/><br/>
        <strong>Client's email address:</strong> ${email}</p><br/><br/>
        <i>${textarea}/i>`
    });
  },

  /**
   * lists all products from database
   *
   * @throws {NotFoundError} on any found products on database
   */

  retrieveAllProducts() {
    return (async () => {
      const projection = {
        _id: true,
        type: true,
        name: true,
        price: true,
        image: true,
        description: true
      };
      const products = await Product.find({}, projection).lean(); // (lean para devolverlo como objeto plano)
      products.forEach(product => {
        product.id = product._id; //pasamos el _id de mongo a id
        delete product._id; //borramos el _id
      });
      if (!products) throw new NotFoundError("products not found");

      return products;
    })();
  },

  /**
   * add selected products to user's basket
   *
   * @param {*} id
   * @param {*} type
   * @param {*} name
   * @param {*} surname
   * @param {*} email
   * @param {*} username
   * @param {*} newPassword
   * @param {*} password
   *
   * @throws {NotFoundError} on not found user with that id
   * @throws {NotFoundError} on not found product with that id
   * @throws {AlreadyExistsError} on user with that username already existing
   * @throws {AlreadyExistsError} on user with that email already existing
   */

  addProductToUserCart(id, productId) {
    //al clicar el botón 'añadir a carrito'
    validate([
      { key: "id", value: id, type: String },
      { key: "productId", value: productId, type: String }
    ]);

    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      const product = await Product.findOne({ _id: productId });

      if (!product)
        throw new NotFoundError(`product with id ${productId} not found`);

      user.basket.push(product._id);

      await user.save();
    })();
  },

  /**
   * lists selected products to the cart
   *
   * @param {*} id
   *
   * @throws {NotFoundError} on not found user with that id
   */

  listCartProducts(id) {
    validate([{ key: "id", value: id, type: String }]);

    return (async () => {
      const user = await User.findById(id).lean();
      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      const productsArray = user.basket;

      if (productsArray.length) {
        const projection = {
          _id: true,
          type: true,
          name: true,
          price: true,
          image: true,
          quantity: true,
          description: true
        }; //ponemos true a los campos q queremos q nos devuelva
        // const products = await Product.find( {}, projection )
        let products = await Promise.all(
          productsArray.map(
            async productId =>
              await Product.findById(productId, projection).lean()
          )
        );

        products.forEach(product => {
          product.id = product._id.toString(); //pasamos el _id de mongo a id
          delete product._id; //borramos el _id
        });

        //la cantidad de cada producto será el núm d veces q se repita:
        products.forEach(_product => {
          let repeatedTimes = products.filter(
            __product => __product.id === _product.id
          );
          _product.quantity = repeatedTimes.length;
        });

        //eliminamos las repeticiones d cada producto:
        products.forEach(_product =>
          products.filter(__product => __product.id !== _product.id)
        );

        const flags = new Set();
        let productsToList = products.filter(product => {
          if (flags.has(product.id)) {
            return false;
          }
          flags.add(product.id);
          return product;
        });

        //para que se listen siempre en el mismo orden, aunque con el delete se cambie
        productsToList = productsToList.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );

        return productsToList;
      } else {
        //si basket.length = 0:
        return [];
      }
    })();
  },

  /**
   * Removes a product
   *
   * @param {string} id The user id
   * @param {string} productId The product id
   *
   * @throws {NotFoundError} On not found user id, or not found product id
   * @throws {NotFoundError} On not found user's basket
   * @throws {NotFoundError} On not found product with that id
   * @throws {NotFoundError} On not found product in the basket
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id, or product id
   */

  removeProduct(id, productId) {
    validate([
      { key: "id", value: id, type: String },
      { key: "productId", value: productId, type: String }
    ]);
    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      let basket = user.basket;

      if (!basket) throw new NotFoundError(`user 's basket not found`);

      const product = await Product.findById(productId);

      if (!product)
        throw new NotFoundError(`product with id ${productId} not found`);

      if (basket.length) {
        const productInCart = user.basket.filter(
          _productId => _productId == productId
        );

        if (!productInCart.length)
          throw new NotFoundError(
            `product with id ${productId} not found in the basket`
          );

        const duplicated = user.basket.filter(
          _productId => _productId == productId
        );
        const different = user.basket.filter(
          _productId => _productId != productId
        );

        if (duplicated.length) {
          duplicated.pop();
          user.basket = different.concat(duplicated);
        }
        await user.save();
      }
    })();
  },

  /**
   * Adds one more of a selected product
   *
   * @param {string} id The user id
   * @param {string} productId The product id
   *
   * @throws {NotFoundError} On not found user id, or not found product id
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id, or product id
   */

  addMore(id, productId) {
    validate([
      { key: "id", value: id, type: String },
      { key: "productId", value: productId, type: String }
    ]);

    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      const product = await Product.findOne({ _id: productId });

      if (!product)
        throw new NotFoundError(`product with id ${productId} not found`);

      user.basket.push(product._id);

      await user.save();
    })();
  },

  /**
   * create new order:
   *
   * @param {string} userId The user id
   * @param {array} products The product of the basket
   * @param {string} total The total to pay
   *
   * @throws {NotFoundError} on not found user with that id
   * @throws {AlreadyExistsError} On order with that id already existing
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id
   */

  createNewOrder(userId, products, total) {
    validate([
      { key: "userId", value: userId, type: String },
      { key: "products", value: products, type: Array },
      { key: "total", value: total, type: String }
    ]);

    return (async () => {
      const user = await User.findById(userId);

      if (!user) throw new NotFoundError(`User with id ${userId} not found`);

      const order = new Order({ products: products, total: total });
      user.orders.forEach(_order => {
        if (_order._id === order._id)
          throw new AlreadyExistsError(
            `Order with id ${order._id} already exists in user!`
          );
        _order.id = order._id; //creamos id
        delete order._id; //borramos el _id
      });

      await user.orders.push(order);

      await user.save();
    })();
  },

  /**
   * adds details to the new order:
   *
   * @param {string} userId The user id
   * @param {string} place The address where to drop it
   * @param {string} day
   * @param {string} month
   * @param {string} year
   * @param {string} time The time frame
   * @param {string} comments The comments if written
   * @param {boolean} paid Status of the order
   *
   * @throws {NotFoundError} on not found user with that id
   * @throws {AlreadyExistsError} On more unfinished orders existing
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id
   */

  addDroppingDetails(id, place, day, month, year, time, comments, paid) {
    validate([
      { key: "id", value: id, type: String },
      { key: "place", value: place, type: String },
      { key: "day", value: day, type: String },
      { key: "month", value: month, type: String },
      { key: "year", value: year, type: String },
      { key: "time", value: time, type: String },
      { key: "comments", value: comments, type: String, optional: true },
      { key: "paid", value: paid, type: Boolean }
    ]);

    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      const userOrders = user.orders;

      if (userOrders.length) {
        //encontramos la order inacabada
        const pendingOrder = userOrders.find(
          order => !(order.place && order.time && order.paid)
        );

        if (pendingOrder && pendingOrder.length > 1)
          throw new AlreadyExistsError(
            `There are more than one pending order!!!`
          );

        //reemplazamos el _id por un id:
        pendingOrder.id = pendingOrder._id;
        delete pendingOrder._id;

        //creamos y llenamos los nuevos fields d la orden inacabada:
        pendingOrder.place = place;
        pendingOrder.day = day;
        pendingOrder.month = month;
        pendingOrder.year = year;
        pendingOrder.time = time;
        pendingOrder.comments = comments;
        pendingOrder.paid = paid;

        //enviamos datos de la orden a su email:
        const _name = user.name;
        const _email = user.email;
        const _total = pendingOrder.total;
        const _products = pendingOrder.products.forEach(
          product => product.name
        );

        //vaciamos su carrito:
        user.basket = [];

        debugger;

        await user.save();

        await this.sendConfirmationOrder(
          _name,
          _email,
          place,
          day,
          month,
          year,
          time,
          comments,
          _products,
          _total
        );

        return true;
      }
    })();
  },

  /**
   * send confirmation of order by email:
   *
   * @param {string} name
   * @param {string} email
   * @param {string} place
   * @param {string} day
   * @param {string} month
   * @param {string} year
   * @param {string} time
   * @param {string} comments
   * @param {array} products
   * @param {string} total
   */

  sendConfirmationOrder(
    name,
    email,
    place,
    day,
    month,
    year,
    time,
    comments,
    products,
    total
  ) {
    validate([
      { key: "name", value: name, type: String },
      { key: "email", value: email, type: String },
      { key: "place", value: place, type: String },
      { key: "day", value: day, type: String },
      { key: "month", value: month, type: String },
      { key: "year", value: year, type: String },
      { key: "time", value: time, type: String },
      { key: "comments", value: comments, type: String },
      { key: "products", value: products, type: Array },
      { key: "total", value: total, type: String }
    ]);

    return transporter.sendMail({
      to: "pepdbm7@gmail.com", //será el email del cliente
      from: "hola@eatplanbe.com",
      subject: "Order completed",
      html: `<h1>Hey ${name}!</h1>
                <h2 style="color: blue;>Your order has been successfully done!</h2>
                <p style="color: blue>Your breakfast will be sent to <b>${place}</b> on the <b>${day}</b>, <b>${month}</b> of <b>${year}</b>, in the time frame of <b>${time}</b>.</p>
                <p style="color: blue>The <b>products</b> bought were: ${products}</p>
                <p style="color: blue>The total paid was <b>${total} €</b></p>
                <p style="color: blue>Comments: ${comments}</p>
                <h1 style="color: red; text-align: center; text-decoration: underline overline"><b>Enjoy your meal!!</b></h1>`
    });
  },

  /**
   * deletes unfinished orders:
   *
   * @param {string} userId The user id
   *
   * @throws {NotFoundError} on not found user with that id
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id
   */

  deleteUnfinishedOrders(id) {
    validate([{ key: "id", value: id, type: String }]);
    return (async () => {
      const user = await User.findById(id);

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      let ordersArray = user.orders;

      if (ordersArray.length) {
        //buscamos ordenes inacabadas:
        const pendingOrders = await ordersArray.filter(
          order => !(order.place && order.time && order.paid)
        ); //encontramos order(s) incompleta(s) y la(s) ELIMINAMOS

        //recorremos y eliminamos (con un splice) las ordenes pendientes (las q no tienen ciertos campos):
        await pendingOrders.forEach(x =>
          ordersArray.splice(
            ordersArray.findIndex(
              order =>
                !(
                  order.place ||
                  order.day ||
                  order.month ||
                  order.year ||
                  order.comments ||
                  order.paid
                ),
              1
            )
          )
        );

        await user.save();
      }
    })();
  },

  /**
   * retrieve all past orders:
   *
   * @param {string} userId The user id
   *
   * @throws {NotFoundError} on not found user with that id
   *
   * @returns {Promise} Resolves on correct data, rejects on wrong user id
   */

  retrieveOrders(id) {
    validate([{ key: "id", value: id, type: String }]);

    return (async () => {
      const user = await User.findById(id)
        .populate({ path: "orders.products" })
        .lean(); //populate de nivel 2!!

      if (!user) throw new NotFoundError(`user with id ${id} not found`);

      const orders = user.orders;
      return orders;
    })();
  }
};

module.exports = logic;
