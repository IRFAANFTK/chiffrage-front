import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '0814368aa7c6caa0ce65',
    cluster: 'eu',
    forceTLS: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
