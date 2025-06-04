import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import './index.css';

function App() {
    const [session, setSession] = useState(null);
    const [player, setPlayer] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-4 left-4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-1 rounded z-50"
            >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {!session ? (
                <Home
                    onSessionCreated={(s, p) => {
                        setSession(s);
                        setPlayer(p);
                    }}
                    onSessionJoined={(s, p) => {
                        setSession(s);
                        setPlayer(p);
                    }}
                />
            ) : (
                <Game session={session} player={player} />
            )}
        </div>
    );
}

export default App;
