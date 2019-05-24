const {
  mongoose,
  models: { Product, Order, User }
} = require("planbe-data");

//To run the tests:
// normal -> mocha src/logic.spec.js --timeout 10000
// debug -> mocha debug src/logic.spec.js --timeout 10000

require("isomorphic-fetch");

global.sessionStorage = require("sessionstorage");

const logic = require("./logic");

// logic.url = "https://young-reef-84922.herokuapp.com/api"; //to use serverside connected to heroku
logic.url = "http://localhost:5000/api"; //to use serverside of this repo

const { expect } = require("chai");

const MONGO_URL = "mongodb://localhost:27017/planbe-test";

describe("logic", () => {
  before(() =>
    mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true }
    )
  );

  describe("users", () => {
    beforeEach(() => Promise.all([User.deleteMany()]));

    //Register:
    describe("register", () => {
      let type, firstName, lastName, email, username, password;

      beforeEach(() => {
        type = "Individual";
        firstName = `firstName-${Math.random()}`;
        lastName = `lastName-${Math.random()}`;
        email = `email-${Math.random()}@email.com`;
        username = `username-${Math.random()}`;
        password = `password-${Math.random()}`;
      });

      it("should succeed on correct data", () =>
        logic
          .registerUser(type, firstName, lastName, email, username, password)
          .then(() => expect(true).to.be.true));

      it("should fail on undefined type", () => {
        expect(() =>
          logic.registerUser(
            undefined,
            firstName,
            lastName,
            email,
            username,
            password
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined name", () => {
        expect(() =>
          logic.registerUser(
            type,
            undefined,
            lastName,
            email,
            username,
            password
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined surname", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            undefined,
            email,
            username,
            password
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined email", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            lastName,
            undefined,
            username,
            password
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined username", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            lastName,
            email,
            undefined,
            password
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined password", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            lastName,
            email,
            username,
            undefined
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on empty string as type", () => {
        expect(() =>
          logic.registerUser(
            " ",
            firstName,
            lastName,
            email,
            username,
            password
          )
        ).to.throw(Error, "type is empty or blank");
      });
      it("should fail on empty string as name", () => {
        expect(() =>
          logic.registerUser(type, "  ", lastName, email, username, password)
        ).to.throw(Error, "name is empty or blank");
      });
      it("should fail on empty string as surname", () => {
        expect(() =>
          logic.registerUser(type, firstName, "  ", email, username, password)
        ).to.throw(Error, "surname is empty or blank");
      });
      it("should fail on empty string as email", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            lastName,
            "  ",
            username,
            password
          )
        ).to.throw(Error, "email is empty or blank");
      });
      it("should fail on empty string as username", () => {
        expect(() =>
          logic.registerUser(type, firstName, lastName, email, "  ", password)
        ).to.throw(Error, "username is empty or blank");
      });
      it("should fail on empty string as password", () => {
        expect(() =>
          logic.registerUser(type, firstName, lastName, email, username, "  ")
        ).to.throw(Error, "password is empty or blank");
      });
      it("should fail on wrong email format", () => {
        expect(() =>
          logic.registerUser(
            type,
            firstName,
            lastName,
            "jdjdjd",
            username,
            password
          )
        ).to.throw(Error, "email not valid");
      });
    });

    //--------------------------------------------------

    // Login
    describe("login", () => {
      it("should succeed on correct data", () =>
        logic.login("p", "p").then(() => expect(true).to.be.true));

      it("should fail on undefined username", () => {
        const username = undefined;

        expect(() => logic.login(username, "123")).to.throw(
          Error,
          `${username} is not a string`
        );
      });

      it("should fail on boolean username", () => {
        const username = true;

        expect(() => logic.login(username, "123")).to.throw(
          Error,
          `${username} is not a string`
        );
      });

      it("should fail on empty username", () => {
        const username = "   ";

        expect(() => logic.login(username, "123")).to.throw(
          Error,
          "username is empty or blank"
        );
      });

      it("should fail on undefined password", () => {
        const password = undefined;

        expect(() => logic.login("pepe", password)).to.throw(
          Error,
          `${password} is not a string`
        );
      });

      it("should fail on array password", () => {
        const password = [1, 2];

        expect(() => logic.login("pepe", password)).to.throw(
          Error,
          `${password} is not a string`
        );
      });

      it("should fail on empty password", () => {
        const password = "   ";

        expect(() => logic.login("pepe", password)).to.throw(
          Error,
          "password is empty or blank"
        );
      });
    });

    //--------------------------------------------------

    //Retrieve user:
    describe("retrieve", () => {
      beforeEach(() => Promise.all([User.deleteMany()]));

      it("should succeed on correct userId from localstorage", () => {
        logic
          .registerUser("Individual", "John", "Doe", "jd@jd.com", "jd", "123")
          .then(() => logic.login("jd", "123"))
          .then(() => logic.retrieveUser().then(() => expect(true).to.be.true));
      });

      it("should fail on a userId of type array", () => {
        const id = [1, 2];
        sessionStorage.setItem("userId", id);

        expect(() =>
          logic.retrieveUser().to.throw(TypeError(`${id} is not a string`))
        );
      });

      it("should fail on a userId of type boolean", () => {
        const id = true;
        sessionStorage.setItem("userId", id);

        expect(() =>
          logic.retrieveUser().to.throw(TypeError, `${id} is not a string`)
        );
      });

      it("should fail on a an empty string as userId", () => {
        const id = "    ";
        sessionStorage.setItem("userId", id);

        expect(() =>
          logic.retrieveUser().to.throw(Error, "id is empty or blank")
        );
      });
    });

    //--------------------------------------------------

    //Edit profile:
    describe("Edit profile", () => {
      let type, firstName, lastName, email, username, newPassword, password;

      type = "Individual";
      firstName = `firstName-${Math.random()}`;
      lastName = `lastName-${Math.random()}`;
      email = `email-${Math.random()}@email.com`;
      username = `username-${Math.random()}`;
      newPassword = `newpass-${Math.random()}`;
      password = `password-${Math.random()}`;

      Promise.all([User.deleteMany()]).then(() =>
        logic
          .registerUser(type, firstName, lastName, email, username, password)
          .then(() => logic.login(username, password))
      );

      it("should succeed on correct data", () => {
        logic
          .sendUpdatedInfo(
            type,
            firstName,
            lastName,
            email,
            username,
            newPassword,
            newPassword,
            password
          )
          .then(() => expect(true).to.be.true);
      });

      it("should fail on type of client of type boolean", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              true,
              firstName,
              lastName,
              email,
              username,
              newPassword,
              newPassword,
              password
            )
            .to.throw(TypeError, "type is not a string")
        );
      });

      it("should fail on Firstname of type array", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              [1, 2],
              lastName,
              email,
              username,
              newPassword,
              newPassword,
              password
            )
            .to.throw(TypeError, "name is not a string")
        );
      });

      it("should fail on Lastname of type undefined", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              undefined,
              email,
              username,
              newPassword,
              newPassword,
              password
            )
            .to.throw(TypeError, "surname is not a string")
        );
      });

      it("should fail on Email of type undefined", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              undefined,
              username,
              newPassword,
              newPassword,
              password
            )
            .to.throw(TypeError, "email is not a string")
        );
      });

      it("should fail on Username of type number", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              email,
              123,
              newPassword,
              newPassword,
              password
            )
            .to.throw(TypeError, "username is not a string")
        );
      });

      it("should fail on NewPassword of type array", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              email,
              username,
              [1, 2],
              newPassword,
              password
            )
            .to.throw(TypeError, "newPassword is not a string")
        );
      });

      it("should fail on NewPassword confirmation of type array", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              email,
              username,
              newPassword,
              [1, 2],
              password
            )
            .to.throw(TypeError, "newPassword is not a string")
        );
      });

      it("should fail on old Password of type number", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              email,
              username,
              newPassword,
              newPassword,
              123
            )
            .to.throw(TypeError, "password is not a string")
        );
      });

      it("should fail on empty string as a type of client", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            "  ",
            firstName,
            lastName,
            email,
            username,
            newPassword,
            newPassword,
            password
          )
        ).to.throw(Error, "type is empty or blank");
      });
      it("should fail on empty string as firstname", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            "   ",
            lastName,
            email,
            username,
            newPassword,
            newPassword,
            password
          )
        ).to.throw(Error, "name is empty or blank");
      });
      it("should fail on empty string as lastname", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            firstName,
            "  ",
            email,
            username,
            newPassword,
            newPassword,
            password
          )
        ).to.throw(Error, "surname is empty or blank");
      });
      it("should fail on empty string as email", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            firstName,
            lastName,
            " ",
            username,
            newPassword,
            newPassword,
            password
          )
        ).to.throw(Error, "email is empty or blank");
      });

      it("should fail on empty string as username", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            firstName,
            lastName,
            email,
            " ",
            newPassword,
            newPassword,
            password
          )
        ).to.throw(Error, "username is empty or blank");
      });

      it("should fail on empty string as newPassword", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            firstName,
            lastName,
            email,
            username,
            " ",
            newPassword,
            password
          )
        ).to.throw(Error, "newPassword is empty or blank");
      });

      it("should fail on empty string as password", () => {
        expect(() =>
          logic.sendUpdatedInfo(
            type,
            firstName,
            lastName,
            email,
            username,
            newPassword,
            newPassword,
            " "
          )
        ).to.throw(Error, "password is empty or blank");
      });

      it("should fail on wrong Email format", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              "jdjdjdjdjd",
              username,
              newPassword,
              newPassword,
              password
            )
            .to.throw(Error, "email not valid")
        );
      });

      it("should fail on New password not matching confirmation repetition", () => {
        expect(() =>
          logic
            .sendUpdatedInfo(
              type,
              firstName,
              lastName,
              email,
              username,
              newPassword,
              "anotherpassword",
              123
            )
            .to.throw(Error, "new password different of confirmation")
        );
      });
    });
  });

  //product
});
