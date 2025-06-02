import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '0814368aa7c6caa0ce65',
    cluster: 'eu',
    forceTLS: true,
});

export default echo;
