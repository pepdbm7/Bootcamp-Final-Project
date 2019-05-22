import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//components:
import Header from "./Header";
import Error from "./Error";
import Product from "./Product";

//logic:
import logic from "../logic";

class Home extends Component {
  state = { errorMessage: null, products: [], isProductAdded: false };

  componentDidMount() {
    logic.listAllProducts().then(products => this.setState({ products }));
  }

  handleAddToCart = id => {
    try {
      logic.addProductToCart(id).then(() =>
        this.setState({ isProductAdded: true }, () => {
          setTimeout(() => {
            this.setState({ isProductAdded: false });
          }, 2000);
        })
      );
    } catch ({ message }) {
      this.setState({ errorMessage: message }, () => {
        setTimeout(() => {
          this.setState({ errorMessage: null });
        }, 3000);
      });
    }
  };

  render() {
    const types = ["sandwich", "salad", "juice", "yogurt"];
    const titles = ["SANDWICHES", "SALADS", "JUICES", "YOGURTS"];
    const { products, errorMessage, isProductAdded } = this.state;
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
          {errorMessage ? <Error message={this.state.errorMessage} /> : null}
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
