import React, { useState } from 'react';
import api from '../api';

const CardChooser = ({ sessionCode }) => {
    const [selected, setSelected] = useState(null);

    const chooseCard = async () => {
        if (!selected) return;
        await api.post(`/sessions/${sessionCode}/choose`, { card_number: selected });
    };

    return (
        <div className="mt-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Choose a card (1-10)</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
                {[...Array(10)].map((_, idx) => {
                    const num = idx + 1;
                    return (
                        <button
                            key={num}
                            onClick={() => setSelected(num)}
                            className={`px-3 py-1 rounded border ${
                                selected === num ? 'bg-green-500 text-white' : 'bg-gray-200'
                            } hover:bg-green-400 transition`}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
            <button
                onClick={chooseCard}
                disabled={!selected}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Submit Choice
            </button>
        </div>
    );
};

export default CardChooser;
