import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.css';
import '../../../App.css';

export default class ListCollections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followedCollections:[],
        }
    }
    componentDidMount() {
        const followedCollections = [];
        this.props.allCollections.forEach( collection => {
            if(this.props.currentUser?.followedCollections?.includes(collection._id)) {
                followedCollections.push(collection)
            }
        })
         this.setState ({ 
            followedCollections
        })
    }

    render(){
        return (
            <>
                <div >
                    <Link className='button is-primary' to='/create-collection'>Create Collection</Link>
                </div>
                <div className='columns'>
                    <div className='column'>
                        <h2 className='title is-3'>My Collections</h2>
                        {this.props.collections ? 
                            <div className='exploreSymbolContainer'>
                                {this.props.collections.map(collection => (
                                    <div className='card exploreSymbol' key={collection._id}>
                                        <div className='card-content media-content'>
                                            <h2 className='title is-4'>{collection.name} by {collection.user.username}</h2>
                                            <h6 className='subtitle is-6'>{collection.description}</h6>
                                            <h6>{collection?.followers?.length} Followers</h6>
                                            <Link to={`collections/${collection._id}`}>
                                                Show Details
                                            </Link>
                                        </div>
                                    </div>                                
                                ))} 
                            </div>
                            :
                            <h3>You currently have no Collections!</h3>
                        }
                    </div>
                    <div className='column'>
                        <h2 className='title is-3'>Followed Collections</h2>
                    <div className='exploreSymbolContainer'>
                        {this.state.followedCollections?.map(collection => (
                            <div className='card exploreSymbol' key={collection._id}>
                                <div className='card-content media-content'>
                                    <h2 className='title is-4'>{collection.name} by {collection.user.username}</h2>
                                    <h6 className='subtitle is-6'>{collection.description}</h6>
                                    <h6>{collection?.followers?.length} Followers</h6>
                                    <Link to={`collections/${collection._id}`}>
                                        Show Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    </div>
                </div>
              </>
       );
    }
};

