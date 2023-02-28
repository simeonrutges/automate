import React, { useState } from "react";


function Modal(props) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={handleShowModal}>Open Modal</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
            <span className="close" onClick={handleHideModal}>
              &times;
            </span>
                        <p>{props.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;
