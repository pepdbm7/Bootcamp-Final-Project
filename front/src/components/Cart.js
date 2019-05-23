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
  state = { errorMessage: null, products: [], total: "" }; //array con obj d productos, con todos sus fields (quantity, name, etc)

  componentDidMount() {
    logic
      .listCartProducts()
      .then(products => {
        this.setState({ products });
      }) //metemos en state los productos filtrados con la lógica, y luego renderizaremos lo dl state
      .then(() => {
        let sum = 0;
        this.state.products.map(product => {
          const price = product.price.$numberDouble || product.price;
          return (sum += price * product.quantity);
        });
        sum = sum.toFixed(2);
        this.setState({ total: sum });
      })
      .catch(err => {
        this.setState({ errorMessage: err.message }, () => {
          setTimeout(() => {
            this.setState({ errorMessage: null });
          }, 3000);
        });
      });
  }

  //add item:
  addMore = id => {
    try {
      logic
        .addMore(id)
        .then(() => logic.listCartProducts())
        .then(products => this.setState({ products }))
        .then(() => {
          let sum = 0;
          this.state.products.map(product => {
            const price = product.price.$numberDouble || product.price;
            return (sum += price * product.quantity);
          });
          sum = sum.toFixed(2);
          this.setState({ total: sum });
        })
        .catch(err => {
          this.setState({ errorMessage: err.message }, () => {
            setTimeout(() => {
              this.setState({ errorMessage: null });
            }, 3000);
          });
        });
    } catch ({ message }) {
      this.setState({ errorMessage: message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  //delete item:
  handleDeleteMoreFromCart = id => {
    try {
      logic
        .removeProductFromCart(id)
        .then(() => logic.listCartProducts())
        .then(products => this.setState({ products }))
        .then(() => {
          let sum = 0;
          this.state.products.map(product => {
            const price = product.price.$numberDouble || product.price;
            return (sum += price * product.quantity);
          });
          sum = sum.toFixed(2);
          this.setState({ total: sum });
        })
        .catch(err => {
          if (err.message.includes("No matching document found for id")) {
            this.setState({ errorMessage: "Not so fast, please" }, () => {
              setTimeout(() => {
                this.setState({ errorMessage: null });
              }, 3000);
            });
          }
        });
    } catch ({ message }) {
      this.setState({ errorMessage: message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  handleClick = () => {
    const { products, total } = this.state;
    const productsId = products.map(_product => _product.id);
    const totalstr = total.toString();

    try {
      logic.createNewOrder(productsId, totalstr).then(() => {
        this.props.history.push("/setorder");
      });
    } catch ({ message }) {
      this.setState({ errorMessage: message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  render() {
    const { errorMessage, products } = this.state;
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
          {errorMessage ? <Error message={this.state.errorMessage} /> : null}
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
          {this.state.total > 0 && <Total calculatedTotal={this.state.total} />}
          {this.state.total > 0 && (
            <button
              className="btn btn-primary btn-lg cart__submit-button"
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
