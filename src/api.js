import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:80/api', // Laravel API URL
});

export default api;
