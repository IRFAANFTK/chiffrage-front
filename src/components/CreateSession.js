import React, { useState } from 'react';
import api from '../api';

const CreateSession = ({ onSessionCreated }) => {
    const [loading, setLoading] = useState(false);

    const createSession = async () => {
        setLoading(true);
        const res = await api.post('/sessions');
        onSessionCreated(res.data.code);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Create Session</h2>
            <button
                onClick={createSession}
                disabled={loading}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
                {loading ? 'Creating...' : 'Create Session'}
            </button>
        </div>
    );
};

export default CreateSession;
