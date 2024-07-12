import React, { useState, useEffect } from 'react';
import './gameBoard.css';
import Card from './Card';

const cardImages = [
    { id: 1, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrD_P4e5ZjzHqKaLj9lxhQLeKhKGk75noglg&s' },
    { id: 2, src: 'https://i.pinimg.com/236x/9a/d0/6f/9ad06f56a730fdaed0ed108b71e921d5.jpg' },
    { id: 3, src: 'https://blog.kakaocdn.net/dn/b495JA/btrtlUyu2e3/QYZs6p0KzzkOt8EMviICuK/img.png' },
    { id: 4, src: 'https://mblogthumb-phinf.pstatic.net/MjAyMjAzMDZfMjQx/MDAxNjQ2NTIyNzEwODcx.cRLNrDVes-wQybWWUWvQT8in0w7N02EORLsBuZz_TOcg.--LFFHmPxhilOX4SNsS40ybDPpqdmhsdJSeDSdvFPDsg.PNG.qmfosej/IMG_6439.PNG?type=w800' },
    { id: 5, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVXR_3DUYScT5mc4Qvyn1joM5S_KOJSJLrVA&s' },
    { id: 6, src: 'https://image.fmkorea.com/files/attach/new/20190204/486616/7011837/1575347114/620ab5cf8f238a947e99f7f17f2ec92c.jpg' },
];


const cardImages2 = [
    { id: 1, src: 'https://example.com/img/card1.png' },
    { id: 2, src: 'https://example.com/img/card2.png' },
    { id: 3, src: 'https://example.com/img/card3.png' },
    { id: 4, src: 'https://example.com/img/card4.png' },
    { id: 5, src: 'https://example.com/img/card5.png' },
    { id: 6, src: 'https://example.com/img/card6.png' },
];

function GameBoard() {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map(card => ({ ...card, id: Math.random() }));
        setCards(shuffledCards);
        setFlipped([]);
        setMatched([]);
    };

    const handleFlip = (id) => {
        if (flipped.length === 2) return;
        setFlipped([...flipped, id]);

        if (flipped.length === 1) {
            const firstCard = cards.find(card => card.id === flipped[0]);
            const secondCard = cards.find(card => card.id === id);
            if (firstCard.src === secondCard.src) {
                setMatched([...matched, firstCard.src]);
            }
            setTimeout(() => setFlipped([]), 1000);
        }
    };

    return (
        <div className="gameBoard">
            <h1>Card Flip Game</h1>
            <button onClick={initializeGame}>Start Game</button>
            <div className="card-grid">
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        flipped={flipped.includes(card.id) || matched.includes(card.src)}
                        handleFlip={handleFlip}
                    />
                ))}
            </div>
        </div>
    );
}

export default GameBoard;
