import React, { Component } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import Update from "./components/Update";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import SetOrder from "./components/SetOrder";
import Payment from "./components/Payment";
import ViewOrders from "./components/ViewOrders";

import logic from "./logic";
import { Route, withRouter, Redirect } from "react-router-dom";

logic.url = "https://young-reef-84922.herokuapp.com/api";

class App extends Component {
  state = {
    products: [],
    total: "",
    place: "",
    day: "",
    month: "",
    year: "",
    comment: ""
  }; //tras pulsar PAY, enviamos todo el state a la api, creando y guardando un nuevo Order en Mongo con un POST

  //REDIRECT:
  handleRegisterClick = () => this.props.history.push("/register");

  handleLoginClick = () => this.props.history.push("/login");

  handleGoBack = () => this.props.history.push("/");

  //WHEN LOGGED IN:

  //USER
  updateProfile = (type, name, surname, username, newPassword, password) => {
    try {
      logic
        .modifyUser(type, name, surname, username, newPassword, password)
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push("/profile")
          );
        })
        .catch(err => this.setState({ error: err.message }));
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    return (
      <div className="container-app">
        <Route
          exact
          path="/"
          render={() =>
            !logic.loggedIn ? (
              <Landing
                onRegisterClick={this.handleRegisterClick}
                onLoginClick={this.handleLoginClick}
              />
            ) : (
              <Redirect to="/home" />
            )
          }
        />
        <Route
          path="/register"
          render={() =>
            !logic.loggedIn ? (
              <Register onGoBack={this.handleGoBack} />
            ) : (
              <Redirect to="/home" />
            )
          }
        />
        <Route
          path="/login"
          render={() =>
            !logic.loggedIn ? (
              <Login onGoBack={this.handleGoBack} />
            ) : (
              <Redirect to="/home" />
            )
          }
        />

        <Route
          path="/home"
          render={() => (logic.loggedIn ? <Home /> : <Redirect to="/" />)}
        />

        <Route
          path="/contact"
          render={() => (logic.loggedIn ? <Contact /> : <Redirect to="/" />)}
        />

        <Route
          path="/profile"
          render={() => (logic.loggedIn ? <Profile /> : <Redirect to="/" />)}
        />

        <Route
          path="/update"
          render={() =>
            logic.loggedIn ? (
              <Update onUpdate={this.updateProfile} />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        <Route
          path="/vieworders"
          render={() => (logic.loggedIn ? <ViewOrders /> : <Redirect to="/" />)}
        />

        <Route
          path="/cart"
          render={() =>
            logic.loggedIn ? (
              <Cart
                sendProductsToApp={this.sendProducts}
                sendTotalToApp={this.sendTotal}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        <Route
          path="/setorder"
          render={() =>
            logic.loggedIn ? (
              <SetOrder
                sendPlaceToApp={this.sendPlace}
                sendDayToApp={this.sendDay}
                sendMonthToApp={this.sendMonth}
                sendYearToApp={this.sendYear}
                sendCommentToApp={this.sendComment}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        <Route
          path="/payment"
          render={() =>
            logic.loggedIn ? (
              <Payment
                products={this.state.products}
                total={this.state.total}
                place={this.state.place}
                date={this.state.date}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
      </div>
    );
  }
}

export default withRouter(App);
