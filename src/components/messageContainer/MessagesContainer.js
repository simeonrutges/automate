import React, { useEffect, useRef } from 'react';
import './messagesContainer.css';
function MessagesContainer({ children }) {
    const bottomRef = useRef();

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });

    return (
        <div className="message-container">
            {children}
            <div ref={bottomRef} />
        </div>
    );
}

export default MessagesContainer;
