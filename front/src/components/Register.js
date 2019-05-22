import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import logic from "../logic";

class Register extends Component {
  state = {
    registerDoneMessage: null,
    registerErrorMessage: null,
    type: "",
    name: "",
    surname: "",
    email: "",
    username: "",
    password: ""
  };

  handleTypeChange = event => {
    const type = event.target.value;

    this.setState({ type });
  };

  handleNameChange = event => {
    const name = event.target.value;

    this.setState({ name });
  };

  handleSurnameChange = event => {
    const surname = event.target.value;

    this.setState({ surname });
  };

  handleEmailChange = event => {
    const email = event.target.value;

    this.setState({ email });
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

    const { type, name, surname, email, username, password } = this.state;

    try {
      logic
        .registerUser(type, name, surname, email, username, password)
        .then(() => {
          this.setState(
            {
              registerDoneMessage: `Great! ' ${username} ' successfully registered`,
              name: "",
              surname: "",
              email: "",
              username: "",
              password: ""
            },
            () => {
              setTimeout(() => {
                this.setState({ registerDoneMessage: null });
                this.props.history.push("/login");
              }, 2000);
            }
          );
        })
        .catch(err => {
          this.setState({ registerErrorMessage: err.message }, () => {
            setTimeout(() => {
              this.setState({ registerErrorMessage: null });
            }, 2000);
          });
        });
    } catch (err) {
      this.setState({ registerErrorMessage: err.message }, () => {
        setTimeout(() => {
          this.setState({ registerErrorMessage: null });
        }, 2000);
      });
    }
  };

  render() {
    let error = () => {
      if (this.state.registerDoneMessage) {
        return <p className="correct">{this.state.registerDoneMessage}</p>;
      } else if (this.state.registerErrorMessage) {
        return <p className="error">{this.state.registerErrorMessage}</p>;
      }
      return null;
    };

    return (
      <div className="register__container">
        <h1 className="register__title">Sign Up</h1>
        <form
          className="form-group register__form"
          onSubmit={this.handleSubmit}
        >
          <div class="form-group">
            <select
              className="form-control register__type"
              required
              autoFocus
              onChange={this.handleTypeChange}
            >
              <option className="form-control register__type" disabled selected>
                {" "}
                -- Select Type of Client --{" "}
              </option>
              <option
                className="form-control register__type"
                value="Individual"
              >
                Individual
              </option>
              <option className="form-control register__type" value="Corporate">
                Corporate
              </option>
            </select>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              value={this.state.name}
              placeholder="Name"
              onChange={this.handleNameChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              value={this.state.surname}
              placeholder="Surname"
              onChange={this.handleSurnameChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              value={this.state.email}
              placeholder="Email"
              onChange={this.handleEmailChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              value={this.state.username}
              placeholder="Username"
              onChange={this.handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="password"
              value={this.state.password}
              placeholder="Password"
              onChange={this.handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-lg" type="submit">
              Register
            </button>{" "}
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

export default withRouter(Register);
