import React, { useState } from 'react';
import api from '../api';

const JoinSession = ({ sessionCode, onPlayerJoined }) => {
    const [name, setName] = useState('');

    const joinSession = async () => {
        if (!name) return;
        const res = await api.post(`/sessions/${sessionCode}/join`, { name });
        onPlayerJoined(res.data.player);
    };
    return (
        <div className="flex flex-col items-center gap-4 mt-4">
            <h2 className="text-xl font-semibold">Join Session: {sessionCode}</h2>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
                onClick={joinSession}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
                Join
            </button>
        </div>
    );
};

export default JoinSession;
