import React, { Component } from "react";
import { withRouter } from "react-router";
import logic from "../logic";

class Login extends Component {
  state = {
    showSpinner: false,
    successMessage: null,
    errorMessage: null,
    username: "",
    password: ""
  };

  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({ ...this.state, [key]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      this.setState({ showSpinner: true });
      logic
        .login(username, password)
        .then(() =>
          this.setState(
            { showSpinner: false, successMessage: "Welcome!!" },
            () => {
              setTimeout(() => {
                this.setState({ successMessage: null });
                this.props.history.push("/home");
              }, 2000);
            }
          )
        )
        .catch(err => this.showError(err));
    } catch (err) {
      this.showError(err);
    }
  };

  showError = err => {
    this.setState({ showSpinner: false, errorMessage: err.message }, () => {
      setTimeout(() => {
        this.setState({ errorMessage: null });
      }, 2500);
    });
  };

  render() {
    const { handleChange, handleSubmit } = this;
    const { showSpinner, successMessage, errorMessage } = this.state;

    let message = () => {
      if (successMessage) return <p className="correct">{successMessage}</p>;
      else if (errorMessage) return <p className="error">{errorMessage}</p>;
      return null;
    };

    return (
      <div className="login__container">
        <h1 className="login__title">Sign In</h1>
        <form className="form-group login__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              name={"username"}
              autoFocus
              placeholder="Username"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-control"
              required
              type="password"
              name={"password"}
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-lg" type="submit">
              Login
            </button>
            <button
              className="btn btn-link"
              href="#"
              onClick={this.props.onGoBack}
            >
              Go Back
            </button>
          </div>
          {showSpinner ? (
            <div className="spinner-container">
              <i class="fa fa-spinner fa-pulse fa-3x fa-fw" />
            </div>
          ) : null}
          {message()}
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
