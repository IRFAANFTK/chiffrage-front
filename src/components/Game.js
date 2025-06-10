import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import xefiLogo from '../assets/logoxefi.png';
import { FaMicrosoft, FaEnvelope } from 'react-icons/fa';

const FIB_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

function Game({ session, player }) {
    const [players, setPlayers] = useState([]);
    const [chosenCard, setChosenCard] = useState(null);
    const [average, setAverage] = useState(null);
    const [sum, setSum] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [loadingCards, setLoadingCards] = useState({});
    const [loadingReveal, setLoadingReveal] = useState(false);

    const fetchPlayers = useCallback(async () => {
        try {
            const res = await api.get(`/sessions/${session.code}`);
            setPlayers(res.data.players || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    }, [session.code]);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    useEffect(() => {
        const waitForEcho = setInterval(() => {
            if (window.Echo && window.Echo.connector) {
                clearInterval(waitForEcho);
                const channel = window.Echo.channel(`session.${session.code}`);

                channel.listen('.player.joined', fetchPlayers);
                channel.listen('.card.chosen', fetchPlayers);
                channel.listen('.session.reset', () => {
                    setChosenCard(null);
                    setRevealed(false);
                    setSum(null);
                    setAverage(null);
                    fetchPlayers();
                });

                channel.listen('.cards.revealed', () => {
                    revealCards();
                });
            }
        }, 200);

        return () => clearInterval(waitForEcho);
    }, [session.code, fetchPlayers]);

    const chooseCard = async (card) => {
        if (chosenCard !== null) return;
        setChosenCard(card);
        try {
            await api.post(`/sessions/${session.code}/choose`, {
                player_id: player.id,
                card,
            });
            await fetchPlayers();
        } catch (error) {
            alert('Erreur lors du choix de la carte');
            setChosenCard(null);
        }
    };

    const revealCards = async () => {
        const res = await api.get(`/sessions/${session.code}`);
        const freshPlayers = res.data.players || [];

        const loading = {};
        freshPlayers.forEach(p => {
            if (p.card !== null) loading[p.id] = true;
        });

        setPlayers(freshPlayers);
        setLoadingCards(loading);
        setRevealed(true);

        setTimeout(() => {
            setLoadingCards({});
            setLoadingReveal(false);
        }, 1000);
    };

    const handleRevealClick = async () => {
        setLoadingReveal(true);
        try {
            await api.post(`/sessions/${session.code}/reveal-cards`);
        } catch (error) {
            alert("Erreur lors de la révélation");
            setLoadingReveal(false);
        }
    };

    const resetRound = async () => {
        try {
            await api.post(`/sessions/${session.code}/reset`);
        } catch (error) {
            alert('Erreur lors du reset');
        }
    };

    useEffect(() => {
        if (revealed) {
            const validPlayers = players.filter(p => p.card !== null && p.card !== undefined);
            const total = validPlayers.reduce((acc, p) => acc + p.card, 0);
            const totalVoters = validPlayers.length;
            setSum(total);
            setAverage(totalVoters > 0 ? (total / totalVoters).toFixed(2) : 0);
        }
    }, [players, revealed]);

    const inviteLink = `${window.location.origin}/join/${session.code}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link copied to clipboard!');
    };

    const openTeamsLink = (link, session) => {
        const message = `Join my Planning Poker session!\n\nSession Code: ${session.code}\nClick to join: ${link}`;

        // Teams app deep link
        const appUrl = `msteams://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(message)}`;
        window.location.href = appUrl;

        // Fallback to web
        setTimeout(() => {
            const webUrl = `https://teams.microsoft.com/share?href=${encodeURIComponent(link)}&message=${encodeURIComponent(message)}`;
            window.open(webUrl, '_blank');
        }, 1500);
    };

    const openOutlookLink = (link, session) => {
        const subject = 'Join My Planning Poker Session';
        const body = `Join my Planning Poker session!\n\nSession Code: ${session.code}\nClick to join: ${link}`;

        // Native mail client
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;

        // Fallback to Outlook web
        setTimeout(() => {
            const webUrl = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(webUrl, '_blank');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center px-4 py-6 relative">
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
                        <div className="flex flex-col gap-2">
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
                            <div className="flex gap-3 mt-2 justify-center">
                                <button
                                    onClick={() => openTeamsLink(inviteLink, session)}
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                                >
                                    <FaMicrosoft /> Teams
                                </button>
                                <button
                                    onClick={() => openOutlookLink(inviteLink, session)}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                >
                                    <FaEnvelope /> Outlook
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            <div className="relative w-full max-w-4xl z-10 flex justify-center mb-[-32px]">
                <img
                    src={xefiLogo}
                    alt="XEFI Logo"
                    className="w-32 md:w-40 mb-4 bg-white p-2 rounded-md shadow"
                />
            </div>

            <div className="relative bg-gray-100 dark:bg-neutral-900 p-6 rounded-xxl border border-gray-300 dark:border-gray-700 shadow-xl w-full max-w-4xl flex flex-col items-center animate-fade-in mt-20">
                <h3 className="text-xl font-semibold mb-4">Table des Joueurs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
                    {players.map((p) => (
                        <div key={p.id} className="flex flex-col items-center">
                            <div className={`flip-card w-24 h-32 ${revealed ? 'flipped' : ''}`}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front bg-gray-400 dark:bg-neutral-700 text-black dark:text-white">❓</div>
                                    <div className="flip-card-back bg-green-500 text-white">
                                        {loadingCards[p.id] ? (
                                            <span className="animate-spin text-3xl">⏳</span>
                                        ) : p.card !== null ? (
                                            `🃏 ${p.card}`
                                        ) : (
                                            '❌'
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 font-bold text-center">{p.name}</p>
                        </div>
                    ))}
                </div>

                {!revealed && (
                    <button
                        onClick={handleRevealClick}
                        disabled={loadingReveal}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
                    >
                        {loadingReveal && <span className="animate-spin">⏳</span>}
                        {loadingReveal ? 'Révélation...' : 'Révéler les Cartes'}
                    </button>
                )}

                {revealed && (
                    <div className="mt-6 text-center animate-fade-in">
                        <p className="text-xl font-semibold text-green-500 mb-1">🧮 Somme: {sum}</p>
                        <p className="text-xl font-semibold text-cyan-500">📊 Moyenne: {average}</p>
                    </div>
                )}
            </div>

            {chosenCard !== null && !revealed && (
                <p className="mt-4 text-center text-blue-700 font-semibold">
                    Vous avez choisi: <span className="text-xl">🃏 {chosenCard}</span>
                </p>
            )}

            {!revealed && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-center mb-4">Choisissez votre carte</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {FIB_CARDS.map((num) => (
                            <button
                                key={num}
                                onClick={() => chooseCard(num)}
                                disabled={chosenCard !== null}
                                className={`w-16 h-20 rounded-lg text-2xl font-bold border-2 transition-transform transform hover:scale-110 duration-150 ease-in-out ${
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
