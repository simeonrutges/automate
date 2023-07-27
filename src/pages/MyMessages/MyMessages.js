import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {Link} from "react-router-dom";


function MyMessages() {
    const token = localStorage.getItem('token');

    const {isAuth, user} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const username = isAuth && user.username ? user.username : '';
                const response = await axios.get(`http://localhost:8080/notifications/user/${username}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                setMessages(response.data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Fetch messages elke 5 seconds

        return () => clearInterval(interval);
    }, [isAuth, user]);

    return (

        <div className="outer-content-container">
            <main className="inner-content-container">
                <header>
                    <h1>Berichten</h1>
                </header>
                {error ? (
                    <section>
                        <p>Er is een fout opgetreden bij het ophalen van berichten: {error}</p>
                    </section>
                ) : (
                    messages.length === 0 ? (
                        <section>
                            <p>Je hebt nog geen berichten ontvangen</p>
                        </section>
                    ) : (
                        <section>
                            <ul>
                                {messages.map((message) => {
                                    const sentDate = new Date(message.sentDate);
                                    const formattedDate = `${sentDate.getDate().toString().padStart(2, '0')}-${(sentDate.getMonth() + 1).toString().padStart(2, '0')}-${sentDate.getFullYear()}`;
                                    const formattedTime = `${sentDate.getHours().toString().padStart(2, '0')}:${sentDate.getMinutes().toString().padStart(2, '0')}`;

                                    return (
                                        <li key={message.id}>
                                            <article>
                                                <Link
                                                    to={
                                                        message.sender.username === 'System'
                                                            ? `/my-notifications/${message.id}`
                                                            : `/my-messages/${message.sender.username}`
                                                    }
                                                >
                                                    {message.type} van {message.sender.username} {formattedDate} om {formattedTime}
                                                </Link>
                                            </article>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )
                )}
            </main>
        </div>
    );
}

export default MyMessages;





