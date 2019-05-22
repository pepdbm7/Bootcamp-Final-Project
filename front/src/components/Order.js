import React from 'react'
import BoughtProducts from './BoughtProducts'

const Order = (props) => {

        return <article className="order__container">
                <h2 className="order__title">Your Breakfast on {props.day} {props.month}, {props.year}, at {props.time}</h2>
                <p className="order__place">Dropped at: {props.place}</p>
                <div className="productsOfOrders__container">
                {(props.products || []).map(product => {
                    return <BoughtProducts key={Date.now()} type={product.type} name={product.name} price={product.price} quantity={product.quantity} />
                })}
                </div>
                <p className="order__total">Total paid was: {props.total} €</p>
                { props.comments && <p className="order__comments">Your comments: {props.comments}</p> }
        </article>
}

export default Order