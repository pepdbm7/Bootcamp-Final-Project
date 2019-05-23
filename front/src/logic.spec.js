const {
  mongoose,
  models: { Product, Order, User }
} = require("planbe-data");

// normal -> $ mocha src/logic.spec.js
// debug -> $ mocha debug src/logic.spec.js

require("isomorphic-fetch");

global.sessionStorage = require("sessionstorage");

const logic = require("./logic");

logic.url = "https://young-reef-84922.herokuapp.com/api";

const { expect } = require("chai");

const MONGO_URL = "mongodb://localhost:27017/planbe-test";

describe("logic", () => {
  before(() =>
    mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true }
    )
  );

  beforeEach(() => Promise.all([User.deleteMany()]));

  describe("users", () => {
    //Register:
    describe("register", () => {
      it("should succeed on correct data", () =>
        logic
          .registerUser(
            "Individual",
            "John",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
          .then(() => expect(true).to.be.true));

      it("should fail on undefined type", () => {
        expect(() =>
          logic.registerUser(
            undefined,
            "John",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined name", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            undefined,
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined surname", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            undefined,
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined email", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            undefined,
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined username", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "jd@jd.com",
            undefined,
            "123"
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on undefined password", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            undefined
          )
        ).to.throw(TypeError, "undefined is not a string");
      });
      it("should fail on empty string as type", () => {
        expect(() =>
          logic.registerUser(
            " ",
            "John",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(Error, "type is empty or blank");
      });
      it("should fail on empty string as name", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "   ",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(Error, "name is empty or blank");
      });
      it("should fail on empty string as surname", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "",
            "jd@jd.com",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(Error, "surname is empty or blank");
      });
      it("should fail on empty string as email", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "  ",
            `jd-${Math.random()}`,
            "123"
          )
        ).to.throw(Error, "email is empty or blank");
      });
      it("should fail on empty string as username", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "jd@jd.com",
            "  ",
            "123"
          )
        ).to.throw(Error, "username is empty or blank");
      });
      it("should fail on empty string as password", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "jd@jd.com",
            `jd-${Math.random()}`,
            ""
          )
        ).to.throw(Error, "password is empty or blank");
      });
      it("should fail on wrong email format", () => {
        expect(() =>
          logic.registerUser(
            "Individual",
            "John",
            "Doe",
            "jddotcom",
            `jd-${Math.random()}`,
            "123"
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
      it("should succeed on correct data", () =>
        logic.login("p", "p").then(() => expect(true).to.be.true));
    });
  });
});
