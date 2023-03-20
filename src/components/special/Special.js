import React from 'react';
import './special.css';
function Special({children, title}) {
    // voorbeeld voor children property. BV nodig voor buttons. zie les 6 12min.****
    return (
        <div className="special-styling">
            {title && <h1>{title}</h1>}
            {children}
        </div>
    );
}

export default Special;