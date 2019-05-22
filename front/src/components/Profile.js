import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import Header from './Header'



class Profile extends Component {
    state = { type: '', name: '', surname: '', email: '', username: '', error: null }

    componentDidMount() {
        try {
            logic.retrieveUser()
            .then(user => { this.setState({ type: user.type, name: user.name, surname: user.surname, email: user.email, username: user.username }) })
            .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleEditClick = () => this.props.history.push('/update')

    // onGoBack = () => this.props.history.push('/home')

    render() {
        return <div>
            <Header home={false} profile={true} contact={false} cart={false} vieworders={false}/>
            <div className="profile__container">
                <h1 className="profile__title">Profile</h1>
                <form className="form-group profile__form">

                    <div className="form-group">
                        <label>Type of client</label>
                        <input className="form-control profile__form-field" disabled  type="text" placeholder={this.state.type} />
                    </div>

                    <div className="form-group">
                        <label>Name</label>
                        <input className="form-control profile__form-field" disabled  type="text" placeholder={this.state.name} />
                    </div>

                    <div className="form-group">
                        <label>Surname</label>
                        <input className="form-control profile__form-field" disabled type="text" placeholder={this.state.surname} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-control profile__form-field" disabled type="text" placeholder={this.state.email} />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input className="form-control profile__form-field" disabled type="text" placeholder={this.state.username} />
                    </div>

                </form>

                <div className="form-group">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={this.handleEditClick}>Edit profile</button>
                    {/* <button className="btn-profile btn btn-link" href="#" onClick={this.onGoBack}>Go Back</button> */}
                </div>
        
            </div> {/* End container-profile */}
        </div>
    }
}

export default withRouter(Profile)