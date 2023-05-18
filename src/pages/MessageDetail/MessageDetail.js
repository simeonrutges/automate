//
// import React, { useContext, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import './messageDetail.css';
//
// function MessageForm() {
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState(false);
//
//     const { username } = useParams();
//
//     const { user } = useContext(AuthContext);
//     const loggedInUsername = user ? user.username : '';
//
//     const toggleError = (value) => {
//         setError(value);
//     };
//
//     async function handleSubmit(e) {
//         e.preventDefault();
//         toggleError(false);
//
//         const messageData = {
//             receiverUsername: username,
//             senderUsername: loggedInUsername,
//             text: message,
//         };
//
//         try {
//             const response = await axios.post('/messages', messageData);
//
//             console.log('Bericht succesvol verzonden:', response.data);
//         } catch (error) {
//             console.error('Error:', error);
//             toggleError(true);
//         }
//     }
//
//     return (
//         <div className="container">
//             <h3>{username}</h3>
//             {/*<div className="form-group">*/}
//             {/*    <label className="label" htmlFor="username">Ontvanger:</label>*/}
//             {/*    <input*/}
//             {/*        className="input"*/}
//             {/*        type="text"*/}
//             {/*        id="username"*/}
//             {/*        value={username}*/}
//             {/*        disabled*/}
//             {/*    />*/}
//             {/*</div>*/}
//             <div className="message-container">
//                 <div className="message-item">
//                     <div className="sender-name">{loggedInUsername}</div>
//                     <div className="sender-message">Dit is een bericht van de ingelogde gebruiker.</div>
//                 </div>
//                 <div className="message-item">
//                     <div className="sender-name">{username}</div>
//                     <div className="receiver-message">Dit is een antwoord van de ontvanger.</div>
//                 </div>
//                 <div className="message-item">
//                     <div className="sender-message">Nog een bericht van de ingelogde gebruiker.</div>
//                 </div>
//                 <div className="message-item">
//                     <div className="receiver-message">Nog een antwoord van de ontvanger.</div>
//                 </div>
//                 {/* Add more message items as needed */}
//             </div>
//             <div className="form-group">
//                 <label className="label" htmlFor="message">Bericht:</label>
//                 <textarea
//                     className="textarea"
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                 />
//             </div>
//             <button className="button" type="submit">Verstuur</button>
//             {error && <p className="error">Er is een fout opget
//                 reden bij het verzenden van het bericht.</p>}
//         </div>
//     );
//
// }
//
// export default MessageForm;




import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import './messageDetail.css';

function MessageDetails() {
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
            const response = await axios.get(`http://localhost:8080/messages/${loggedInUsername}/${username}`);
            const messages = response.data;
            console.log(messages);
            console.log("messages id: " );
            setMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);

        }
    }

    // async function fetchMessages() {
    //     try {
    //
    //         const response = await axios.get(`http://localhost:8080/messages/${messages.id}`);
    //         const messages = response.data;
    //         setMessages(messages);
    //     } catch (error) {
    //         console.error('Error fetching messages:', error);
    //         console.log("messages id: " + messages.id);
    //     }
    // }





    useEffect(() => {
        // Haal bij het mounten van de component de bestaande berichten op
        fetchMessages();

        // Stel een interval in om periodiek de berichten op te halen
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
                },
            });

            console.log('Bericht succesvol verzonden:', response.data);
            setMessage(''); // Wis het ingevoerde bericht na verzending
        } catch (error) {
            console.error('Error:', error);
            toggleError(true);
        }
    }


    return (
        <messagedetail className="outer-content-container">
            <div className="inner-content-container">



            <div className="container">

                <h3>{username}</h3>

                <div className="message-container">
                    <p>messages:...</p>
                    {/*{messages.map((msg) => (*/}
                    {/*    <div className="message-item" key={msg.id}>*/}
                    {/*        <div className="sender-name">{msg.sender}</div>*/}
                    {/*        <div className="message-text">{msg.content}</div>*/}
                    {/*    </div>*/}
                    {/*))}*/}

                    {messages.map((msg) => (
                        <div
                            className={`message-item ${msg.senderUsername === loggedInUsername ? 'sender-message' : 'receiver-message'}`}
                            key={msg.id}
                        >
                            <div className="sender-name">{msg.senderUsername}</div>
                            <div className="message-text">{msg.content}</div>
                        </div>
                    ))}



                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="message">Bericht:</label>
                        <textarea
                            className="textarea"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <button className="button" type="submit">Verstuur</button>
                    {error && <p className="error">Er is een fout opgetreden bij het verzenden van het bericht.</p>}
                </form>

            </div>




            </div>
</messagedetail>
)
    ;
}

export default MessageDetails;





