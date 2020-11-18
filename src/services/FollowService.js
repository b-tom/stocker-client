import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
    baseURL,
    withCredentials: true
})

const FOLLOW_SERVICE = {
    addStock(stockData) {
        return service.post('/api/following', stockData)
    },
    getFollowedStocks() {
        return service.get('/api/following');
    },
    deleteFollowedStock(id) {
        return service.post(`/api/following/${id}/delete`, {});
    },
    updateFollowedStock(id, stockData) {
        return service.post(`/api/following/${id}/update`, stockData);
    },
    getFollowedStocksDetails(id) {
        return service.get(`/api/following/${id}`);
    }
};

export default FOLLOW_SERVICE;