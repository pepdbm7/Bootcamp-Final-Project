import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  Collapse,
  NavItem,
  Fa
} from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router-dom";
import logic from "../logic";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      home: true,
      profile: false,
      contact: false,
      cart: false,
      vieworders: false,
      isProductAdded: false
    };
  }

  //para activar (flag) la clase de cada nombre del header; cada página, al renderizarse, le pasa x props ese flag, y antes de cargarse lo metemos en el state, para q se renderice con la clase que toca!, sinó no sale:
  componentDidMount = () =>
    this.setState({
      home: this.props.home,
      profile: this.props.profile,
      contact: this.props.contact,
      cart: this.props.cart,
      vieworders: this.props.vieworders
    });

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isProductAdded !== this.props.isProductAdded) {
      this.setState({ isProductAdded: this.props.isProductAdded });
    }
  }

  onClick = () => this.setState({ collapse: !this.state.collapse });

  goToHome = () => this.props.history.push("/home");

  goToProfile = () => this.props.history.push("/profile");

  goToContact = () => this.props.history.push("/contact");

  goToCart = () => this.props.history.push("/cart");

  goToOrders = () => this.props.history.push("/vieworders");

  handleLogoutClick = () => {
    logic.logout();

    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <Router>
          <Navbar
            className="navbar__background"
            dark
            expand="md"
            scrolling
            fixed="top"
          >
            <NavbarBrand className="navbar__logo">Planbe</NavbarBrand>
            <NavbarToggler onClick={this.onClick} />
            <Collapse isOpen={this.state.collapse} navbar>
              <NavbarNav left>
                <NavItem>
                  <p
                    className={`${
                      this.state.home
                        ? " nav-link waves-effect waves-light navbar__link--active navbar-left"
                        : "nav-link waves-effect waves-light navbar-left"
                    }`}
                    onClick={this.goToHome}
                  >
                    <Fa icon="home" aria-hidden="true" />
                    Home
                  </p>
                </NavItem>
                <NavItem>
                  <p
                    className={`${
                      this.state.profile
                        ? " nav-link waves-effect waves-light navbar__link--active navbar-left"
                        : " nav-link waves-effect waves-light navbar-left"
                    }`}
                    onClick={this.goToProfile}
                  >
                    <Fa icon="user" />
                    Profile
                  </p>
                </NavItem>
                <NavItem>
                  <p
                    className={`${
                      this.state.contact
                        ? " nav-link waves-effect waves-light navbar__link--active navbar-left"
                        : " nav-link waves-effect waves-light navbar-left"
                    }`}
                    onClick={this.goToContact}
                  >
                    <i className="fas fa-file-signature" /> Contact
                  </p>
                </NavItem>
              </NavbarNav>

              <NavbarNav right>
                <NavItem>
                  <p
                    className={`${
                      this.state.cart
                        ? " nav-link waves-effect waves-light navbar__link--active navbar-left"
                        : this.state.isProductAdded
                        ? " nav-link waves-effect waves-light navbar-left bounce"
                        : " nav-link waves-effect waves-light navbar-left"
                    }`}
                    onClick={this.goToCart}
                  >
                    <Fa icon="shopping-cart" aria-hidden="true" />
                    Shopping Cart
                  </p>
                </NavItem>
                <NavItem>
                  <p
                    className={`${
                      this.state.vieworders
                        ? " nav-link waves-effect waves-light navbar__link--active navbar-left"
                        : " nav-link waves-effect waves-light navbar-left"
                    }`}
                    onClick={this.goToOrders}
                  >
                    <i className="fas fa-history" /> Last orders
                  </p>
                </NavItem>
                <NavItem>
                  <p
                    className=" nav-link waves-effect waves-light navbar-left"
                    onClick={this.handleLogoutClick}
                  >
                    <Fa icon="sign-out-alt" />
                    Logout
                  </p>
                </NavItem>
              </NavbarNav>
            </Collapse>
          </Navbar>
        </Router>
      </div>
    );
  }
}

export default withRouter(Header);
