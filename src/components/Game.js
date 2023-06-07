import React, { useState } from 'react';
import './Game.css';
import image1 from '../pictures/2c.png';

const Game = () => {
    
    const [sliderValue, setSliderValue] = useState(50);

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    const handleCheckButtonClick = () => {
        alert(`Check / Fold`);
    };

    const handleBetButtonClick = () => {
        alert(`Bet ${sliderValue}`);
    };

    return (
        <div className="game-container">
            <div className="top-middle">
                <img src={image1} alt={image1} style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="middle-middle">
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="left-middle">
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="bottom-middle">
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
                <img src={image1} alt="Image 1" style={{ width: '25%', height: 'auto' }} />
            </div>
            <div className="bottom-right">
                <div className="input-container">
                    <div className="slider-container">
                        <input
                            type="text"
                            placeholder="Enter text"
                            className="text-input"
                            value={`${sliderValue}`}
                            readOnly
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            className="slider-input"
                            onChange={handleSliderChange}
                        />
                    </div>
                </div>
                <div className="buttons-container">
                    <button className="check-fold-button" onClick={handleCheckButtonClick}>Check / Fold</button>
                    <button className="bet-button" onClick={handleBetButtonClick}>Bet {sliderValue}</button>
                </div>
            </div>
        </div>
    );
};

export default Game;
