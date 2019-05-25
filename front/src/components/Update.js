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

  componentDidMount() {
    try {
      logic
        .retrieveUser()
        .then(({ type, name, surname, email, username }) => {
          console.log(name);
          this.setState({ type, name, surname, email, username });
        })
        .catch(err => this.setState({ error: err.message }));
    } catch (err) {
      this.setState({ error: err.message });
    }
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
      this.setState({ showSpinner: true });

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
          this.setState({
            showSpinner: false,
            successMessage: "Account updated!!"
          });
          setTimeout(() => {
            this.setState({ successMessage: null });
            this.props.history.push("/profile");
          }, 2000);
        })
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

  onGoBack = () => this.props.history.push("/profile");

  render() {
    const { handleChange, handleSubmit } = this;
    const {
      showSpinner,
      successMessage,
      errorMessage,
      type,
      name,
      surname,
      email,
      username
    } = this.state;

    let message = () => {
      if (successMessage) return <p className="correct">{successMessage}</p>;
      else if (errorMessage) return <p className="error">{errorMessage}</p>;
      return null;
    };

    return (
      <div>
        <Header />
        <div className="update__container">
          <h1 className="update__title">Update Profile</h1>
          <form className="form-group update__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <select
                className="form-control update__type"
                required
                defaultValue={type}
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
                defaultValue={name}
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
                defaultValue={surname}
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
                defaultValue={username}
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
                defaultValue={email}
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
              <button className="btn btn-link" href="#" onClick={this.onGoBack}>
                Go Back
              </button>
            </div>
            {showSpinner ? (
              <div className="spinner-container">
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
              </div>
            ) : null}
            {message()}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Update);
