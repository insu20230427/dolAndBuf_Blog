import React from 'react';
import './Card.css';

const Card = ({ card, flipped, handleFlip }) => {
    const handleClick = () => {
        if (!flipped) {
            handleFlip(card.id);
        }
    };

    return (
        <div className={`card ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
            <div className="inner">
                <div className="front">
                    <img src={card.src} alt="card front" />
                </div>
                <div className="back"></div>
            </div>
        </div>
    );
};

export default Card;
