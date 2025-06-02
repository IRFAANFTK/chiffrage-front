import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';

function App() {
    const [session, setSession] = useState(null);
    const [player, setPlayer] = useState(null);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Card Game</h1>

            {!session ? (
                <Home onSessionCreated={(session, player) => {
                    setSession(session);
                    setPlayer(player);
                }} onSessionJoined={(session, player) => {
                    setSession(session);
                    setPlayer(player);
                }} />
            ) : (
                <Game session={session} player={player} />
            )}
        </div>
    );
}

export default App;
