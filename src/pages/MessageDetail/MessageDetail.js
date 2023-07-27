import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import './messageDetail.css';
import MessagesContainer from "../../components/messageContainer/MessagesContainer";

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
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000); // Elke 5 seconden

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

                <main className="container">
                    <h3>{username}</h3>

                    <MessagesContainer>
                        {messages.map((msg) => {
                            const messageDate = new Date(msg.timestamp);
                            const formattedDate = messageDate.toLocaleDateString();
                            const formattedTime = messageDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            return (
                                <article
                                    className={`message-item ${msg.senderUsername === loggedInUsername ? 'sender-message' : 'receiver-message'}`}
                                    key={msg.id}
                                >
                                    <header className="sender-name">{msg.senderUsername}</header>
                                    <p className="message-text">{msg.content}</p>
                                    <time className="message-timestamp">{`${formattedTime} ${formattedDate}`}</time>
                                </article>
                            );
                        })}
                    </MessagesContainer>

                    <section className="new-content-container">
                        <div className="chat-content">

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
                    </section>
                </main>

            </div>
        </div>
    );
}

    export default MessageDetails;





