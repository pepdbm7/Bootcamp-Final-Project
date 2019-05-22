import React, { Component } from 'react'
import Header from './Header'
import Order from './Order'
import logic from '../logic'

class ViewOrders extends Component {
    state = { orders: [] }

    componentDidMount = () => {
        logic.deleteUnfinishedOrders()
            .then(() => logic.retrieveOrders())
            .then(res => //res es el array de ordenes con sus productos
                this.setState({ orders:  res }))
 
    }
    //TO DO everything!: receive with props from father (cart) the user.orders, to print them

    render() {        
        return( <div className="orders__page">
            <Header home={false} profile={false} contact={false} cart={false} vieworders={true} />
            <article className="orders__container">
                <h1 className="orders__title">Order History</h1>
                
                { !this.state.orders.length && <p className="orders__message">You don't have any fininshed order yet! <br/> ...go to home to see our products!</p> }
                
                {(this.state.orders || []).map(order => {
                    return <Order key={Date.now()} products={order.products} quantity={order.products.quantity} day={order.day} total={order.total} place={order.place} month={order.month} year={order.year} time={order.time} comments={order.comments} />
                })}
            </article>
        </div> )
    }
}

export default ViewOrders