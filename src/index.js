import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '779a8702f0ec6e2a2872',
    cluster: 'eu',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);




