// src/components/SessionRoom.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Session from './Session';

const SessionRoom = () => {
    const location = useLocation();
    const { sessionCode, player } = location.state;

    return (
        <Session sessionCode={sessionCode} player={player} />
    );
};

export default SessionRoom;
