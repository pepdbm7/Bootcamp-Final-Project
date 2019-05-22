import React from "react";

const Product = props => {
  return (
    <div className="product__container">
      <h2 className="product__name">{props.name}</h2>
      <img src={props.image} alt="product img" className="product__image" />
      <p className="product__description">{props.description}</p>
      <p className="product__price">
        {props.price.$numberDouble ? props.price.$numberDouble : props.price}{" "}
        <i className="fas fa-euro-sign" />
      </p>

      {/* only shown in home: */}
      {props.addFromHome && (
        <div onClick={() => props.addFromHome(props.id)}>
          <i
            className="fa fa-plus-circle product__button--addToCart"
            aria-hidden="true"
          />
        </div>
      )}

      {/* only shown in chart: */}
      {props.onDeleteMore && (
        <div className="product__quantityController">
          <div onClick={() => props.onDeleteMore(props.id)}>
            <i
              className="fa fa-minus-circle product__button--minus"
              aria-hidden="true"
            />
          </div>

          {props.quantity && (
            <input
              className="product__quantity"
              disabled
              type="text"
              placeholder={`x ${props.quantity}`}
            />
          )}

          {props.addMore && (
            <div onClick={() => props.addMore(props.id)}>
              <i
                className="fa fa-plus-circle product__button--plus"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
