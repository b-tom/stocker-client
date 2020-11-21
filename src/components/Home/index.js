import React, { Component } from 'react';
import LandingPage from '../LandingPage';
import axios from 'axios';
import Graph from '../Graph';
import { Link } from 'react-router-dom';
import '../../App';
import 'bulma/css/bulma.css';

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            followedStockData:{}
        }
    }
    
    componentDidMount(){
        this.props.updateOnLogin()
        this.getALittleDataOfc()
    }

    diplayFollowedStocks = () => {
        const values =  this.state?.followedStockData && Object.values(this.state?.followedStockData)?.map(stock => {
            return (
            <div className='stockGraphContainer' key={stock[0].symbol}>
                <div className=''>
                    <Link className='subtitle is-3' to={`/stocks/${stock[0].symbol}`} > {stock[0].symbol} </Link>
                </div>
                <Graph className='' stockInfo={stock} />
                
            </div>
        )}) 
        return values
    }

    componentDidUpdate(prevProps) {
        if(JSON.stringify(this.props.followedStock) !== JSON.stringify(prevProps.followedStock)) {
            this.getALittleDataOfc();
        }
    }


    getALittleDataOfc = () => {
        this.props?.followedStock?.forEach(stock => {
            axios
                .get(`http://api.marketstack.com/v1/eod?access_key=7eb019f9be084b7f7e5807177c92bd88&symbols=${stock.symbol.symbol}&date_from=2020-01-01&date_to=${this.props.today}`, { json: true },)
                .then(response => {
                    this.setState({
                        followedStockData: {...this.state.followedStockData, [stock.symbol.symbol]: response.data.data},
                    });
                });
        });
    }

    getStockId = (stock) => {
        this.props.followedStock.forEach(eachStock => {
            if(eachStock.symbol.symbol === stock) {return eachStock.symbol._id};
        })
    }
    
    render() {
        return (
            <div className='background'>
                {this.props.currentUser ? 
                    <div className='mainStockContainer'>
                        {this.props.followedStock ? 
                            this.diplayFollowedStocks()
                        :
                            ''
                        }
                    </div>
                    :
                    <LandingPage />
                }
            </div>
        )
    }
}
