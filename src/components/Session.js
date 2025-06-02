import React, { useEffect, useState } from 'react';
import echo from '../echo';
import api from '../api';
import CardChooser from './CardChooser';

const Session = ({ sessionCode, player }) => {
    const [players, setPlayers] = useState([]);
    const [cards, setCards] = useState([]);
    const [average, setAverage] = useState(null);

    useEffect(() => {
        fetchSession();

        const channel = echo.channel(`session.${sessionCode}`);
        channel.listen('PlayerJoined', (e) => setPlayers(e.players));
        channel.listen('CardsRevealed', (e) => {
            setCards(e.cards);
            setAverage(e.average);
        });

        return () => echo.leaveChannel(`session.${sessionCode}`);
    }, [sessionCode]);

    const fetchSession = async () => {
        const res = await api.get(`/sessions/${sessionCode}`);
        setPlayers(res.data.players);
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Session: {sessionCode}</h2>
            <h3 className="text-lg mt-2 font-semibold">Players:</h3>
            <ul className="list-disc ml-5 text-gray-700">
                {players.map((p) => (
                    <li key={p.id}>{p.name}</li>
                ))}
            </ul>

            {!cards.length && <CardChooser sessionCode={sessionCode} />}

            {cards.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Cards:</h3>
                    <ul className="list-disc ml-5 text-gray-700">
                        {cards.map((c, idx) => (
                            <li key={idx}>
                                {c.player}: {c.card}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg mt-2 font-semibold">Average: {average}</h3>
                </div>
            )}
        </div>
    );
};

export default Session;
