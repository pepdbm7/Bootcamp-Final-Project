import React from 'react'

const Popup = props => {


        return <div className="popup__container">
                <div className="popup__backgroundImg">
                    <div className="popup__modalWindow">
                        <h1 className="popup__title">THANKS!!</h1>
                        <p className="popup__message">Your order will be sent to <span>{ props.place }</span> on the <span>{ props.day }</span> of <span>{ props.month } { props.year }</span> at around <span>{ props.time }</span> a.m.<br/><br/> You will receive all the details to your <span>email</span> box!</p>
                        <p className="popup__message--comment">(Watch also into the Spam folder)</p>
                        <button className="btn btn-primary btn-sm popup__button" type="submit" onClick={props.onClick} >OK</button>
                    </div>
                </div>
               
        </div>

}

export default Popup