import React, { useState, useRef, useEffect } from 'react';
import './Game.css';
import { getCardImage } from './Cards';
import makeDecision from './AI';
import checkWin from './Win';

const Game = () => {

    const [sliderValue, setSliderValue] = useState(100);
    const [logValue, setLogValue] = useState('');
    const [currentPot, setCurrentPot] = useState(0);
    const prevlogValueRef = useRef('');
    const [userBal, setUserBal] = useState(10000);
    const [AIBal, setAIBal] = useState(10000);
    const [userPot, setUserPot] = useState(0);
    const [AIPot, setAIPot] = useState(0);
    const [userHand, setUserHand] = useState([]);
    const [AIHand, setAIHand] = useState([]);
    const [board, setBoard] = useState([]);
    const [showAICards, setShowAICards] = useState(true);
    const [showFlop, setShowFlop] = useState(false);
    const [showTurn, setShowTurn] = useState(false);
    const [showRiver, setShowRiver] = useState(false);
    const [phase, setPhase] = useState(1);
    const [turn, setTurn] = useState(0);

    const createDeck = () => {
        const suits = ['c', 'd', 'h', 's'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
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
        const newValue = Math.round(event.target.value / 50) * 50;
        setSliderValue(newValue);
    };

    const handleCheckButtonClick = () => {
        setLogValue((prevLogValue) => prevLogValue + '\nYou checked');
        if (turn == 0) {
            if (phase == 1) {
                setShowFlop(true);
                setPhase(2);
            }
            if (phase == 2) {
                setShowTurn(true);
                setPhase(3);
            }
            if (phase == 3) {
                setShowRiver(true);
                setPhase(4);
            }
            if (phase == 4) {
                const winner = checkWin(board, AIHand, userHand);
                if (winner.includes("AI")) {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
                else if (winner.includes("You")) {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
                else {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
            }
        }
        else {
            if (phase === 1) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, 0, currentPot, board, true);
                setLogValue((prevLogValue) => prevLogValue + `\nAI decided ${aiDecision}`);
                if (aiDecision === 'check') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI checks back');
                    setShowFlop(true);
                    setPhase(2);
                }
                else if (aiDecision.includes('bet')) {
                    const betAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI raises to ${betAmount}`);
                    setCurrentPot((currentPot) => currentPot + betAmount);
                    setAIBal((AIBal) => AIBal - betAmount);
                    setAIPot((AIPot) => AIPot + betAmount);
                }
            }
            else if (phase === 2) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, 0, currentPot, board, true);
                setLogValue((prevLogValue) => prevLogValue + `\nAI decided ${aiDecision}`);
                if (aiDecision === 'check') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI checks back');
                    setShowTurn(true);
                    setPhase(3);
                }
                else if (aiDecision.includes('bet')) {
                    const betAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI bets ${betAmount}`);
                    setCurrentPot((currentPot) => currentPot + betAmount);
                    setAIBal((AIBal) => AIBal - betAmount);
                    setAIPot((AIPot) => AIPot + betAmount);
                }
            }
            else if (phase === 3) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, 0, currentPot, board, true);
                setLogValue((prevLogValue) => prevLogValue + `\nAI decided ${aiDecision}`);
                if (aiDecision === 'check') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI checks back');
                    setShowRiver(true);
                    setPhase(4);
                }
                else if (aiDecision.includes('bet')) {
                    const betAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI bets ${betAmount}`);
                    setCurrentPot((currentPot) => currentPot + betAmount);
                    setAIBal((AIBal) => AIBal - betAmount);
                    setAIPot((AIPot) => AIPot + betAmount);
                }
            }
            else if (phase === 4) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, 0, currentPot, board, true);
                setLogValue((prevLogValue) => prevLogValue + `\nAI decided ${aiDecision}`);
                if (aiDecision === 'check') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI checks back');
                    const winner = checkWin(board, AIHand, userHand);
                    if (winner.includes("AI")) {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                    else if (winner.includes("You")) {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                    else {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                }
                else if (aiDecision.includes('bet')) {
                    const betAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI bets ${betAmount}`);
                    setCurrentPot((currentPot) => currentPot + betAmount);
                    setAIBal((AIBal) => AIBal - betAmount);
                    setAIPot((AIPot) => AIPot + betAmount);
                }
            }
        }
    };

    const handleBetButtonClick = () => {

        // user matches AI bet
        if (sliderValue + userPot == AIPot) {
            setLogValue((prevLogValue) => prevLogValue + `\nYou called ${sliderValue}`);
            setCurrentPot((currentPot) => currentPot + sliderValue);
            setUserBal((userBal) => userBal - sliderValue);
            setUserPot((userPot) => userPot + sliderValue);
            if (phase == 1) {
                setShowFlop(true);
                setPhase(2);
            }
            else if (phase == 2) {
                setShowTurn(true);
                setPhase(3);
            }
            else if (phase == 3) {
                setShowRiver(true);
                setPhase(4);
            }
            else {
                const winner = checkWin(board, AIHand, userHand);
                if (winner.includes("AI")) {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
                else if (winner.includes("You")) {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
                else {
                    setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                }
            }
        }

        // user raise / re-raise, AI re-raising doesn't work right now
        else {
            setLogValue((prevLogValue) => prevLogValue + `\nYou bet ${sliderValue}`);
            setCurrentPot((currentPot) => currentPot + sliderValue);
            setUserBal((userBal) => userBal - sliderValue);
            setUserPot((userPot) => userPot + sliderValue);
            if (phase == 1) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, sliderValue + userPot - AIPot, currentPot, board, false);
                if (aiDecision === 'fold') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI folds. You win!');
                }
                else if (aiDecision.includes('call')) {
                    const callAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI calls ${callAmount}`);
                    setCurrentPot((currentPot) => currentPot + callAmount);
                    setAIBal((AIBal) => AIBal - callAmount);
                    setAIPot((AIPot) => AIPot + callAmount);
                    setShowFlop(true);
                    setPhase(2);
                }
                else if (aiDecision.includes('raise')) {
                    const raiseAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI raises ${raiseAmount}`);
                    setCurrentPot((currentPot) => currentPot + raiseAmount);
                    setAIBal((AIBal) => AIBal - raiseAmount);
                    setAIPot((AIPot) => AIPot + raiseAmount);
                }
            }
            else if (phase == 2) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, sliderValue + userPot - AIPot, currentPot, board, false);
                if (aiDecision === 'fold') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI folds. You win!');
                }
                else if (aiDecision.includes('call')) {
                    const callAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI calls ${callAmount}`);
                    setCurrentPot((currentPot) => currentPot + callAmount);
                    setAIBal((AIBal) => AIBal - callAmount);
                    setAIPot((AIPot) => AIPot + callAmount);
                    setShowTurn(true);
                    setPhase(3);
                }
                else if (aiDecision.includes('raise')) {
                    const raiseAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI raises ${raiseAmount}`);
                    setCurrentPot((currentPot) => currentPot + raiseAmount);
                    setAIBal((AIBal) => AIBal - raiseAmount);
                    setAIPot((AIPot) => AIPot + raiseAmount);
                }
            }
            else if (phase == 3) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, sliderValue + userPot - AIPot, currentPot, board, false);
                if (aiDecision === 'fold') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI folds. You win!');
                }
                else if (aiDecision.includes('call')) {
                    const callAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI calls ${callAmount}`);
                    setCurrentPot((currentPot) => currentPot + callAmount);
                    setAIBal((AIBal) => AIBal - callAmount);
                    setAIPot((AIPot) => AIPot + callAmount);
                    setShowRiver(true);
                    setPhase(4);
                }
                else if (aiDecision.includes('raise')) {
                    const raiseAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI raises ${raiseAmount}`);
                    setCurrentPot((currentPot) => currentPot + raiseAmount);
                    setAIBal((AIBal) => AIBal - raiseAmount);
                    setAIPot((AIPot) => AIPot + raiseAmount);
                }
            }
            else if (phase == 4) {
                const aiDecision = makeDecision(userBal, AIBal, AIHand, sliderValue + userPot - AIPot, currentPot, board, false);
                if (aiDecision === 'fold') {
                    setLogValue((prevLogValue) => prevLogValue + '\nAI folds. You win!');
                }
                else if (aiDecision.includes('call')) {
                    const callAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI calls ${callAmount}`);
                    setCurrentPot((currentPot) => currentPot + callAmount);
                    setAIBal((AIBal) => AIBal - callAmount);
                    setAIPot((AIPot) => AIPot + callAmount);
                    const winner = checkWin(board, AIHand, userHand);
                    if (winner.includes("AI")) {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                    else if (winner.includes("You")) {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                    else {
                        setLogValue((prevLogValue) => prevLogValue + '\n' + winner);
                    }
                }
                else if (aiDecision.includes('raise')) {
                    const raiseAmount = parseInt(aiDecision.split(' ')[1]);
                    setLogValue((prevLogValue) => prevLogValue + `\nAI raises ${raiseAmount}`);
                    setCurrentPot((currentPot) => currentPot + raiseAmount);
                    setAIBal((AIBal) => AIBal - raiseAmount);
                    setAIPot((AIPot) => AIPot + raiseAmount);
                }
            }
        }
    };

    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }, [logValue]);

    useEffect(() => {
        prevlogValueRef.current = logValue;
    }, [logValue]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        dealCards();
        setCurrentPot(150);
        setLogValue((prevLogValue) => prevLogValue + 'AI bet 100\nYou bet 50');
        setAIBal((AIBal) => AIBal - 100);
        setUserBal((userBal) => userBal - 50);
        setAIPot(100);
        setUserPot(50);
        setTurn(1);
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
                <textarea ref={textareaRef} className="text-area" value={logValue} readOnly></textarea>
            </div>
            <div className="middle-right">
                <div className="current-pot">
                    Current pot: {currentPot}
                </div>
            </div>
            <div className="top-middle">
                {showAICards ? (
                    <>
                        <CardImage cardName={AIHand[0]} />
                        <CardImage cardName={AIHand[1]} />
                    </>
                ) : (
                    <>
                        <CardImage cardName="back" />
                        <CardImage cardName="back" />
                    </>
                )}
            </div>
            <div className="middle-middle">
                {board.slice(0, 3).map((card, index) => (
                    <CardImage key={index} cardName={showFlop ? card : 'back'} />
                ))}
                {board.length >= 4 && (
                    <CardImage key={3} cardName={showTurn ? board[3] : 'back'} />
                )}
                {board.length === 5 && (
                    <CardImage key={4} cardName={showRiver ? board[4] : 'back'} />
                )}
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
                        min="50"
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
