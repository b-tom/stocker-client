import React, { Component } from 'react'
import COLLECTION_SERVICE from '../../../services/CollectionService';

export default class CreateCollection extends Component {
    state = {
        name:'',
        description: '',
        symbols: [],
        totalValue:0,
        user:this.props.currentUser,
        message: null,
        followers:[],
        tags:[],
        theTag:'',
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleFormSubmission  = async event => {
        const theTags = [...this.state.theTag.split(" ")]
        await this.setState ({ tags: theTags })
        event.preventDefault();
        const { name, description, symbols, totalValue, user, followers, tags } = this.state;
        COLLECTION_SERVICE.createCollection({ name, description, symbols, totalValue, user, followers, tags })
            .then(async responseFromServer => {
                const { collection } = responseFromServer.data;
                await this.props.onCollectionChange(collection);
                this.props.history.push('/');
            })
            .catch(err => {
                if(err.response && err.response.data) {
                    return this.setState({ message: err.response.data.message });
                }
            });
    };

    render() {
        const { name, description, theTag } = this.state;
        return (
            <div className='field'>
                <h2 className='title is-3' >Create a new Collection</h2>

                <form className='field' onSubmit={this.handleFormSubmission}>
                    <label className='label'>
                        Name
                        <input className='input'
                            name='name'
                            type='text'
                            placeholder='Below $1000'
                            value={name}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label className='label'>
                        Description
                        <input className='input'
                            name='description'
                            type='text'
                            placeholder='Below $1000'
                            value={description}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label className='label'>
                        Tags
                        <input className='input'
                            name='theTag'
                            type='text'
                            placeholder='#stockEr'
                            value={theTag}
                            onChange={this.handleInputChange}
                        />
                    </label>

                    <button className='button is-link'> Create Collection </button>
                </form>
            </div>
        );
    }
}