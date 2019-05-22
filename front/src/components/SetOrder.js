import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//logic:
import logic from "../logic";

//components:
import Popup from "./Popup";
import Error from "./Error";

class SetOrder extends Component {
  state = {
    errorMessage: null,
    place: "",
    day: "",
    month: "",
    year: "",
    time: "",
    comments: "",
    holder: "",
    num: "",
    exmonth: "",
    exyear: "",
    cvc: "",
    showFirstForm: true,
    showSecondForm: false,
    showModal: false
  };

  onGoBack = () => {
    logic.deleteUnfinishedOrders().then(() => this.props.history.push("/cart"));
  };

  onGoBackToDetails = event => {
    //to go from 2nd form to the 1st one
    event.preventDefault();
    this.setState({ showFirstForm: true, showSecondForm: false });
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ ...this.state, [name]: value });
  };

  displayMonthDays = () => {
    let arr = [];

    for (let i = 1; i <= 31; i++) {
      arr.push(
        <option className="form-control" key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  };

  displayMonths = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return months.map((month, i) => (
      <option className="form-control" key={i} value={month}>
        {month}
      </option>
    ));
  };

  displayMonthNum = () => {
    let arr = [];

    for (let i = 1; i <= 12; i++) {
      arr.push(
        <option className="form-control" key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  };

  onDetailsSubmit = event => {
    //go to 2nd form:
    event.preventDefault();

    if (
      !this.state.place ||
      !this.state.day ||
      !this.state.month ||
      !this.state.year ||
      !this.state.time
    ) {
      this.setState({
        errorMessage: "Some required fields still empty!"
      });
    } else {
      this.setState({
        errorMessage: null,
        showFirstForm: false,
        showSecondForm: true
      });
    }
  };

  onPaySubmit = event => {
    event.preventDefault();
    if (
      !this.state.holder ||
      !this.state.num ||
      !this.state.exmonth ||
      !this.state.exyear ||
      !this.state.cvc
    ) {
      this.setState({
        errorMessage: "Some required fields still empty!"
      });
    } else {
      try {
        const { place, day, month, year, time, comments } = this.state; //in this project version we don't use CC details!

        logic
          .addDroppingDetails(place, day, month, year, time, comments, true) //last arg is 'paid'
          .then(() => {
            debugger;
            this.setState({
              showFirstForm: false,
              showSecondForm: true,
              showModal: true
            });
          });
      } catch ({ message }) {
        this.setState({ errorMessage: message }, () => {
          setTimeout(() => {
            this.setState({ errorMessage: null });
          }, 3000);
        });
      }
    }
  };

  closePopup = () => {
    this.setState({ showModal: false }, () => this.props.history.push("/home"));
  };

  render() {
    const {
      handleChange,
      displayMonthDays,
      displayMonths,
      displayMonthNum,
      onDetailsSubmit,
      onGoBack
    } = this;
    const { errorMessage } = this.state;

    return (
      <div className="container__payment">
        <div
          className={`${
            this.state.showFirstForm ? "detailsActive" : "detailsDisabled"
          }`}
        >
          <h1 className="orderDetails__title">Dropping details</h1>
          {errorMessage ? <Error message={errorMessage} /> : null}
          <form
            className="form-group orderDetails__form"
            onSubmit={onDetailsSubmit}
          >
            <h6>Place *</h6>
            <input
              className="form-control setOrder__textInput"
              required
              type="text"
              name="place"
              placeholder="Write an address here..."
              autoFocus
              onChange={handleChange}
            />

            <div className="form-group">
              <h6>Date *</h6>
              <div className="orderDetails__date">
                <select
                  className="form-control orderDetails__date--input"
                  required
                  name="day"
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    {" "}
                    DD{" "}
                  </option>
                  {displayMonthDays()}
                </select>

                <select
                  className="form-control orderDetails__date--input"
                  required
                  name="month"
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    {" "}
                    MM{" "}
                  </option>
                  {displayMonths()}
                </select>

                <select
                  className="form-control orderDetails__date--input"
                  required
                  name="year"
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    {" "}
                    YYYY{" "}
                  </option>
                  <option className="form-control" value="2018">
                    2018
                  </option>
                  <option className="form-control" value="2019">
                    2019
                  </option>
                  <option className="form-control" value="2020">
                    2020
                  </option>
                </select>
              </div>

              <div className="form-group">
                <h6>Timeframe *</h6>
                <select
                  className="form-control orderDetails__date--input"
                  required
                  name="time"
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    {" "}
                    hh{" "}
                  </option>
                  <option className="form-control" value="07:00 - 07:30">
                    07:00 - 07:30
                  </option>
                  <option className="form-control" value="07:30 - 08:00">
                    07:30 - 08:00
                  </option>
                  <option className="form-control" value="08:00 - 08:30">
                    08:00 - 08:30
                  </option>
                  <option className="form-control" value="08:30 - 09:00">
                    08:30 - 09:00
                  </option>
                  <option className="form-control" value="09:00 - 09:30">
                    09:00 - 09:30
                  </option>
                  <option className="form-control" value="09:30 - 10:00">
                    09:30 - 10:00
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <h6>Add more details (optional)</h6>
              <textarea
                className="form-control setOrder__textInput"
                type="text"
                name="comments"
                placeholder="Write a comment..."
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-lg" type="submit">
                NEXT
              </button>
              <button
                className="btn-OrderDate btn btn-link"
                href="#"
                onClick={onGoBack}
              >
                Go Back
              </button>
            </div>
            <p className="required-fields">* = fields required</p>
          </form>
        </div>

        {/* second part of the formular */}
        <div
          className={`${
            this.state.showSecondForm ? "payActive" : "payDisabled"
          }`}
        >
          <h1 className="payment__title">Payment</h1>
          {errorMessage ? <Error message={errorMessage} /> : null}
          <form
            className="form-group payment__form"
            onSubmit={this.onPaySubmit}
          >
            <input
              className="form-control setOrder__textInput"
              required
              name="holder"
              placeholder="Holder name"
              type="text"
              onChange={handleChange}
            />

            <input
              className="form-control setOrder__textInput"
              required
              name="num"
              placeholder="Card Number"
              type="tel"
              pattern="[0-9.]+"
              maxlength="16"
              onChange={handleChange}
            />

            <div className="form-group">
              <div className="payment__expiration">
                <select
                  className="form-control payment__expirationInput"
                  name="exmonth"
                  required
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    {" "}
                    MM{" "}
                  </option>
                  {displayMonthNum()}
                </select>

                <select
                  className="form-control payment__expirationInput"
                  name="exyear"
                  required
                  onChange={handleChange}
                >
                  <option className="form-control" disabled selected>
                    YYYY
                  </option>
                  <option className="form-control" value="2018">
                    2018
                  </option>
                  <option className="form-control" value="2019">
                    2019
                  </option>
                  <option className="form-control" value="2020">
                    2020
                  </option>
                  <option className="form-control" value="2021">
                    2021
                  </option>
                  <option className="form-control" value="2022">
                    2022
                  </option>
                </select>
              </div>
            </div>

            <input
              className="form-control payment__CVC"
              required
              type="password"
              placeholder="CVC"
              pattern="[0-9.]+"
              name="cvc"
              maxlength="3"
              onChange={handleChange}
            />

            <div className="form-group">
              <button className="btn btn-primary btn-lg" type="submit">
                PAY
              </button>
              <button
                className="btn-Payment btn btn-link"
                href="#"
                onClick={this.onGoBackToDetails}
              >
                Go Back
              </button>
            </div>
            <p className="required-fields">* = fields required</p>
          </form>
        </div>

        {this.state.showModal && (
          <Popup
            place={this.state.place}
            day={this.state.day}
            month={this.state.month}
            year={this.state.year}
            time={this.state.time}
            onClick={this.closePopup}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SetOrder);
