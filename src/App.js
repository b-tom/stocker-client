import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bulma/css/bulma.css'

import AUTH_SERVICE from './services/AuthService';
import SYMBOL_SERVICE from './services/SymbolService';
import COLLECTION_SERVICE from './services/CollectionService';
import FOLLOW_SERVICE from './services/FollowService';

import Signup from './components/Authentication/Signup';
import Login from './components/Authentication/Login';
import Home from './components/Home';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Explore from './components/Explore';
import ShowDetails from './components/Stock/ShowDetails';
import CreateCollection from './components/Collections/CreateCollection';
import CollectionDetails from './components/Collections/CollectionDetails';
import EditCollection from './components/Collections/EditCollection';
import GetCollections from './components/Collections/GetCollections';
import Search from './components/Search';
import SymbolsRedirect from './components/Stock/SymbolsRedirect';

export default class App extends React.Component {
    state = {
        currentUser: null,
        symbols:[],
        followedStock: [],
        collections:[],
        allCollections:[],
        today:'',
    }

    updateOnLogin = () => {
        AUTH_SERVICE.getAuthenticatedUser()
        .then(responseFromServer => {
            const { user } = responseFromServer.data;
            this.setState({ currentUser: user})  
        })
        SYMBOL_SERVICE.getSymbols()
        .then(responseFromServer => {
            const { symbol } = responseFromServer.data;
            this.setState({ symbols:symbol })
        })
        FOLLOW_SERVICE.getFollowedStocks()
        .then(responseFromServer => {
            const { stocks } = responseFromServer.data;
            this.setState({ followedStock: stocks })
        })
        COLLECTION_SERVICE.getCollections(this.state.currentUser?._id)
        .then(responseFromServer => {
            const { collections } = responseFromServer.data;
            this.setState({ collections });
        })
        COLLECTION_SERVICE.getAllCollections()
            .then(responseFromServer => {
                const { allCollections } = responseFromServer.data;
                this.setState({ allCollections });
            })
        .then(() => { 
            this.updateToday()
        })
        .catch(err => console.log(err));
    };

    updateUser = user => {
        this.setState({ currentUser: user });
    };

    updateStocks = stock => {
        const stockFollowed = [...this.state.followedStock, stock];
        this.setState({ followedStock: stockFollowed});
    };

    addCollection = collection => {
        const updatedCollections = [ ...this.state.collections , collection];
        this.setState({ collections: updatedCollections})
    }

    updateStocksAfterUnfollow = id => {
        const updatedFollowingStocks = [...this.state.followedStock];

        updatedFollowingStocks.splice(
            updatedFollowingStocks.findIndex(stock => stock._id === id), 1
        );

        this.setState({ followedStock: updatedFollowingStocks });
    }

    updateCollectionsAfterDelete = id => {
        const updatedCollections = [...this.state.collections];
        updatedCollections.splice(
            updatedCollections.findIndex(collection => collection._id === id), 1
        );

        this.setState({ collections: updatedCollections})
    }

    updateToday = () => {
        const today = new Date().toISOString().slice(0,10);
        this.setState({ today })
    }

    updateStateOnLogout = () => {
        this.setState({
            currentUser: null,
            followedStock: [],
            collections:[],
            symbols:[],
            today:'',
        })
    }

    render() {
        return (
            <div className='App'>
                <BrowserRouter>
                    <nav>
                        <NavBar currentUser={this.state.currentUser} onUserChange={this.updateUser} onLogout={this.updateStateOnLogout} />
                    </nav>
                    <Switch>
                        <Route 
                            exact 
                            path='/' 
                            render={props => <Home {...props} currentUser={this.state.currentUser} followedStock={this.state?.followedStock} updateOnLogin={this.updateOnLogin} today={this.state.today}/>} 
                        />
                        <Route 
                            path='/signup-page' 
                            render={props => <Signup {...props} onUserChange={this.updateUser} />} 
                        />
                        <Route 
                            path='/login-page' 
                            render={props => <Login {...props} onUserChange={this.updateUser} />} 
                        />
                        <ProtectedRoute 
                            path='/profile'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <Profile {...props} currentUser={this.state.currentUser} />}
                        />
                        <ProtectedRoute 
                            path='/explore'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <Explore {...props} currentUser={this.state.currentUser} symbols={this.state.symbols} allCollections={this.state.allCollections}/>}
                        />
                        <ProtectedRoute 
                            path='/details/:id'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <ShowDetails {...props} currentUser={this.state.currentUser} onStockChange={this.updateStocks} onStockUnfollow={this.updateStocksAfterUnfollow} stocksFollowedByUser={this.state.followedStock} today={this.state.today} />}
                        />
                        <ProtectedRoute
                            path='/create-collection'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <CreateCollection {...props} currentUser={this.state.currentUser} onCollectionChange={this.addCollection}/>}
                        />
                        <ProtectedRoute
                            path='/collections/:id/edit'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <EditCollection {...props} currentUser={this.state.currentUser}/>}
                        />
                        <ProtectedRoute
                            path='/collections/:id'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <CollectionDetails {...props} currentUser={this.state.currentUser} onCollectionChangeAfterDelete={this.updateCollectionsAfterDelete} today={this.state.today}/>}
                        />
                       <ProtectedRoute
                            path='/collections'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <GetCollections {...props} collections={this.state.collections} currentUser={this.state.currentUser} allCollections={this.state.allCollections}/>}
                        />
                       <ProtectedRoute
                            path='/search'
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <Search {...props} currentUser={this.state.currentUser} />}
                        />
                       <ProtectedRoute
                            path={'/stocks/:symbol'}
                            authorized={this.state.currentUser}
                            redirect={'/signup-page'}
                            render={props => <SymbolsRedirect {...props} currentUser={this.state.currentUser} symbols={this.state.symbols}/>}
                        />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}
