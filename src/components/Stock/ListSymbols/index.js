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

    // componentDidUpdate(prevState) {
    //     if(JSON.stringify(this.state.limit) !== JSON.stringify(prevState.limit)) {
    //         this.databaseCall(this.state.limit, this.state.skip);
    //     }
    // }
    
    renderStocks = () => {
        return (
            this.state.symbols?.map(symbol => (
                <div className='card exploreSymbol fancy_card' key={symbol._id}>
                    <div className='card-content media-content'>
                        <h2 className='title is-4'>{symbol.symbol}</h2>
                        <h6 className='subtitle is-6'>{symbol.description}</h6>
                        <Link to= {`/details/${symbol._id}` }>
                            Show Details
                        </Link>
                    </div>
                </div>
            ))
            
        
        )
    }

    databaseCall = (limit, skip) => {
        SYMBOL_SERVICE.getSymbols(limit, skip)
        .then(responseFromServer => {
            const { symbol } = responseFromServer.data;
            this.setState({ symbols:symbol })
        })
    }

    goBack = () => {
        let skip = Number(this.state.skip) - 30;
        this.setState({ skip });
        this.databaseCall(this.state.limit, skip );
    }

    goForward = () => {
        let skip = Number(this.state.skip) + 30;
        this.setState({ skip });
        this.databaseCall(this.state.limit, skip);
    }

    render() {
        return (
            <section className='exploreStocksContainer'>
                <h1 className='title is-3'>Explore Symbols</h1>
                <div className='exploreStocksContainerButtons'>
                    <button className='button is-link' onClick={() => this.goBack()}>{`   <<   `}</button>
                    <button className='button is-link' onClick={() => this.goForward()}>{`   >>   `}</button>
                </div>
                <div className='exploreSymbolContainer'> 
                    {this.renderStocks()}
                </div>
            </section>
        )
        
    }
} 


