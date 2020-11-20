import React, { Component } from 'react';
import COLLECTION_SERVICE from '../../../services/CollectionService';
import 'bulma/css/bulma.css';


export default class EditCollection extends Component {
    constructor(props) {
        super(props)
        const {_id, name, description, symbols, totalValue, user } = this.props.location.collection;

        this.state = {
            _id,
            name,
            description,
            symbols,
            totalValue,
            user
        };
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });      
    };
    
    handleFormSubmission = event => {
        event.preventDefault();
        const {_id, name, description, symbols, totalValue } = this.state;
        console.log(_id)
        COLLECTION_SERVICE.updateCollection(_id, {name, description, symbols, totalValue})
            .then(responseFromServer => {
                const { collection } = responseFromServer.data;
                this.props.history.push(`/collections/${collection._id}`);
            })
            .catch(err => console.log(err));
    };

    removeSymbol = (id) => {
        const symbols = this.state.symbols;
        const index= symbols.findIndex(sym => sym._id === id)
        symbols.splice(index,1)
        this.setState= ({symbols})
    }
    
    render() {
        const {name, description, symbols} = this.state;
        return (
            <section>
                <h2 className='title is-3'>Edit Collection</h2>
                <div className='columns'>
                    <div className='column'>
                        <form className='field' onSubmit={this.handleFormSubmission}>
                            <label className='label subtitle is-3'>
                                Name
                                <input className='label'
                                    name='name'
                                    type='text'
                                    value={name}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <label className='label subtitle is-3'>
                                Description
                                <input className='label'
                                    name='description'
                                    type='text'
                                    value={description}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            
                            <button className='button is-link'> Save Collection </button>
                        </form>
                    </div>
                    <div className='column'>
                        <h2 className='subtitle is-3'>Stocks</h2>
                        {symbols?.map(symbol => {
                            return (
                                <div className='buttonCollectionUpdate' key={symbol._id}>
                                    <h2 className='subtitle is-4'> {symbol.symbol}</h2>
                                    <button className='button is-danger' onClick={() =>this.removeSymbol(symbol._id)}>Remove</button>
                                </div>
                            )})
                        }
                    </div>
                    
                </div>
                
            </section>
        )
    }
}
