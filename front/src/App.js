import React from "react";

//components:
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import Update from "./components/Update";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import SetOrder from "./components/SetOrder";
import ViewOrders from "./components/ViewOrders";

//Logic
import logic from "./logic";
import { Route, withRouter, Redirect } from "react-router-dom";

logic.url = "https://young-reef-84922.herokuapp.com/api"; //to use serverside connected to heroku
// logic.url = "http://localhost:5000/api"; //to use serverside of this repo

const App = props => {
  //REDIRECTS:
  const handleRegisterClick = () => props.history.push("/register");
  const handleLoginClick = () => props.history.push("/login");
  const handleGoBack = () => props.history.push("/");

  return (
    <div className="container-app">
      <Route
        exact
        path="/"
        render={() =>
          !logic.loggedIn ? (
            <Landing
              onRegisterClick={handleRegisterClick}
              onLoginClick={handleLoginClick}
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
            <Register onGoBack={handleGoBack} />
          ) : (
            <Redirect to="/home" />
          )
        }
      />
      <Route
        path="/login"
        render={() =>
          !logic.loggedIn ? (
            <Login onGoBack={handleGoBack} />
          ) : (
            <Redirect to="/home" />
          )
        }
      />

      {/* ONCE LOGGED IN: */}

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
        render={() => (logic.loggedIn ? <Update /> : <Redirect to="/" />)}
      />

      <Route
        path="/vieworders"
        render={() => (logic.loggedIn ? <ViewOrders /> : <Redirect to="/" />)}
      />

      <Route
        path="/cart"
        render={() => (logic.loggedIn ? <Cart /> : <Redirect to="/" />)}
      />

      <Route
        path="/setorder"
        render={() => (logic.loggedIn ? <SetOrder /> : <Redirect to="/" />)}
      />
    </div>
  );
};

export default withRouter(App);
