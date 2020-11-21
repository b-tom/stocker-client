import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../../../App';

export default class SymbolsRedirect extends Component {
    constructor(props){
        super(props)
        this.state = {
            stockData: [],
        }
    }
    componentDidMount(){
        this.findId()
    }

    findId = async () => {
        let stockData = this.props.symbols.filter(stock => stock.symbol === this.props.match.params.symbol );
        await this.setState({ stockData })
    }
    
    redirect = () => {
        setTimeout(function() {<Redirect to={{pathname:`/details/${this.state?.stockData[0]?._id}`}}/>}, 2000)
    }

    render() {
        return  (
            <div className='redirectContainer'>
                <Link to={{pathname:`/details/${this.state?.stockData[0]?._id}`}}>
                    <img style={{width:'25px'}} src='https://cdn2.iconfinder.com/data/icons/pinpoint-action/48/redirect-512.png' alt='redirect' />
                </Link>

                {this.redirect()}
            </div>
        )
    }
}
