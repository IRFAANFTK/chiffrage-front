import axios from 'axios';

const api = axios.create({
    baseURL: 'https://982b-41-207-138-102.ngrok-free.app/api', // Laravel API URL
});

export default api;
