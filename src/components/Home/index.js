import React, { Component } from 'react';
import LandingPage from '../LandingPage';
import axios from 'axios'

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            followedStockData:{}
        }
    }
    
    componentDidMount(){
        this.props.updateOnLogin()

        this.props?.followedStock?.map(stock => {
            return (
                axios
                    .get(`http://api.marketstack.com/v1/eod?access_key=1c3e794b3e21ba8a689dc2f85fc8317c&symbols=${stock.symbol.symbol}&date_from=${this.state.startDate}&date_to=${this.props.today}`, { json: true },)
                    .then(response => {
                        this.setState ({
                            stockInfo: response.data.data,
                            currentValue: response.data.data[0].close,
                            user: this.props.currentUser._id,
                            responseLoading: false,
                        })
                    }))
        })
    }

    diplayFollowedStocks = () => {
        return this.props?.followedStock?.map(stock => {
            return(
                <div key={stock?.symbol._id}>
                    <h2>{stock?.symbol.symbol}</h2>
                    <h2>{stock.currentValue}</h2>
                </div>
            )
        })
    }

    
    render() {
        console.log(this.props.followedStock)
        return (
            <>
                {this.props.currentUser ? 
                    <div>
                        <h2> Followed Stocks </h2>
                        <div>
                            {this.props.followedStock ? 
                                this.diplayFollowedStocks()
                            :
                                ''
                            }
                        </div>
                    </div>
                    :
                    <LandingPage />
                }
            </>
        )
    }
}
