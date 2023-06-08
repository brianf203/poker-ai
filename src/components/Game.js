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
                <CardImage cardName="back" />
                <CardImage cardName="back" />
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
                <CardImage cardName="as" />
                <CardImage cardName="ks" />
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
