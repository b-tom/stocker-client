import React from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.css';
import '../../../App.css';

const GetAllCollections = props => {
    return (
        <section>
            <div className='exploreSymbolContainer'>
                {props.allCollections?.map(collection => (
                    <div className='card exploreSymbol' key={collection?._id}>
                        <div className='card-content media-content'>
                            <h2 className='title is-4'>{collection?.name} by {collection?.user?.username}</h2>
                            <h6 className='subtitle is-6'>{collection?.description}</h6>
                            <h6>Stock Qty: {collection?.symbols?.length}</h6>
                            <h6>{collection?.followers?.length} Followers</h6>
                            <Link to={`collections/${collection?._id}`}>
                                Show Details
                            </Link>
                        </div> 
                    </div>
                ))} 
            </div>
        </section>
    )
}

export default GetAllCollections