import React, { Component } from 'react'
import COLLECTION_SERVICE from '../../../services/CollectionService';
import USER_SERVICE from '../../../services/AuthService';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class CollectionDetails extends Component {
    state = {
        collection: {},
        followed: false,
        stocksInCollection: {}
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
                        .get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol.symbol}&token=bulj6l748v6p4m01tscg`, { json: true})
                        .then(response => {
                            this.setState({
                                stocksInCollection: {...this.state.stocksInCollection, [symbol.symbol]: response.data}
                            })
                        })
                    })
                })
            .catch(err => console.log(err));
    };

    componentDidMount() {
        this.loadCollectionDetails()
        this.isfollowing();
    }

    deleteCollection = collectionId => {
        COLLECTION_SERVICE.deleteCollection(collectionId)
            .then(() => {
                this.props.onCollectionChangeAfterDelete(collectionId);
                this.props.history.push('/collections');
            })
            .catch(err => console.log(err));
    };

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

    displayStocks = () => {
        const stocks = this.state?.stocksInCollection && Object.values(this.state?.stocksInCollection)?.map(stock => {
            return (
                <div className='card-content' key={stock.ticker}>
                    <div className='media'>
                        <div className='media-left'>
                            <figure className='image is-48x48'>
                                <img src={stock.logo ? stock.logo : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'} alt='logo'/>
                            </figure>           
                        </div>
                        <div className='media-content columns'>
                            <div className='column'>
                                <h2 className='title is-6'>{stock.ticker}</h2>
                                <h2>{stock.name}</h2>
                                <h6>{stock.finnhubIndustry}</h6>
                            </div>
                            <div className='column'>
                                <h2>IPO: {stock.ipo}</h2>
                                <h2>Market Cap: {stock.marketCapitalization}</h2>
                                <h6>Share Value: {stock.shareOutstanding}</h6>
                            </div>
                        </div>
                    </div>
                    <Link>Details</Link>
                </div>
            )
        })

        return stocks
    }

    render() {
        return (
            <section>
                {<h3 className='title is-3'>{this.state.collection?.name} by {this.state.collection?.user?.username}</h3>}
                <p className='subtitle is-3'>{this.state.collection?.description}</p>
                <div className='collectionDetailsContainer'>
                    <div className='card'>
                        {this.state.collection?.symbols?.length > 0
                        ?
                        <div>
                            <h4 className='subtitle is-4'>Symbols</h4> 
                            {this.displayStocks()}
                        </div> 
                        :
                        <h4 className='subtitle is-3'>This Collection has no stocks</h4>
                        }
                    </div>
                    <div className='collectionDetailsButtons'>
                        {this.props.currentUser._id === this.state.collection?.user?._id && (
                            <>
                                <Link className='button is-link'
                                    to={{
                                        pathname: `/collections/${this.state.collection?._id}/edit`,
                                        collection: this.state.collection
                                    }}
                                > 
                                Update Collection 
                                </Link>
                                <button className='button is-link' onClick={() => this.deleteCollection(this.state.collection?._id)}> Delete Collection </button>
                            </>
                        )}
                        {this.state.followed ? 
                            <button className='button is-danger' onClick={() => this.unfollowCollection()}> Unfollow </button>
                            :
                            <button className='button is-link' onClick={() => this.followCollection()}> Follow </button>
                        }
                    </div>
                </div>
            </section>
        )
    }
}
