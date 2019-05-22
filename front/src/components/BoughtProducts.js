import React from 'react'

const BoughtProducts = (props) => {
    // state = { type: props.type, name: props.name, price: props.price }

        return <article className="boughtProduct__container">
                    <h2 className="product__name">{props.name}</h2>
                    <p className="product__type">{props.type}</p>

                    <p className="product__price">{props.price} €/unit</p>
                   
                </article>
}

export default BoughtProducts