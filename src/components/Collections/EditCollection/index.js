import React, { Component } from 'react';
import COLLECTION_SERVICE from '../../../services/CollectionService'

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
                console.log(responseFromServer)
                const { collection } = responseFromServer.data;
                this.props.history.push(`/collections/${collection._id}`);
            })
            .catch(err => console.log(err));
    };

    render() {
        const {name, description, /*symbols*/} = this.state;
        return (
            <section>
                <h2>Edit Collection</h2>

                <form onSubmit={this.handleFormSubmission}>
                    <label>
                        Name
                        <input
                            name='name'
                            type='text'
                            value={name}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label>
                        Description
                        <input
                            name='description'
                            type='text'
                            value={description}
                            onChange={this.handleInputChange}
                        />
                    </label>

                    <button> Save Collection </button>
                </form>
            </section>
        )
    }
}
