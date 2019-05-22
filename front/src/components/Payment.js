import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'





class Payment extends Component {
    state = { error: null }

    // componentDidMount() {
    //     try {
    //         logic.retrieveUser()
    //         .then(user => { this.setState({ type: user.type, name: user.name, surname: user.surname, username: user.username }) })
    //         .catch(err => this.setState({ error: err.message }))
    //     } catch (err) {
    //         this.setState({ error: err.message })
    //     }
    // }

    onGoBack = () => {
        logic.listDroppingDetails()   //TODO!!!!!
        this.props.history.push('/setorder')
    }


    handleHolder = () => {

    }

    handleCardNum = () => {
        
    }

    handleMonth = () => {
        
    }

    handleYear = () => {
        
    }

    handleCVC = () => {
        
    }

    handleDate = () => {
        
    }





    render() {
        return <div className="container-Payment">
                <h1 className="Payment-title">Payment</h1>
                <form className="form-group form-Payment" onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <label>Credit Card Holder</label>
                        <input className="form-control Payment"  required  type="text" onChange={this.handleHolder} />
                    </div>

                    <div className="form-group">
                        <label>Credit Card Number</label>
                        <input className="form-control Payment"  required type="text" onChange={this.handleCardNum} />
                    </div>
                    <div className="form-group">Expiration Date
                        <div className="form-group">
                            <select className="form-control" required onChange={e => this.handleMonth(e)}>
                                <option className="form-control" disabled selected > mm </option>
                                <option className="form-control" value="01">01</option>
                                <option className="form-control" value="02">02</option>
                                <option className="form-control" value="03">03</option>
                                <option className="form-control" value="04">04</option>
                                <option className="form-control" value="05">05</option>
                                <option className="form-control" value="06">06</option>
                                <option className="form-control" value="07">07</option>
                                <option className="form-control" value="08">08</option>
                                <option className="form-control" value="09">09</option>
                                <option className="form-control" value="10">10</option>
                                <option className="form-control" value="11">11</option>
                                <option className="form-control" value="12">12</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select className="form-control" required onChange={e => this.handleYear(e)}>
                                <option className="form-control" disabled selected > yyyy </option>
                                <option className="form-control" value="2018">2018</option>
                                <option className="form-control" value="2019">2019</option>
                                <option className="form-control" value="2020">2020</option>
                                <option className="form-control" value="2021">2021</option>
                                <option className="form-control" value="2022">2022</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>CVC</label>
                        <input className="form-control Payment" required type="password" onChange={this.state.handleCVC} />
                    </div>

                </form>

                <div className="form-group">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={this.goToThanks}>PAY</button>
                    <button className="btn-Payment btn btn-link" href="#" onClick={this.onGoBack}>Go Back</button>
                </div>
        
            </div>

    }
}

export default withRouter(Payment)