import React, { Component } from 'react';
import SYMBOL_SERVICE from '../../services/SymbolService';

export default class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            symbols: [],
        }
    }
    componentDidMount(){
        SYMBOL_SERVICE.searchSymbol(this.props.searchValue)
        .then(responseFromServer => {
            const { symbols } = responseFromServer.data;
            this.setState({ symbols })
        })
    }

    render() {
        console.log(this.state.symbols)
        return (
            <div>
                
            </div>
        )
    }
}
