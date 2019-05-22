import React, { Component } from "react";
import { withRouter } from "react-router";
import logic from "../logic";

class Login extends Component {
  state = {
    successMessage: null,
    errorMessage: null,
    username: "",
    password: ""
  };

  handleUsernameChange = event => {
    const username = event.target.value;

    this.setState({ username });
  };

  handlePasswordChange = event => {
    const password = event.target.value;

    this.setState({ password });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { username, password } = this.state;

    try {
      logic
        .login(username, password)
        .then(() => {
          this.props.history.push("/home");
        })
        .catch(err => {
          this.setState({ errorMessage: err.message }, () => {
            setTimeout(() => {
              this.setState({ errorMessage: null });
            }, 3000);
          });
        });
    } catch (err) {
      this.setState({ errorMessage: err.message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  render() {
    let error = () => {
      if (this.state.errorMessage) {
        return <p className="error">{this.state.errorMessage}</p>;
      }
      return null;
    };

    return (
      <div className="login__container">
        <h1 className="login__title">Sign In</h1>
        <form className="form-group login__form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              autoFocus
              placeholder="Username"
              onChange={this.handleUsernameChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-control"
              required
              type="password"
              placeholder="Password"
              onChange={this.handlePasswordChange}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-lg" type="submit">
              Login
            </button>
            <button
              className="btn-register btn btn-link"
              href="#"
              onClick={this.props.onGoBack}
            >
              Go Back
            </button>
          </div>
          {error()}
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
