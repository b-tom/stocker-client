import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
    baseURL,
    withCredentials: true
});

const SYMBOL_SERVICE = {
    getSymbols(limit, skip) {
        return service.get(`/api/symbols/limit=${limit}&skip=${skip}`)
    },
    getSymbol(id) {
        return service.get(`/api/symbols/${id}`)
    }

}

export default SYMBOL_SERVICE;
