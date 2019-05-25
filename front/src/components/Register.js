import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//logic:
import logic from "../logic";

class Register extends Component {
  state = {
    showSpinner: false,
    successMessage: null,
    errorMessage: null,
    type: "",
    name: "",
    surname: "",
    email: "",
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

    const { type, name, surname, email, username, password } = this.state;

    try {
      this.setState({ showSpinner: true });
      logic
        .registerUser(type, name, surname, email, username, password)
        .then(() =>
          this.setState(
            {
              showSpinner: false,
              successMessage: `Great, ${username}! Thanks for registering!`,
              name: "",
              surname: "",
              email: "",
              username: "",
              password: ""
            },
            () => {
              setTimeout(() => {
                this.setState({ successMessage: null });
                this.props.history.push("/login");
              }, 2000);
            }
          )
        )
        .catch(err => {
          //if SendGrid error:
          if (
            err.message ===
            "The provided authorization grant is invalid, expired, or revoked"
          ) {
            this.setState(
              {
                showSpinner: false,
                successMessage: `Great, ${username}! Thanks for registering!`
              },
              () =>
                setTimeout(() => {
                  this.setState({ successMessage: null });
                  this.props.history.push("/login");
                }, 2000)
            );
          }

          this.setState({ showSpinner: false, errorMessage: err.message }, () =>
            setTimeout(() => this.setState({ errorMessage: null }), 2000)
          );
        });
    } catch (err) {
      this.setState({ showSpinner: false, errorMessage: err.message }, () =>
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 2000)
      );
    }
  };

  render() {
    const { handleChange } = this;
    const { onGoBack } = this.props;
    const {
      showSpinner,
      successMessage,
      errorMessage,
      name,
      surname,
      email,
      username,
      password
    } = this.state;

    let message = () => {
      if (successMessage) return <p className="correct">{successMessage}</p>;
      else if (errorMessage) return <p className="error">{errorMessage}</p>;
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
              autoFocus
              required
              className="form-control register__type"
              name={"type"}
              onChange={handleChange}
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
              name={"name"}
              value={name}
              placeholder="Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              name={"surname"}
              value={surname}
              placeholder="Surname"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              name={"email"}
              value={email}
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              required
              type="text"
              name={"username"}
              value={username}
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
              value={password}
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-lg" type="submit">
              Submit
            </button>{" "}
            <button className="btn btn-link" href="#" onClick={onGoBack}>
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

export default withRouter(Register);
