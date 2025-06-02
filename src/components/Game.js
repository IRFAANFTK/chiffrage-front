import React, { useEffect, useState } from 'react';
import api from '../api';

function Game({ session, player }) {
    const [players, setPlayers] = useState(session.players);
    const [chosenCard, setChosenCard] = useState(null);
    const [average, setAverage] = useState(null);

    useEffect(() => {
        const channel = window.Echo.private(`session.${session.code}`);

        channel.listen('.player.joined', (e) => {
            setPlayers((prev) => [...prev, e.player]);
        });

        channel.listen('.card.chosen', (e) => {
            setPlayers((prev) =>
                prev.map((p) => (p.id === e.player.id ? e.player : p))
            );
        });

        channel.listen('.round.reset', () => {
            setPlayers((prev) => prev.map((p) => ({ ...p, card: null })));
            setChosenCard(null);
            setAverage(null);
        });
    }, [session.code]);

    useEffect(() => {
        const allChosen = players.every((p) => p.card !== null);
        if (allChosen && players.length > 0) {
            const total = players.reduce((sum, p) => sum + p.card, 0);
            setAverage((total / players.length).toFixed(2));
        }
    }, [players]);

    const chooseCard = async (card) => {
        setChosenCard(card);
        await api.post(`/sessions/${session.code}/choose`, {
            player_id: player.id,
            card,
        });
    };

    const resetRound = async () => {
        await api.post(`/sessions/${session.code}/reset`);
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Session: {session.code}</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Players:</h3>
                <ul>
                    {players.map((p) => (
                        <li key={p.id}>{p.name} {p.card !== null && `- Card: ${p.card}`}</li>
                    ))}
                </ul>
            </div>

            {average ? (
                <div className="text-green-600 font-bold mb-4">Average: {average}</div>
            ) : (
                <div className="mb-4">
                    <h3 className="font-semibold">Choose a Card:</h3>
                    <div className="flex gap-2 flex-wrap">
                        {[...Array(10).keys()].map((i) => (
                            <button
                                key={i + 1}
                                onClick={() => chooseCard(i + 1)}
                                disabled={chosenCard !== null}
                                className={`px-3 py-1 rounded ${
                                    chosenCard === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={resetRound}
                className="bg-red-500 text-white px-3 py-1 rounded"
            >
                Start Again
            </button>
        </div>
    );
}

export default Game;
