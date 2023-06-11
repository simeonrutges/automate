import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {Link} from "react-router-dom";
import './myMessages.css';

// function MyMessages() {
//     const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);
//
//     const [messages, setMessages] = useState([]);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const username = isAuth && user.username ? user.username : '';
//                 const response = await axios.get(`http://localhost:8080/notifications/user/${username}`);
//                 setMessages(response.data);
//             } catch (e) {
//                 setError(e.message);
//             }
//         };
//
//         fetchMessages();
//         const interval = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
//
//         return () => clearInterval(interval); // Clean up the interval on unmount
//     }, []);
//
//     return (
//         <div className="outer-content-container">
//             <div className="inner-content-container">
//                 <div>
//                     <h1>Berichten</h1>
//                     {error ? (
//                         <p>Er is een fout opgetreden bij het ophalen van berichten: {error}</p>
//                     ) : (
//                         messages.length === 0 ? (
//                             <p>Je hebt nog geen berichten ontvangen</p>
//                         ) : (
//                             <ul>
//                                 {messages.map((message) => {
//                                     const sentDate = new Date(message.sentDate);
//                                     const formattedDate = `${sentDate.getDate().toString().padStart(2, '0')}-${(
//                                         sentDate.getMonth() + 1
//                                     )
//                                         .toString()
//                                         .padStart(2, '0')}-${sentDate.getFullYear().toString().slice(-2)}`;
//                                     const formattedTime = `${sentDate.getHours().toString().padStart(2, '0')}:${sentDate
//                                         .getMinutes()
//                                         .toString()
//                                         .padStart(2, '0')}`;
//
//                                     return (
//                                         <li key={message.id}>
//                                             <Link
//                                                 to={
//                                                     !message.read && message.sender.username === 'System'
//                                                         ? `/my-rides/${message.rideId}`
//                                                         : `/my-messages/${message.sender.username}`
//                                                 }
//                                             >
//                                                 {message.type} van {message.sender.username} {formattedDate} {formattedTime}
//                                             </Link>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         )
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default MyMessages;

// 10/6! hierboven

function MyMessages() {
    const { isAuth, user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const username = isAuth && user.username ? user.username : '';
                const response = await axios.get(`http://localhost:8080/notifications/user/${username}`);
                setMessages(response.data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, [isAuth, user]);

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <div>
                    <h1>Berichten</h1>
                    {error ? (
                        <p>Er is een fout opgetreden bij het ophalen van berichten: {error}</p>
                    ) : (
                        messages.length === 0 ? (
                            <p>Je hebt nog geen berichten ontvangen</p>
                        ) : (
                            <ul>
                                {messages.map((message) => {
                                    const sentDate = new Date(message.sentDate);
                                    const formattedDate = `${sentDate.getDate().toString().padStart(2, '0')}-${(sentDate.getMonth()+1).toString().padStart(2, '0')}-${sentDate.getFullYear()}`;
                                    const formattedTime = `${sentDate.getHours().toString().padStart(2, '0')}:${sentDate.getMinutes().toString().padStart(2, '0')}`;

                                    return (
                                        <li key={message.id}>
                                            <Link
                                                to={
                                                    message.sender.username === 'System'
                                                        ? `/my-notifications/${message.id}`
                                                        : `/my-messages/${message.sender.username}`
                                                }
                                            >
                                                {message.type} van {message.sender.username} {formattedDate} om {formattedTime}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyMessages;





