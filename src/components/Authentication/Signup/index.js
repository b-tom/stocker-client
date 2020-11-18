import React from 'react';

import AUTH_SERVICE from '../../../services/AuthService';

export default class Signup extends React.Component {
  state = {
    username: '',
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

    const { username, email, password } = this.state;

    AUTH_SERVICE.signup({ username, email, password })
      .then(responseFromServer => {
        const { user } = responseFromServer.data;

        // Lift the user object to the App.js
        this.props.onUserChange(user);

        // Redirect user to home page after successful sign up
        this.props.history.push('/');
      })
      .catch(err => {
        if (err.response && err.response.data) {
          return this.setState({ message: err.response.data.message });
        }
      });
  };

  render() {
    return (
      <div className='loginContainer'>
        <div>
        <img src='/LandingPageImage.png' alt='Landing Page' width='500' />
        </div>
        <div className='field'>
          <h2 className='title is-3'> Sign Up </h2>

          <form className='field' onSubmit={this.handleFormSubmission}>
            <label className='label'>
              Username:
              <div>
                <input className='input'
                  name='username'
                  type='text'
                  placeholder='Type your name'
                  value={this.state.username}
                  onChange={this.handleInputChange}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-envelope'></i>
                </span>
              </div>
            </label>

            <label className='label'>
              Email:
              <div className='control has-icons-left'>
                <input className='input'
                  name='email'
                  type='email'
                  placeholder='Type your email'
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-lock'></i>
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

            <button className='button is-success'> Signup </button>
          </form>

          {this.state.message && <div> {this.state.message} </div>}
        </div>
      </div>
    );
  }
}