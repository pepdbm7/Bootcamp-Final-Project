const logic = {
  _userId: sessionStorage.getItem("userId") || null,
  _token: sessionStorage.getItem("token") || null,

  url: "NO-URL",

  registerUser(type, name, surname, email, username, password) {
    if (typeof type !== "string") throw TypeError(`${type} is not a string`);
    if (typeof name !== "string") throw TypeError(`${name} is not a string`);
    if (typeof surname !== "string")
      throw TypeError(`${surname} is not a string`);
    if (typeof email !== "string") throw TypeError(`${email} is not a string`);
    if (typeof username !== "string")
      throw TypeError(`${username} is not a string`);
    if (typeof password !== "string")
      throw TypeError(`${password} is not a string`);

    if (!type.trim()) throw Error("type is empty or blank");
    if (!name.trim()) throw Error("name is empty or blank");
    if (!surname.trim()) throw Error("surname is empty or blank");
    if (!email.trim()) throw Error("email is empty or blank");
    if (!username.trim()) throw Error("username is empty or blank");
    if (!password.trim()) throw Error("password is empty or blank");

    //to validate email (local part can contain any alphanumeric character, punctuation, special characters, has only 1 dot or 1 hyphen (-), and they aren't the 1st or last char, etc):
    const regexp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!regexp.test(email)) throw Error("email not valid");

    return fetch(`${this.url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ type, name, surname, email, username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  login(username, password) {
    if (typeof username !== "string")
      throw TypeError(`${username} is not a string`);
    if (typeof password !== "string")
      throw TypeError(`${password} is not a string`);

    if (!username.trim()) throw Error("username is empty or blank");
    if (!password.trim()) throw Error("password is empty or blank");

    return fetch(`${this.url}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
        const { id, token } = res.data;

        this._userId = id;
        this._token = token;

        sessionStorage.setItem("userId", id);
        sessionStorage.setItem("token", token);
      });
  },

  retrieveUser() {
    let id = this._userId;

    if (typeof id !== "string") throw new TypeError(`${id} is not a string`);
    if (!id.trim().length) throw Error("id is empty or blank");

    return fetch(`${this.url}/users/${this._userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);

        return res.data;
      });
  },

  get loggedIn() {
    return !!this._userId;
  },

  logout() {
    this._userId = null;
    this._token = null;

    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
  },

  // Update PROFILE:

  sendUpdatedInfo(
    type,
    name,
    surname,
    email,
    username,
    newPassword,
    confirmPassword,
    password
  ) {
    if (typeof type !== "string") throw TypeError(`${type} is not a string`);
    if (typeof name !== "string") throw TypeError(`${name} is not a string`);
    if (typeof surname !== "string")
      throw TypeError(`${surname} is not a string`);
    if (typeof email !== "string") throw TypeError(`${email} is not a string`);
    if (typeof username !== "string")
      throw TypeError(`${username} is not a string`);
    if (typeof newPassword !== "string")
      throw TypeError(`${newPassword} is not a string`);
    if (typeof confirmPassword !== "string")
      throw TypeError(`${confirmPassword} is not a string`);
    if (typeof password !== "string")
      throw TypeError(`${password} is not a string`);

    if (!type.trim()) throw Error("type is empty or blank");
    if (!name.trim()) throw Error("name is empty or blank");
    if (!surname.trim()) throw Error("surname is empty or blank");
    if (!email.trim()) throw Error("email is empty or blank");
    if (!username.trim()) throw Error("username is empty or blank");
    if (!newPassword.trim()) throw Error("newPassword is empty or blank");
    if (!newPassword.trim()) throw Error("newPassword is empty or blank");
    if (!password.trim()) throw Error("password is empty or blank");

    //to validate email (local part can contain any alphanumeric character, punctuation, special characters, has only 1 dot or 1 hyphen (-), and they aren't the 1st or last char, etc):
    const regexp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!regexp.test(email)) throw Error("email not valid");

    if (newPassword !== confirmPassword)
      throw Error("new password different of confirmation");

    return fetch(`${this.url}/update/${this._userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({
        type,
        name,
        surname,
        email,
        username,
        newPassword,
        confirmPassword,
        password
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  //send CONTACT info:

  sendContactForm(subject, textarea) {
    //TODO: No funciona!!

    if (typeof subject !== "string")
      throw TypeError(`${subject} is not a string`);
    if (typeof textarea !== "string")
      throw TypeError(`${textarea} is not a string`);

    if (!subject.trim()) throw Error("subject is empty or blank");
    if (!textarea.trim()) throw Error("textarea is empty or blank");

    return fetch(`${this.url}/contact/${this._userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({ subject, textarea })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  //HOME:

  listAllProducts() {
    return fetch(`${this.url}/home`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);

        return res.data;
      });
  },

  addProductToCart(id) {
    //product id
    if (typeof id !== "string") throw TypeError(`${id} is not a string`);

    if (!id.trim()) throw Error("id is empty or blank");

    return fetch(`${this.url}/cart/${this._userId}/product/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  //CART:

  listCartProducts() {
    let id = this._userId;

    if (typeof id !== "string") throw new TypeError(`${id} is not a string`);
    if (!id.trim().length) throw Error("id is empty or blank");

    return fetch(`${this.url}/cart/${this._userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);

        return res.data;
      });
  },

  removeProductFromCart(id) {
    //product id
    if (typeof id !== "string") throw new TypeError(`${id} is not a string`);

    if (!id.trim().length) throw Error("id is empty or blank");

    return fetch(`${this.url}/cart/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  addMore(id) {
    //product id
    if (typeof id !== "string") throw TypeError(`${id} is not a string`);

    if (!id.trim()) throw Error("id is empty or blank");

    return fetch(`${this.url}/cart/${this._userId}/more/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  //ORDER

  createNewOrder(products, total) {
    if (typeof products !== "object")
      throw TypeError(`${products} is not an array`);
    if (typeof total !== "string") throw TypeError(`${total} is not a string`);

    if (!products) throw Error("products is an empty array");
    if (!total.trim()) throw Error("total is empty or blank");

    return fetch(`${this.url}/cart/${this._userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({ products, total })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  deleteUnfinishedOrders() {
    return fetch(`${this.url}/setorder/${this._userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
      });
  },

  addDroppingDetails(place, day, month, year, time, comments, paid) {
    if (typeof place !== "string") throw TypeError(`${place} is not a string`);
    if (typeof day !== "string") throw TypeError(`${day} is not a string`);
    if (typeof month !== "string") throw TypeError(`${month} is not a string`);
    if (typeof year !== "string") throw TypeError(`${year} is not a string`);
    if (typeof time !== "string") throw TypeError(`${time} is not a string`);
    if (comments && typeof comments !== "string")
      throw TypeError(`${comments} is not a string`);
    if (typeof paid !== "boolean") throw TypeError(`${paid} is not a boolean`);

    if (!place.trim()) throw Error("place is empty or blank");
    if (!day.trim()) throw Error("day is empty or blank");
    if (!month.trim()) throw Error("month is empty or blank");
    if (!year.trim()) throw Error("year is empty or blank");
    if (!time.trim()) throw Error("time is empty or blank");
    if (!paid) throw Error("paid is not true!");
    return fetch(`${this.url}/setorder/${this._userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({ place, day, month, year, time, comments, paid })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res);
          throw Error(res.error);
        }
      });
  },

  retrieveOrders() {
    let id = this._userId;

    if (typeof id !== "string") throw new TypeError(`${id} is not a string`);
    if (!id.trim().length) throw Error("id is empty or blank");

    return fetch(`${this.url}/vieworders/${this._userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error);
        return res.data;
      });
  }
};

export default logic;
// module.exports = logic
