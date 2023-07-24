import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import './messageDetail.css';

function MessageDetails() {
    const token = localStorage.getItem('token');

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [messages, setMessages] = useState([]);

    const {username} = useParams();
    const {user} = useContext(AuthContext);
    const loggedInUsername = user ? user.username : '';

    const toggleError = (value) => {
        setError(value);
    };

    async function fetchMessages() {
        try {
            const response = await axios.get(`http://localhost:8080/messages/${loggedInUsername}/${username}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const messages = response.data;
            setMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);

        }
    }

    useEffect(() => {
        // Haal bij het mounten van de component de bestaande berichten op
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000); // Elke 5 seconden

        // Cleanup-functie om het interval te stoppen bij het unmounten van de component
        return () => {
            clearInterval(interval);
        };
    }, []);


    async function handleSubmit(e) {
        e.preventDefault();
        toggleError(false);

        const messageData = {
            receiverUsername: username,
            senderUsername: loggedInUsername,
            content: message,
        };

        try {
            const response = await axios.post('http://localhost:8080/messages/', messageData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage('');
        } catch (error) {
            console.error('Error:', error);
            toggleError(true);
        }
    }

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">

                <div className="container">
                    <h3>{username}</h3>

                    <div className="message-container">
                        {messages.map((msg) => {
                            const messageDate = new Date(msg.timestamp);
                            const formattedDate = messageDate.toLocaleDateString();
                            const formattedTime = messageDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }); // toon alleen uren en minuten

                            return (
                                <div
                                    className={`message-item ${msg.senderUsername === loggedInUsername ? 'sender-message' : 'receiver-message'}`}
                                    key={msg.id}
                                >
                                    <div className="sender-name">{msg.senderUsername}</div>
                                    <div className="message-text">{msg.content}</div>
                                    <div className="message-timestamp">{`${formattedTime} ${formattedDate}`}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="new-content-container">
                        <div className="content">
                            <form className="chat-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="label" htmlFor="message">Bericht:</label>
                                    <textarea
                                        className="textarea"
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <button className="button" type="submit">Verzenden</button>
                                {error && <p className="error">Er is een fout opgetreden bij het verzenden van het
                                    bericht.</p>}
                            </form>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
        ;
}

export default MessageDetails;





