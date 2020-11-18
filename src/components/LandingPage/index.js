import React from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className='LPContainer'>
            <div>
                <img src='/LandingPageImage.png' alt='Landing Page' width='500' />    
            </div>
            <div >
                <h1 className='title is-1'>Stock-Er</h1>
                <h1 className='subtitle is-3'>Stock Market, for everyone!</h1>
                <div className='buttons'>
                        <Link className='button is-primary' to='/signup-page' width='200' >Signup</Link>
                        <Link className='button is-light' to='/login-page' width='200' >Login</Link>
                </div>
            </div>
        </div>
    )
}
