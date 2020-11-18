import React from 'react';
import { Link } from 'react-router-dom';
import AUTH_SERVICE from '../../services/AuthService';
import 'bulma/css/bulma.css';
import '../../App.css'

const NavBar = props => {
    const logoutAndLiftUserState = () => {
        AUTH_SERVICE.logout()
            .then(() => {
                props.onUserChange(null);
                props.onLogout();
            })
            .catch(err => console.log(err));
        
    };

    return (
        <nav className='navbarAlign navbar'>
            <div className='navbar-brand'>
                <Link to='/'>
                    <img src='/logo.png' alt='stock-er logo' width='120'/> 
                </Link>
            </div>
            <div className= 'navbar-end'>
                {(props.currentUser && (
                    <div className='navBarButtons'>
                        <Link className='navbar-item button is-white' to='/collections' height='59.31'> Collections </Link>
                        <Link className='navbar-item button is-white' to='/explore'> Explore </Link>

                        <div className='navbar-item has-dropdown is-hoverable'>
                            <span className='navbar-link'>{props.currentUser.username}</span>
                            <div className='navbar-dropdown'>
                                <Link className='navbar-item' to='/profile'> Profile </Link>
                                <button className='navbar-item button is-white is-small' onClick={logoutAndLiftUserState}> Logout </button>
                            </div>
                        </div>
                        <span></span>
                    </div>
                )) || (
                    <div className='navbar-end'>
                        <div className='navbar-item'>
                            <div className='buttons'>
                                <Link className='button is-primary' to='/signup-page' >Signup</Link>
                                <Link className='button is-light' to='/login-page'>Login</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;