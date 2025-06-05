import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.49.255.184:80/api', // Laravel API URL
});

export default api;
