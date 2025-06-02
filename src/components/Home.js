import React, { useState } from 'react';
import api from '../api';

function Home({ onSessionCreated, onSessionJoined }) {
    const [name, setName] = useState('');
    const [joinName, setJoinName] = useState('');
    const [sessionCode, setSessionCode] = useState('');

    const createSession = async () => {
        const res = await api.post('/sessions', { name });
        onSessionCreated(res.data.session, res.data.player);
    };

    const joinSession = async () => {
        const res = await api.post(`/sessions/${sessionCode}/join`, { name: joinName });
        const sessionRes = await api.get(`/sessions/${sessionCode}`);
        onSessionJoined(sessionRes.data, res.data.player);
    };

    return (
        <div className="flex gap-8">
            {/* Create Session */}
            <div className="flex-1 flex flex-col gap-2 p-4 border rounded">
                <h2 className="font-semibold">Create Session</h2>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-2 py-1"
                />
                <button
                    onClick={createSession}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Create
                </button>
            </div>

            {/* Join Session */}
            <div className="flex-1 flex flex-col gap-2 p-4 border rounded">
                <h2 className="font-semibold">Join Session</h2>
                <input
                    type="text"
                    placeholder="Session code"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    className="border px-2 py-1"
                />
                <input
                    type="text"
                    placeholder="Your name"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    className="border px-2 py-1"
                />
                <button
                    onClick={joinSession}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Join
                </button>
            </div>
        </div>
    );
}

export default Home;
