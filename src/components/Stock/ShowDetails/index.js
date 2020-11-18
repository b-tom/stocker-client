import axios from 'axios';
import React, { Component } from 'react';
import Graph from '../../Graph'
import FOLLOW_SERVICE from '../../../services/FollowService';
import COLLECTION_SERVICE from '../../../services/CollectionService';
import SYMBOL_SERVICE from '../../../services/SymbolService';

export default class Stock extends Component {
    constructor(props){
        super(props);
        this.state = {
            symbol: {},
            startDate: '2020-01-01',
            stockInfo:[{}],
            currentValue: 0,
            minThreshold: 0,
            maxThreshold: 0,
            showDetails:false,
            addToCollection: false,
            user: '',
            isFollowing: false,
            responseLoading: true,
            followingData:{},
            collections:[],
            selectedCollection:{},
            message:'',
            companyProfile:{},
        }
    }

    componentDidMount() {
        SYMBOL_SERVICE.getSymbol( this.props.match.params.id )
            .then(responseFromServer => {
                const { symbol } = responseFromServer.data;
                this.setState({ symbol })
                axios
                    .get(`http://api.marketstack.com/v1/eod?access_key=6c7b15b3af607a3f2ee13adfa5bf41a6&symbols=${this.state.symbol.symbol}&date_from=${this.state.startDate}&date_to=${this.props.today}`, { json: true },)
                    .then(response => {
                        this.setState ({
                            stockInfo: response.data.data,
                            currentValue: response.data.data[0].close,
                            user: this.props.currentUser._id,
                            responseLoading: false,
                        })
                    })
                    .then(this.isFollowing())
                    .then(COLLECTION_SERVICE.getCollections(this.props.currentUser._id)
                        .then(responseFromServer =>{
                            const { collections } = responseFromServer.data
                            this.setState ({ collections })
                        })
                        .catch(err => console.log(err))
                    )
            })
            .catch(err => console.log(err));

        axios
            .get(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.state.symbol.symbol}&token=bulj6l748v6p4m01tscg`, { json: true })
            .then(response =>{
                console.log(response)
                this.setState ({
                    companyProfile:response.data
                })
        })
        
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState ({ [name]: value });
    }

    showDetails(e){
        e.preventDefault();
        this.setState({
            showDetails: !this.state.showDetails
        })
    } 
    addToCollectionShowDetails(e){
        e.preventDefault();
        this.setState({
            addToCollection: !this.state.addToCollection
        })
    } 

    handleFormSubmission = (follow) => {
        const { user, currentValue, minThreshold, maxThreshold, followingData } = this.state;
        const symbol = this.state.symbol._id

        if(!this.state.isFollowing) {
            FOLLOW_SERVICE.addStock({ user, symbol, currentValue, minThreshold, maxThreshold })
                .then(async responseFromServer => {
                    const { stock } = responseFromServer.data;
                    await this.props.onStockChange(stock);
                    this.setState({
                        followingData:stock,
                        isFollowing: true
                    })
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        return this.setState({ message: err.response.data.message });
                    }
                });
        } else{
            FOLLOW_SERVICE.deleteFollowedStock(followingData._id)
            .then(() => {
                this.props.onStockUnfollow(followingData._id);
                this.setState({
                    isFollowing:false,
                    followingData: {}
                })
            })
            .catch(err => console.log(err));

        }
        
    };

    handleUpdateSubmission = (event) => {
        const { minThreshold, maxThreshold, followingData } = this.state;

        FOLLOW_SERVICE.updateFollowedStock(followingData._id, {minThreshold, maxThreshold})
            .then( responseFromServer => {
                const minThreshold = responseFromServer.data.minThreshold
                const maxThreshold = responseFromServer.data.maxThreshold
                this.setState({
                    minThreshold,
                    maxThreshold
                })
            })
            .catch(err => console.log(err));
    };

    isFollowing = () => {
        const stockData = this.props.stocksFollowedByUser?.find(stock => stock.symbol.symbol === this.state.symbol.symbol);
        if (stockData) { 
            this.setState({
                isFollowing: true,
                followingData: stockData,
            })
        }
    }

    addToCollection = (e) => {
        e.preventDefault();
        const { selectedCollection } = this.state;
        
        COLLECTION_SERVICE.addStockToCollection(selectedCollection, {id: this.props.match.params.id})
            .then(responseFromServer =>{
                console.log(responseFromServer)
            })
            .catch(err => console.log(err))
    }

    render() {      
        const { symbol, currentValue, minThreshold, maxThreshold } = this.state;
        const isFollowing = this.props.stocksFollowedByUser?.find(stock => stock.symbol.symbol === this.state.symbol.symbol);
        console.log(this.state.companyProfile)
        return (
            <div>
               <div>
                   <Graph stockInfo={this.state.stockInfo} followingData={this.state.followingData} minThreshold={this.state.minThreshold} maxThreshold={this.state.maxThreshold}/>
               </div>
               <div>
                    <h2>Symbol:{symbol.symbol}</h2>  
                    <h2>Current Value:{currentValue}</h2>  
                    <h2>Min:{this.state.followingData.minThreshold}</h2>  
                    <h2>Max:{this.state.followingData.maxThreshold}</h2>  

                    <button className='btn btn-link' onClick={(e) => this.showDetails(e)}>
                        {this.state.showDetails ? 'Close' : `${isFollowing ? 'Change Threshold' : 'Get notified when price changes'}`}
                    </button>

                    {this.state.showDetails ?  
                        <form>
                            <label>
                                Minimum Threshold
                                <input 
                                    name='minThreshold'
                                    type='number'
                                    placeholder= {this.state.currentValue}
                                    value= {minThreshold}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <label>
                                Maximum Threshold
                                <input 
                                    name='maxThreshold'
                                    type='number'
                                    placeholder= {this.state.currentValue}
                                    value= {maxThreshold}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                        </form>
                    : ''}

                    {this.state.showDetails & this.state.isFollowing ? <button onClick={() => this.handleUpdateSubmission(isFollowing)} className='btn btn-link'>Save Changes</button> : '' }

                    {
                        <button onClick={() => this.handleFormSubmission()}>{this.state.isFollowing ? 'Unfollow' : 'Follow!'}</button> 
                    }

                    {this.state.addToCollection ?
                        <button onClick={(e) => this.addToCollectionShowDetails(e)}>Close</button>
                        :
                        <button onClick={(e) => this.addToCollectionShowDetails(e)}>Add to Collection</button>
                    }
                    {this.state.addToCollection ?
                        <form>
                            <label>
                                <select value={this.state.selectedCollection} name='selectedCollection' onChange={this.handleInputChange}>
                                    <option>Choose Collection</option>
                                    {this.state.collections.map(collection => (
                                        <option value={collection._id} key={collection._id}>
                                            {collection.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button onClick={(e) => this.addToCollection(e)}>Add to Collection</button>
                        </form>                       
                        :
                        ''
                    }
               </div>
            </div>
        )
    }
}