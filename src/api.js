import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:80/api', // Adjust if your Laravel backend differs
});

export default api;
