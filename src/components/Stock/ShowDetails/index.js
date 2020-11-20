import axios from 'axios';
import React, { Component } from 'react';
import Graph1 from '../../Graph1';
import FOLLOW_SERVICE from '../../../services/FollowService';
import COLLECTION_SERVICE from '../../../services/CollectionService';
import SYMBOL_SERVICE from '../../../services/SymbolService';
import '../../../App.css';

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
            companyNews:[]
        }
    }

    componentDidMount() {
        SYMBOL_SERVICE.getSymbol( this.props.match.params.id )
            .then(responseFromServer => {
                const { symbol } = responseFromServer.data;
                this.setState({ symbol })
                Promise.all([
                    axios
                    .get(`http://api.marketstack.com/v1/eod?access_key=7eb019f9be084b7f7e5807177c92bd88&symbols=${this.state.symbol.symbol}&date_from=${this.state.startDate}&date_to=${this.props.today}`, { json: true },)
                    .then(response => {
                        this.setState ({
                            stockInfo: response.data.data,
                            currentValue: response.data.data[0].close,
                            user: this.props.currentUser._id,
                            responseLoading: false,
                        })
                    })
                    ,
                    axios
                    .get(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.state.symbol.symbol}&token=bulj6l748v6p4m01tscg`, { json: true })
                    .then(response =>{
                        this.setState ({
                            companyProfile:response.data
                        })
                    })
                    ,
                    axios
                    .get(`https://finnhub.io/api/v1/company-news?symbol=${this.state.symbol.symbol}&from=2020-10-01&to=${this.props.today}&token=bulj6l748v6p4m01tscg`, { json: true})
                    .then(response => {
                        this.setState ({
                            companyNews:response.data.splice(-5)
                        })
                    })
                ])
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
                        isFollowing: true,
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
            .then(() =>{
                this.props.history.push(`/collections/${selectedCollection}`);
            })
            .catch(err => console.log(err))
    }

    render() {      
        const { symbol, currentValue, minThreshold, maxThreshold } = this.state;
        const isFollowing = this.props.stocksFollowedByUser?.find(stock => stock.symbol.symbol === this.state.symbol.symbol);
        console.log(this.state.companyNews)
        return (
            <div>
               <div>
                    <h2 className='title is-3'>{symbol.symbol}</h2>  
                    <h2 className='title is-3'>{symbol.description}</h2>  
                   <Graph1 stockInfo={this.state.stockInfo} followingData={this.state.followingData} minThreshold={this.state.minThreshold} maxThreshold={this.state.maxThreshold}/>
               </div>
               <div>
                    <h2 className='title is-5'>Company Information</h2>
                    <div className='compProfDetails'>
                        <div>
                            <img style={{margin: '10px', width:'128px', height:'128px'}} src={this.state.companyProfile.logo ? this.state.companyProfile.logo : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'} alt='logo' />
                        </div>
                        <div>
                            <h2>Latest Value:{this.state.stockInfo[0].close}</h2>
                            <h2>Industry:{this.state.companyProfile.finnhubIndustry}</h2>
                            <h2>Market Cap:{this.state.companyProfile.marketCapitalization}</h2>
                            <h2>IPO:{this.state.companyProfile.ipo}</h2>
                            <a href={this.state.companyProfile.weburl}>Company WebPage</a>
                        </div>                        
                    </div>

                    <h2 className='title is-5'>Latest News</h2>
                        <ul>
                            {   
                                this.state.companyNews.map(news => (
                                    <li><a href={news.url}>{news.headline}</a></li>
                                ))
                            }
                        </ul>

                    <div className='symbolDetailsButtons'>
                        <button className='button is-link is-light' onClick={(e) => this.showDetails(e)} style={{margin: '10px 5px'}}>
                            {this.state.showDetails ? 'Close' : `${this.state.isFollowing ? 'Change Data' : 'Follow'}`}
                        </button>

                        {this.state.showDetails ?  
                            <div>
                                <div className='field'>    
                                    {this.state.showDetails & this.state.isFollowing ? <button className='button is-link is-light' onClick={() => this.handleUpdateSubmission(isFollowing)}>Save Changes</button> : '' }
                                    <form className='field' >
                                        <label className='label'>
                                            Minimum Threshold
                                            <input className='input'
                                                name='minThreshold'
                                                type='number'
                                                placeholder= {this.state.currentValue}
                                                value= {minThreshold}
                                                onChange={this.handleInputChange}
                                            />
                                        </label>
                                        <label className='label'>
                                            Maximum Threshold
                                            <input className='input'
                                                name='maxThreshold'
                                                type='number'
                                                placeholder= {this.state.currentValue}
                                                value= {maxThreshold}
                                                onChange={this.handleInputChange}
                                            />
                                        </label>
                                    </form>
                                </div>
                                <button className='button is-link is-light' onClick={() => this.handleFormSubmission()}>{this.state.isFollowing ? 'Unfollow' : 'Follow!'}</button> 
                            </div>    
                        : ''}

                        {}

                        {
                        }

                        {this.state.addToCollection ?
                            <button className='button is-link is-light' style={{margin: '10px 5px'}} onClick={(e) => this.addToCollectionShowDetails(e)}>Close</button>
                            :
                            <button className='button is-link is-light' style={{margin: '10px 5px'}} onClick={(e) => this.addToCollectionShowDetails(e)}>Add to Collection</button>
                        }
                        {this.state.addToCollection ?
                            <form className='field'>
                                <label className='label'>
                                    <select value={this.state.selectedCollection} name='selectedCollection' onChange={this.handleInputChange}>
                                        <option>Choose Collection</option>
                                        {this.state.collections.map(collection => (
                                            <option value={collection._id} key={collection._id}>
                                                {collection.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button className='button is-link is-light'  onClick={(e) => this.addToCollection(e)}>Add to Collection</button>
                            </form>                       
                            :
                            ''
                        }
                    </div>
               </div>
            </div>
        )
    }
}