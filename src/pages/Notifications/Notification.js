import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notification(props) {
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNotification() {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${props.match.params.id}`);
                setNotification(response.data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchNotification();
    }, [props.match.params.id]);

    if (error) {
        return <div>Fout: {error}</div>;
    }

    if (notification === null) {
        return <div>Laden...</div>;
    }

    return (
        <div>
            <h1>Notificatie details</h1>
            <p>Type: {notification.type}</p>
            <p>Details: {notification.rideDetails}</p>
            <p>Datum: {notification.sentDate}</p>
        </div>
    );
}

export default Notification;
