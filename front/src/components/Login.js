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

  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({ ...this.state, [key]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { username, password } = this.state;

    try {
      logic
        .login(username, password)
        .then(() =>
          this.setState({ successMessage: "Welcome!!" }, () => {
            setTimeout(() => {
              this.setState({ successMessage: null });
              this.props.history.push("/home");
            }, 2000);
          })
        )
        .catch(err => {
          this.setState({ errorMessage: err.message }, () => {
            setTimeout(() => {
              this.setState({ errorMessage: null });
            }, 2500);
          });
        });
    } catch (err) {
      this.setState({ errorMessage: err.message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 2500);
      });
    }
  };

  render() {
    let message = () => {
      if (this.state.successMessage) {
        return <p className="correct">{this.state.successMessage}</p>;
      } else if (this.state.errorMessage) {
        return <p className="error">{this.state.errorMessage}</p>;
      }
      return null;
    };

    const { handleChange, handleSubmit } = this;

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
              className="btn-register btn btn-link"
              href="#"
              onClick={this.props.onGoBack}
            >
              Go Back
            </button>
          </div>
          {message()}
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
