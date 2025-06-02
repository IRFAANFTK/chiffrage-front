import React, { useState } from 'react';
import CreateSession from './components/CreateSession';
import JoinSession from './components/JoinSession';
import Session from './components/Session';

function App() {
    const [sessionCode, setSessionCode] = useState(null);
    const [player, setPlayer] = useState(null);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Card Game</h1>
            {!sessionCode && <CreateSession onSessionCreated={setSessionCode} />}
            {sessionCode && !player && <JoinSession sessionCode={sessionCode} onPlayerJoined={setPlayer} />}
            {sessionCode && player && <Session sessionCode={sessionCode} player={player} />}
        </div>
    );
}

export default App;
