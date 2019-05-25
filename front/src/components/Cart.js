import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//logic:
import logic from "../logic";

//components:
import Header from "./Header";
import Product from "./Product";
import Total from "./Total";
import Error from "./Error";

class Cart extends Component {
  state = { showSpinner: true, errorMessage: null, products: [], total: "" };

  componentDidMount() {
    logic
      .listCartProducts()
      .then(products => {
        this.setState({ showSpinner: false, products });
      })
      .then(() => this.setTotal())
      .catch(err => this.showError(err));
  }

  //add item:
  addMore = id => {
    try {
      this.setState({ showSpinner: true });
      logic
        .addMore(id)
        .then(() => logic.listCartProducts())
        .then(products => this.setState({ showSpinner: false, products }))
        .then(() => this.setTotal())
        .catch(err => this.showError(err));
    } catch (err) {
      this.showError(err);
    }
  };

  //delete item:
  handleDeleteMoreFromCart = id => {
    try {
      this.setState({ showSpinner: true });
      logic
        .removeProductFromCart(id)
        .then(() => logic.listCartProducts())
        .then(products => this.setState({ showSpinner: false, products }))
        .then(() => this.setTotal())
        .catch(err => this.showError(err));
    } catch (err) {
      this.showError(err);
    }
  };

  setTotal = () => {
    let sum = 0;
    this.state.products.forEach(p => {
      const price = p.price.$numberDouble || p.price;
      return (sum += price * p.quantity);
    });
    sum = sum.toFixed(2);
    this.setState({ total: sum });
  };

  showError = ({ message }) => {
    const _message = message.includes("No matching document found for id")
      ? "Not so fast, please"
      : message;
    console.log(_message);
    this.setState(
      {
        showSpinner: false,
        errorMessage: _message
      },
      () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      }
    );
  };

  handleClick = () => {
    const { products, total } = this.state;
    const productsId = products.map(_product => _product.id);
    const totalstr = total.toString();

    try {
      logic.createNewOrder(productsId, totalstr).then(() => {
        this.props.history.push("/setorder");
      });
    } catch (err) {
      this.showError(err);
    }
  };

  render() {
    const { showSpinner, errorMessage, products, total } = this.state;
    const types = ["sandwich", "salad", "juice", "yogurt"];
    const titles = ["SANDWICHES", "SALADS", "JUICES", "YOGURTS"];

    return (
      <div className="cart__page">
        <Header
          home={false}
          profile={false}
          contact={false}
          cart={true}
          vieworders={false}
        />

        <div className="cart__container cart">
          {showSpinner ? (
            <div className="spinner-container spinner-cart">
              <i class="fa fa-spinner fa-pulse fa-3x fa-fw" />
            </div>
          ) : null}
          {errorMessage ? <Error message={errorMessage} /> : null}
          {products.length
            ? types.map((type, index) => (
                <div className="cart__products-container">
                  <div className="cart__type-container">
                    <h1 className={`cart-type cart__type-title-${type}`}>
                      {titles[index]}
                    </h1>
                    <div className="products__container">
                      {products
                        .filter(product => product.type === type)
                        .map(product => (
                          <Product
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                            description={product.description}
                            quantity={product.quantity}
                            onDeleteMore={this.handleDeleteMoreFromCart}
                            addMore={this.addMore}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>

        <div className="cart__footer">
          {total > 0 && <Total calculatedTotal={total} />}
          {total > 0 && (
            <button
              className="btn btn-primary cart__submit-button"
              type="submit"
              onClick={this.handleClick}
            >
              Go To Pay <i class="fas fa-shopping-cart" />
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
