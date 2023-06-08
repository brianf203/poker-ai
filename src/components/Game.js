import React, { useState, useRef, useEffect } from 'react';
import './Game.css';
import { getCardImage } from './Cards';


const Game = () => {

    const [sliderValue, setSliderValue] = useState(100);
    const [buttonMessage, setButtonMessage] = useState('');
    const [currentPot, setCurrentPot] = useState(0);
    const prevButtonMessageRef = useRef('');
    const [userBal, setUserBal] = useState(10000);
    const [AIBal, setAIBal] = useState(10000);
    const [userHand, setUserHand] = useState([]);
    const [AIHand, setAIHand] = useState([]);
    const [board, setBoard] = useState([]);

    const createDeck = () => {
        const suits = ['c', 'd', 'h', 's'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
        const deck = [];
        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                const card = rank + suit;
                deck.push(card);
            });
        });
        return deck;
    };

    const shuffleDeck = (deck) => {
        const shuffledDeck = [...deck];
        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }
        return shuffledDeck;
    };

    const dealCards = () => {
        const shuffledDeck = shuffleDeck(createDeck());
        setUserHand(shuffledDeck.slice(0, 2));
        setAIHand(shuffledDeck.slice(2, 4));
        setBoard(shuffledDeck.slice(4, 9));
    };

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    const handleCheckButtonClick = () => {
        setButtonMessage('You checked');
    };

    const handleBetButtonClick = () => {
        setButtonMessage(`You bet ${sliderValue}`);
        setCurrentPot((currentPot) => currentPot + parseInt(sliderValue));
        setUserBal((userBal) => userBal - parseInt(sliderValue));
    };

    useEffect(() => {
        prevButtonMessageRef.current = buttonMessage;
    }, [buttonMessage]);

    useEffect(() => {
        dealCards();
      }, []);

    const CardImage = ({ cardName }) => {
        const imagePath = getCardImage(cardName);
        return imagePath ? (
            <img src={imagePath} alt={`Image ${cardName}`} style={{ width: '25%', height: 'auto' }} />
        ) : null;
    };

    return (
        <div className="game-container">
            <div className="top-left">Brian's AI: {AIBal.toLocaleString()}</div>
            <div className="top-right">
                {buttonMessage}
            </div>
            <div className="middle-right">
                <div className="current-pot">
                    Current pot: {currentPot}
                </div>
            </div>
            <div className="top-middle">
                <CardImage cardName={AIHand[0]} />
                <CardImage cardName={AIHand[1]} />
            </div>
            <div className="middle-middle">
                <CardImage cardName="10h" />
                <CardImage cardName="kd" />
                <CardImage cardName="ac" />
                <CardImage cardName="back" />
                <CardImage cardName="back" />
            </div>
            <div className="left-middle">
                <CardImage cardName="back" />
            </div>
            <div className="bottom-middle">
                <CardImage cardName={userHand[0]} />
                <CardImage cardName={userHand[1]} />
            </div>
            <div className="bottom-left">You: {userBal.toLocaleString()}</div>
            <div className="bottom-right">
                <div className="slider-container">
                    <input
                        type="text"
                        placeholder="Enter bet"
                        className="text-input"
                        value={`${sliderValue}`}
                        readOnly
                    />
                    <input
                        type="range"
                        min="100"
                        max={userBal}
                        value={sliderValue}
                        className="slider-input"
                        onChange={handleSliderChange}
                    />
                </div>
                <div className="buttons-container">
                    <button className="check-fold-button" onClick={handleCheckButtonClick}>Check </button>
                    <button className="bet-button" onClick={handleBetButtonClick}>Bet {sliderValue}</button>
                </div>
            </div>
        </div>
    );
};

export default Game;
