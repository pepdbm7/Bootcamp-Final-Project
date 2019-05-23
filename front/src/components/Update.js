import React, { Component } from "react";
import { withRouter } from "react-router-dom";
//logic:
import logic from "../logic";

//components
import Header from "./Header";

class Update extends Component {
  state = {
    errorMessage: null,
    successMessage: null,
    type: "",
    name: "",
    surname: "",
    email: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
    password: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) console.log(this.state);
  }

  handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;

    this.setState({ ...this.state, [key]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const {
      type,
      name,
      surname,
      email,
      username,
      newPassword,
      confirmPassword,
      password
    } = this.state;

    try {
      logic
        .sendUpdatedInfo(
          type,
          name,
          surname,
          email,
          username,
          newPassword,
          confirmPassword,
          password
        )
        .then(() => {
          this.setState({ successMessage: "Account updated!!" });
          setTimeout(() => {
            this.setState({ successMessage: null });
            this.props.history.push("/profile");
          }, 2000);
        })
        .catch(err => {
          this.setState({ errorMessage: err.message }, () => {
            setTimeout(() => {
              this.setState({ errorMessage: null });
            }, 2000);
          });
        });
    } catch (err) {
      this.setState({ errorMessage: err.message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 2000);
      });
    }
  };

  onGoBack = () => this.props.history.push("/profile");

  render() {
    let message = () => {
      if (this.state.successMessage) {
        return <p className="correct">{this.state.successMessage}</p>;
      } else if (this.state.errorMessage) {
        return <p className="error">{this.state.errorMessage}</p>;
      }
      return null;
    };

    const { handleChange } = this;

    return (
      <div>
        <Header />
        <div className="update__container">
          <h1 className="update__title">Update Profile</h1>
          <form
            className="form-group update__form"
            onSubmit={this.handleSubmit}
          >
            <div class="form-group">
              <select
                className="form-control update__type"
                required
                onChange={handleChange}
              >
                <option className="form-control update__type" disabled selected>
                  {" "}
                  -- Select Type of Client --{" "}
                </option>
                <option
                  className="form-control update__type"
                  value="Individual"
                >
                  Individual
                </option>
                <option className="form-control update__type" value="Corporate">
                  Corporate
                </option>
              </select>
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="text"
                name="surname"
                placeholder="Surname"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                required
                type="password"
                name="password"
                placeholder="Old Password"
                onChange={handleChange}
              />
            </div>
            {/* <button type="submit">update</button> <a href="/#/">back</a> */}
            <div className="form-group">
              <button className="btn btn-primary btn-lg" type="submit">
                CONFIRM CHANGES
              </button>
              <button
                className="btn-register btn btn-link"
                href="#"
                onClick={this.onGoBack}
              >
                Go Back
              </button>
            </div>

            {message()}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Update);
