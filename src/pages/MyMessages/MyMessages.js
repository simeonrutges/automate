import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";

function MyMessages() {
    const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMessages () {

            try {
                const username = isAuth && user.username ? user.username : '';
                console.log("username: " + username); // is wel nodig volgens mij

                // Voeg eventueel authenticatie headers toe als dat nodig is
                const response = await axios.get('http://localhost:8080/notifications');
               setMessages(response.data);
                console.log(messages);

            } catch (e) {
                setError(e.message);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div>
            <h1>Berichten</h1>
            {error ? (
                <p>Er is een fout opgetreden bij het ophalen van berichten: {error}</p>
            ) : (
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>{message.text}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyMessages;