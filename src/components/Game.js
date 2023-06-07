import React, { useState, useRef, useEffect } from 'react';
import './Game.css';
import image1 from '../pictures/2c.png';
import image2 from '../pictures/2d.png';
import image3 from '../pictures/2h.png';
import image4 from '../pictures/2s.png';


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
                <img src={image1} alt={image1} style={{ width: '25%', height: 'auto' }} />
                <img src={image3} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="middle-middle">
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image3} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image4} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image2} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="left-middle">
                <img src={image4} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="bottom-middle">
                <img src={image2} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image3} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
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
