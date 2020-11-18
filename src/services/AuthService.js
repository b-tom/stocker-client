import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true
});

const AUTH_SERVICE = {
  signup(userData) {
    return service.post('/api/signup', userData);
  },
  login(userData) {
    return service.post('/api/login', userData);
  },
  logout() {
    return service.post('/api/logout', {});
  },
  getAuthenticatedUser() {
    return service.get('/api/isLoggedIn');
  },
  followCollection(id ) {
    return service.post(`/api/addFollowedCollection/${id}`);
  },
  unfollowCollection(id) {
    return service.post(`/api/removeFollowedCollection/${id}`);
  }
};

export default AUTH_SERVICE;
