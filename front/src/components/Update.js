import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import Header from './Header'
import logic from '../logic'

class Update extends Component {
    state = { errorMessage: null, successMessage: null, type: '', name: '', surname: '', email:'', username: '', newPassword: '', confirmPassword: '', password: '' }

    componentDidMount = () => {
        this.setState({errorMessage: null, successMessage: null})          
    }

    handleTypeChange = event => {
        const type = event.target.value

        this.setState({ type })
    }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }
    
    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handleNewPasswordChange = event => {
        const newPassword = event.target.value

        this.setState({ newPassword })
    }

    handleConfirmPasswordChange = event => {
        const confirmPassword = event.target.value

        this.setState({ confirmPassword })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const { type, name, surname, email, username, newPassword, confirmPassword, password } = this.state
        try {
            logic.sendUpdatedInfo( type, name, surname, email, username, newPassword, confirmPassword, password )
                .then(() => {
                    this.setState({ successMessage: 'Account updated!!' })
                    setTimeout(() => {
                        this.setState({successMessage: null})
                        this.props.history.push('/profile')              
                    }, 1500) 
                })
                .catch((err) => {
                    this.setState({ errorMessage: err.message }, () =>{
                        setTimeout(() => {
                            this.setState({errorMessage: null})                
                        }, 2000)
                    })
                })
        } catch(err) {
            this.setState({ errorMessage: err.message }, () =>{
                setTimeout(() => {
                    this.setState({errorMessage: null})                
                }, 2000)
            })
        }

    }

    onGoBack = () => this.props.history.push('/profile')

    render() {

        let error = () => {
            if (this.state.successMessage) {
                return (<p className="correct">{this.state.successMessage}</p>)
            } else if (this.state.errorMessage) {
                return (<p className="error">{this.state.errorMessage}</p>)
            }
           return null
        } 

        return <div>
        <Header/> 
            <div className="update__container">
                <h1 className="update__title">Update Profile</h1>
                <form className="form-group update__form" onSubmit={this.handleSubmit}>
                    <div class="form-group">
                        <select className="form-control update__type" required onChange={this.handleTypeChange}>
                            <option className="form-control update__type" disabled selected > -- Select Type of Client -- </option>
                            <option className="form-control update__type" value="Individual">Individual</option>
                            <option className="form-control update__type" value="Corporate">Corporate</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="text" placeholder="Name" onChange={this.handleNameChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="text" placeholder="Email" onChange={this.handleEmailChange} />
                    </div>
                    <div className="form-group">
                    <input className="form-control" required type="password" placeholder="New Password" onChange={this.handleNewPasswordChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="password" placeholder="Confirm Password" onChange={this.handleConfirmPasswordChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" required type="password" placeholder="Old Password" onChange={this.handlePasswordChange} />
                    </div>
                    {/* <button type="submit">update</button> <a href="/#/">back</a> */}
                    <div className="form-group">
                        <button className="btn btn-primary btn-lg" type="submit">Update</button> 
                        <button className="btn-register btn btn-link" href="#" onClick={this.onGoBack}>Go Back</button>
                    </div>
                    
                    {error()}
                </form>
            </div>
        </div>
    }
}

export default withRouter(Update)