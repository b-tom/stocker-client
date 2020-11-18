import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SYMBOL_SERVICE from '../../../services/SymbolService'
import '../../../App.css';
import 'bulma/css/bulma.css';



export default class ListSymbols extends Component {
    constructor(props){
        super(props);
        this.state = {
            limit: 30,
            skip: 0,
            symbols:[]
        }
    }

    componentDidMount() {
        this.databaseCall(this.state.limit, this.state.skip);
    }

    databaseCall = (limit, skip) => {
        SYMBOL_SERVICE.getSymbols(limit, skip)
        .then(responseFromServer => {
            const { symbol } = responseFromServer.data;
            this.setState({ symbols:symbol })
        })
    }

    // goBack = () => {
    //     // let limit = this.state.limit - 30;
    //     // let skip = this.state.skip - 30;
    //     // this.setState({ limit, skip });
    //     this.databaseCall(this.state.limit - 30, this.state.skip - 30);
    // }

    // goForward = () => {
    //     // let limit = this.state.limit + 30;
    //     // let skip = this.state.skip + 30;
    //     // this.setState({ limit, skip });
    //     this.databaseCall(this.state.limit + 30, this.state.skip + 30);
    // }

    render() {
        return (
            <section>
                <div>
                    {/* <button onClick={this.goBack()}>{`<<`}</button>
                    <button onClick={this.goForward()}>{`>>`}</button> */}
                </div>
                <div className='exploreSymbolContainer'>
                    {this.state.symbols?.map(symbol => (
                            <div className='card exploreSymbol fancy_card' key={symbol._id}>
                                <div className='card-content media-content'>
                                    <h2 className='title is-4'>{symbol.symbol}</h2>
                                    <h6 className='subtitle is-6'>{symbol.description}</h6>
                                    <Link to= {`/details/${symbol._id}` }>
                                        Show Details
                                    </Link>
                                </div>
                            </div>
                    ))}
                </div>
            </section>
        )
        
    }
} 


