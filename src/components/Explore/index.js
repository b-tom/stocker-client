import React, { Component } from 'react';
import GetAllCollections from '../Collections/GetAllCollections';
import ListSymbols from '../Stock/ListSymbols';
import 'bulma/css/bulma.css';


export default class Stocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfStocks: this.props.symbols,
            stocksToShow: this.props.symbols,
        }
    }

    onChange = (event) => {
        const { name , value } = event.target;
        this.setState({
          [name]: value,
        });
    };

    // onSearch = async (event) => {
    //     const { value } = event.target;
    //     this.onChange(event);
    //     const filteredStock = this.state.listOfStocks.filter((item) => 
    //         item.symbol?.toLowerCase().includes(value.toLowerCase()) || item.description?.toLowerCase().includes(value.toLowerCase())
    //     );
    //     this.setState({
    //         stocksToShow: filteredStock,
    //     })
    // }

    render(){
        if(this.state.responseLoading) {
            return <div>Loading...</div>
        }
        return(
            <>
                <div className='columns'>
                    <div className='column column-container'>
                        {/* <h1 className='title is-3'>Explore Symbols</h1> */}
                        <ListSymbols  currentUser={this.props.currentUser} symbols={this.state.stocksToShow}/>
                    </div>
                    <div className='column column-container'>
                        {/* <h1 className='title is-3'>Explore Collections</h1> */}
                        <GetAllCollections allCollections={this.props.allCollections} currentUser={this.props.currentUser} />
                    </div>
                </div>
            </>
        )
    }
}