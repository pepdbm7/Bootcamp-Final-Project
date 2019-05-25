import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//components:
import Header from "./Header";
import Error from "./Error";
import Product from "./Product";

//logic:
import logic from "../logic";

class Home extends Component {
  state = {
    showSpinner: false,
    errorMessage: null,
    products: [],
    isProductAdded: false
  };

  componentDidMount() {
    this.setState({ showSpinner: true });
    logic
      .listAllProducts()
      .then(products => this.setState({ showSpinner: false, products }));
  }

  handleAddToCart = id => {
    try {
      this.setState({ showSpinner: true });
      logic.addProductToCart(id).then(() =>
        this.setState({ showSpinner: false, isProductAdded: true }, () => {
          setTimeout(() => {
            this.setState({ isProductAdded: false });
          }, 2000);
        })
      );
    } catch ({ message }) {
      this.setState({ showSpinner: false, errorMessage: message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  render() {
    const types = ["sandwich", "salad", "juice", "yogurt"];
    const titles = ["SANDWICHES", "SALADS", "JUICES", "YOGURTS"];
    const { showSpinner, products, errorMessage, isProductAdded } = this.state;
    const { handleAddToCart } = this;

    return (
      <div className="home__page">
        <Header
          home={true}
          profile={false}
          contact={false}
          cart={false}
          vieworders={false}
          isProductAdded={isProductAdded}
        />
        <div className="home__container">
          <h1 className="home__title">OUR PRODUCTS</h1>
          {showSpinner ? (
            <div className="spinner-container">
              <i class="fa fa-spinner fa-pulse fa-3x fa-fw" />
            </div>
          ) : null}
          {errorMessage ? <Error message={errorMessage} /> : null}
          {products.length
            ? types.map((type, index) => (
                <section>
                  <div className="home__type-container">
                    <h1 className={`home__type-title home__type-title-${type}`}>
                      {titles[index]}
                    </h1>
                    <div className="home__products-container">
                      {products
                        .filter(product => product.type === type)
                        .map(product => (
                          <Product
                            remove={false}
                            addMore={false}
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                            description={product.description}
                            addFromHome={handleAddToCart}
                          />
                        ))}
                    </div>
                  </div>
                </section>
              ))
            : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
