import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';

const FIB_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

function Game({ session, player }) {
    const [players, setPlayers] = useState([]);
    const [chosenCard, setChosenCard] = useState(null);
    const [average, setAverage] = useState(null);
    const [sum, setSum] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    // Fetch players from backend
    const fetchPlayers = useCallback(async () => {
        try {
            const res = await api.get(`/sessions/${session.code}`);
            setPlayers(res.data.players || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    }, [session.code]);

    // Initial fetch on mount
    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    // Listen for real-time updates (e.g., with Pusher / Laravel Echo)
    useEffect(() => {
        const waitForEcho = setInterval(() => {
            if (window.Echo && window.Echo.connector) {
                clearInterval(waitForEcho);
                const channel = window.Echo.channel(`session.${session.code}`);
                channel.listen('.player.joined', (e) => {
                    console.log('👥 Player joined:', e.player);
                    fetchPlayers();
                });
                channel.listen('.player.chosen', () => {
                    fetchPlayers();
                });
                channel.listen('.session.reset', () => {
                    setChosenCard(null);
                    setRevealed(false);
                    setSum(null);
                    setAverage(null);
                    fetchPlayers();
                });
            }
        }, 200);
        return () => clearInterval(waitForEcho);
    }, [session.code, fetchPlayers]);

    // Player chooses a card
    const chooseCard = async (card) => {
        if (chosenCard !== null) return; // prevent re-choosing
        setChosenCard(card);
        try {
            await api.post(`/sessions/${session.code}/choose`, {
                player_id: player.id,
                card,
            });
            await fetchPlayers(); // Refresh players to get updated cards
        } catch (error) {
            console.error('Error choosing card:', error);
            alert('Erreur lors du choix de la carte');
            setChosenCard(null);
        }
    };

    // Automatically calculate sum and average when players or revealed changes
    useEffect(() => {
        if (revealed) {
            const validPlayers = players.filter(p => p.card !== null && p.card !== undefined);
            const total = validPlayers.reduce((acc, p) => acc + p.card, 0);
            const totalVoters = validPlayers.length;
            setSum(total);
            setAverage(totalVoters > 0 ? (total / totalVoters).toFixed(2) : 0);
        }
    }, [players, revealed]);

    // Reveal cards
    const revealCards = () => {
        setRevealed(true);
    };

    // Reset round
    const resetRound = async () => {
        try {
            await api.post(`/sessions/${session.code}/reset`);
            setChosenCard(null);
            setRevealed(false);
            setSum(null);
            setAverage(null);
            await fetchPlayers();
        } catch (error) {
            console.error('Error resetting round:', error);
            alert('Erreur lors du reset');
        }
    };

    // Invite link and copy function
    const inviteLink = `${window.location.origin}/join/${session.code}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center px-4 py-6 relative">
            {/* Theme toggle */}
            <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                <button
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
                >
                    🌗 Mode
                </button>
                <div className="text-sm font-semibold text-black dark:text-white">
                    Session: <span className="text-xs font-mono">{session.code}</span>
                </div>
            </div>

            {/* Invite */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowInvite(!showInvite)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {showInvite ? 'Close' : 'Invite Players'}
                </button>
                {showInvite && (
                    <div className="mt-2 bg-gray-100 dark:bg-neutral-800 p-4 border border-gray-300 dark:border-gray-600 rounded shadow-lg w-72">
                        <p className="mb-2">Share this link with others:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={inviteLink}
                                className="px-2 py-1 bg-white dark:bg-neutral-900 border border-gray-400 dark:border-gray-500 rounded w-full"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="bg-green-600 px-2 py-1 rounded text-white hover:bg-green-700"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Player list */}
            <div className="relative bg-gray-100 dark:bg-neutral-900 p-6 rounded-xxl border border-gray-300 dark:border-gray-700 shadow-xl w-full max-w-4xl flex flex-col items-center animate-fade-in mt-20">
                <h3 className="text-xl font-semibold mb-4">Table des Joueurs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
                    {players.map((p) => (
                        <div
                            key={p.id}
                            className="p-4 rounded-lg bg-gray-200 dark:bg-neutral-800 shadow text-center"
                        >
                            <p className="font-bold">{p.name}</p>
                            {revealed ? (
                                <p className="text-green-500 text-xl font-semibold mt-2 animate-fade-in">
                                    {p.card !== null ? `🃏 ${p.card}` : '❌ Aucune carte'}
                                </p>
                            ) : (
                                <p className="text-yellow-500 mt-2 animate-pulse">Attente...</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Reveal cards button */}
                {!revealed && (
                    <button
                        onClick={revealCards}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow-lg"
                    >
                        Révéler les Cartes
                    </button>
                )}

                {/* Show average and sum */}
                {revealed && (
                    <div className="mt-6 text-center animate-fade-in">
                        <p className="text-xl font-semibold text-green-500 mb-1">🧮 Somme: {sum}</p>
                        <p className="text-xl font-semibold text-cyan-500">📊 Moyenne: {average}</p>
                    </div>
                )}
            </div>

            {/* Show current player's chosen card immediately before reveal */}
            {chosenCard !== null && !revealed && (
                <p className="mt-4 text-center text-blue-700 font-semibold">
                    Vous avez choisi: <span className="text-xl">🃏 {chosenCard}</span>
                </p>
            )}

            {/* Card picker */}
            {!revealed && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-center mb-4">Choisissez votre carte</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {FIB_CARDS.map((num) => (
                            <button
                                key={num}
                                onClick={() => chooseCard(num)}
                                disabled={chosenCard !== null}
                                className={`w-16 h-20 rounded-lg text-xl font-bold border-2 transition-transform transform hover:scale-110 duration-150 ease-in-out ${
                                    chosenCard === num
                                        ? 'bg-blue-600 text-white border-blue-300'
                                        : 'bg-gray-300 dark:bg-neutral-700 text-black dark:text-white border-gray-400 dark:border-gray-500'
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Reset round button */}
            <button
                onClick={resetRound}
                className="mt-10 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
                Recommencer
            </button>
        </div>
    );
}

export default Game;