import React from 'react'
import AUTH_SERVICE from '../../../services/AuthService';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
        message: null
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleFormSubmission = event => {
        event.preventDefault();

        const { email, password } = this.state;
        AUTH_SERVICE.login({ email, password })
            .then(responseFromServer => {
                const { user } = responseFromServer.data;
                //Lift user data to App.js
                this.props.onUserChange(user);
                //Redirect user after sign up
                this.props.history.push('/');
            })
            .catch(err => {
                if(err.response && err.response.data) {
                    return this.setState({ message: err.response.data.message });
                }
            });
    };

    // const envelope = <FontAwesomeIcon icon='envelope' />

    render(){
        return (
            <div className='loginContainer'>
                <div>
                    <img src='/LandingPageImage.png' alt='Landing Page' width='500' />    
                </div>
                <div className='field'>
                    <h2 className='title is-3'>Log In</h2>
                    <form className='field' onSubmit={this.handleFormSubmission}>
                        <label className='label'>
                            Email:
                            <div className='control has-icons-left'>
                                <input className='input'
                                    name='email'
                                    type='email'
                                    placeholder='Email'
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                />
                                <span className='icon is-small is-left'>
                                    <i className='fas fa-envelope'></i>
                                </span>
                            </div>
                        </label>
                        <label className='label'>
                            Password:
                            <div className='control has-icons-left'>
                                <input className='input'
                                    name='password'
                                    type='password'
                                    placeholder='**********'
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                                <span className='icon is-small is-left'>
                                    <i className='fas fa-lock'></i>
                                </span>
                            </div>
                        </label>
                        
                        <button className='button is-success'>Log In</button>
                    </form>
                    {this.state.message && <div> {this.state.message} </div>}
                </div> 
            </div>
        );
    }
}
