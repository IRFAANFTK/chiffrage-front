import React, { useState } from 'react';
import api from '../api';
import xefiLogo from '../assets/logoxefi.png';

function Home({ onSessionCreated, onSessionJoined }) {
    const [name, setName] = useState('');
    const [joinName, setJoinName] = useState('');
    const [sessionCode, setSessionCode] = useState('');
    const [loading, setLoading] = useState(false);

    const createSession = async () => {
        setLoading(true);
        try {
            const res = await api.post('/sessions', { name });
            onSessionCreated(res.data.session, res.data.player);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création de session");
        } finally {
            setLoading(false);
        }
    };

    const joinSession = async () => {
        const res = await api.post(`/sessions/${sessionCode}/join`, { name: joinName });
        const sessionRes = await api.get(`/sessions/${sessionCode}`);
        onSessionJoined(sessionRes.data, res.data.player);
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col justify-center items-center px-6 py-12">
            <img
                src={xefiLogo}
                alt="XEFI Logo"
                className="w-32 md:w-40 mb-4 bg-white p-2 rounded-md shadow"
            />

            <h1 className="text-4xl font-bold mb-12 animate-fade-in">
                Bienvenue sur XEFI Chiffrage
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
                {/* Créer une session */}
                <div className="bg-gray-100 dark:bg-neutral-900 p-6 rounded-xl border border-gray-300 dark:border-neutral-700 shadow-md transition transform hover:scale-[1.02] duration-200">
                    <h2 className="text-xl font-semibold mb-4">Créer une session</h2>
                    <input
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 px-4 py-2 bg-gray-200 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={createSession}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex justify-center items-center"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                />
                            </svg>
                        )}
                        {loading ? "Création..." : "Créer"}
                    </button>
                </div>

                {/* Rejoindre une session */}
                <div className="bg-gray-100 dark:bg-neutral-900 p-6 rounded-xl border border-gray-300 dark:border-neutral-700 shadow-md transition transform hover:scale-[1.02] duration-200">
                    <h2 className="text-xl font-semibold mb-4">Rejoindre une session</h2>
                    <input
                        type="text"
                        placeholder="Code de session"
                        value={sessionCode}
                        onChange={(e) => setSessionCode(e.target.value)}
                        className="w-full mb-3 px-4 py-2 bg-gray-200 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Votre nom"
                        value={joinName}
                        onChange={(e) => setJoinName(e.target.value)}
                        className="w-full mb-4 px-4 py-2 bg-gray-200 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={joinSession}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Rejoindre
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
