// src/config/echo.js
import Echo from 'laravel-echo';

const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT,
    wssPort: process.env.REACT_APP_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

export default echo;