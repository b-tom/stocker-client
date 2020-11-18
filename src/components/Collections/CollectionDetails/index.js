import React, { Component } from 'react'
import COLLECTION_SERVICE from '../../../services/CollectionService';
import USER_SERVICE from '../../../services/AuthService';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Graph from '../../Graph';

export default class CollectionDetails extends Component {
    state = {
        collection: {},
        followed: false,
    };

    loadCollectionDetails = () => {
        COLLECTION_SERVICE.getCollectionDetails(this.props.match.params.id)
            .then(responseFromServer => {
                const { collection } = responseFromServer.data;
                this.setState({ collection });
            })
            .then(() => {
                this.state.collection?.symbols?.forEach(symbol => {
                    axios
                        .get(`http://api.marketstack.com/v1/eod?access_key=1c3e794b3e21ba8a689dc2f85fc8317c&symbols=${symbol.symbol}&date_from=2020-01-01&date_to=${this.props.today}`, { json: true },)
                        .then(response => {
                            <Graph stockInfo={response.data} />
                        })  
                })
            })
            .catch(err => console.log(err));
    };

    // getStockData = () => {
        
    // }

    componentDidMount() {
        this.loadCollectionDetails()
        // this.getStockData();
        this.isfollowing();
    }

    deleteCollection = collectionId => {
        COLLECTION_SERVICE.deleteCollection(collectionId)
            .then(() => {
                this.props.onCollectionChangeAfterDelete(collectionId);
                this.props.history.push('/');
            })
            .catch(err => console.log(err));
    };

    showSymbols = () => {
        // return this.state.collection?.symbols?.map(symbol => {
        //     axios
        //         .get(`http://api.marketstack.com/v1/eod?access_key=1c3e794b3e21ba8a689dc2f85fc8317c&symbols=${symbol.symbol}&date_from=2020-01-01&date_to=${this.props.today}`, { json: true },)
        //         .then(response => {
        //     return (
        //         <div>
        //             <h2> {symbol.symbol}</h2>
        //             <h2>{symbol.name}</h2>
        //             <Graph stockInfo={response.data.data} />
        //             <h6>Current Value: {response.data.data[0].close }</h6>
        //         </div>
        //      )   
        //     })
    // })
    }

    followCollection = () => {
        const followedCollections = this.state.collection._id
        
        USER_SERVICE.followCollection(followedCollections)
            .then(() => {
                this.setState({
                    followed: true,
                })
            })
            .catch(err => console.log(err));
    }

    unfollowCollection = () => {
        const collection = this.state.collection._id

        USER_SERVICE.unfollowCollection(collection)
            .then(() => {
                this.setState({
                    followed:false
                })
            })
            .catch(err => console.log(err))
    }

    isfollowing = () => {
        const collectionData = this.props.currentUser.followedCollections?.find(collection => collection === this.props.match.params.id);
        if(collectionData) {
            this.setState({
                followed: true
            })
        }
    }

    
    render() {
        return (
            <section>
                {<h3>{this.state.collection?.name} by {this.state.collection?.user?.username}</h3>}
                <p>{this.state.collection?.description}</p>
                <h4>Symbols</h4> 
                    {this.showSymbols()}
                {this.props.currentUser._id === this.state.collection?.user?._id && (
                    <>
                        <Link 
                            to={{
                                pathname: `/collections/${this.state.collection?._id}/edit`,
                                collection: this.state.collection
                            }}
                        > 
                        Update Collection 
                        </Link>
                        <button onClick={() => this.deleteCollection(this.state.collection?._id)}> Delete Collection </button>
                    </>
                )}
                {this.state.followed ? 
                    <button onClick={() => this.unfollowCollection()}> Unfollow </button>
                    :
                    <button onClick={() => this.followCollection()}> Follow </button>
                }
            </section>
        )
    }
}
