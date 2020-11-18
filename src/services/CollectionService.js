import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
    baseURL,
    withCredentials: true
})

const COLLECTION_SERVICE = {
    createCollection(collection) {
        return service.post('/api/collections', collection)
    },
    getCollections(userId){
        return service.get('/api/collections')
    },
    deleteCollection(id){
        return service.post(`/api/collections/${id}/delete`, {});
    },
    updateCollection(id, collectionData) {
        return service.post(`/api/collections/${id}/update`, collectionData);
    },
    getCollectionDetails(id) {
        return service.get(`/api/collections/${id}`);
    },
    getAllCollections(){
        return service.get('/api/allCollections')
    },
    addStockToCollection(id, collectionData){
        return service.post(`/api/collections/${id}/addStock`, collectionData);
    }

};

export default COLLECTION_SERVICE;