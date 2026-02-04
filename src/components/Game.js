import React, { useState, useRef, useEffect } from 'react';
import './Game.css';
import { getCardImage } from './Cards';
import makeDecision from './AI';
import checkWin from './Win';

const Game = () => {
    const [sliderValue, setSliderValue] = useState(100);
    const [logValue, setLogValue] = useState('');
    const [currentPot, setCurrentPot] = useState(0);
    const [userBal, setUserBal] = useState(10000);
    const [AIBal, setAIBal] = useState(10000);
    const [userPot, setUserPot] = useState(0);
    const [AIPot, setAIPot] = useState(0);
    const [userHand, setUserHand] = useState([]);
    const [AIHand, setAIHand] = useState([]);
    const [board, setBoard] = useState([]);
    const [showAICards, setShowAICards] = useState(false);
    const [showFlop, setShowFlop] = useState(false);
    const [showTurn, setShowTurn] = useState(false);
    const [showRiver, setShowRiver] = useState(false);
    const [phase, setPhase] = useState(1); // 1=preflop, 2=flop, 3=turn, 4=river
    const [isUserTurn, setIsUserTurn] = useState(true);
    const [actionPending, setActionPending] = useState(false);
    const [gameOver, setGameOver] = useState(false);

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
        const newValue = Math.max(50, Math.min(Math.round(event.target.value / 50) * 50, userBal));
        setSliderValue(newValue);
    };

    const addLog = (message) => {
        setLogValue((prevLogValue) => prevLogValue + '\n' + message);
    };

    const endHand = (winner) => {
        setShowAICards(true);
        setGameOver(true);
        addLog(winner);
        
        if (winner.includes('AI wins')) {
            setAIBal((prev) => prev + currentPot);
        } else if (winner.includes('You won')) {
            setUserBal((prev) => prev + currentPot);
        } else {
            // Split pot
            setAIBal((prev) => prev + Math.floor(currentPot / 2));
            setUserBal((prev) => prev + Math.floor(currentPot / 2));
        }
        
        setTimeout(() => {
            startNewRound();
        }, 3000);
    };

    const startNewRound = () => {
        dealCards();
        setShowFlop(false);
        setShowTurn(false);
        setShowRiver(false);
        setShowAICards(false);
        setPhase(1);
        setGameOver(false);
        setActionPending(false);
        setCurrentPot(150);
        setUserPot(0);
        setAIPot(0);
        
        // Determine who starts (alternate)
        const userStarts = Math.random() < 0.5;
        setIsUserTurn(userStarts);
        
        if (userStarts) {
            setUserBal((prev) => prev - 100);
            setAIBal((prev) => prev - 50);
            setUserPot(100);
            setAIPot(50);
            addLog('~ New Round ~\nYou bet 100 (Big Blind)\nAI bet 50 (Small Blind)');
        } else {
            setAIBal((prev) => prev - 100);
            setUserBal((prev) => prev - 50);
            setAIPot(100);
            setUserPot(50);
            addLog('~ New Round ~\nAI bet 100 (Big Blind)\nYou bet 50 (Small Blind)');
            // AI acts first
            setTimeout(() => {
                handleAIAction();
            }, 500);
        }
    };

    const getVisibleBoard = () => {
        const visibleBoard = [];
        if (showFlop) {
            visibleBoard.push(...board.slice(0, 3));
        }
        if (showTurn) {
            visibleBoard.push(board[3]);
        }
        if (showRiver) {
            visibleBoard.push(board[4]);
        }
        return visibleBoard;
    };

    const proceedToNextPhase = () => {
        if (phase === 1) {
            setShowFlop(true);
            setPhase(2);
            addLog('--- Flop ---');
        } else if (phase === 2) {
            setShowTurn(true);
            setPhase(3);
            addLog('--- Turn ---');
        } else if (phase === 3) {
            setShowRiver(true);
            setPhase(4);
            addLog('--- River ---');
        } else if (phase === 4) {
            // Showdown
            const visibleBoard = board;
            const winner = checkWin(visibleBoard, AIHand, userHand);
            endHand(winner);
            return;
        }
        
        // Reset pots for new betting round
        setUserPot(0);
        setAIPot(0);
        
        // Toggle turn and check if AI should act
        setIsUserTurn((currentTurn) => {
            const newTurn = !currentTurn;
            // If it's AI's turn, let them act
            if (!newTurn) {
                setTimeout(() => {
                    handleAIAction();
                }, 500);
            }
            return newTurn;
        });
    };

    const handleAIAction = () => {
        // Check if we should skip
        if (gameOver) {
            setActionPending(false);
            return;
        }
        
        // Safety check: ensure AI has valid cards before making decision
        if (!AIHand || !Array.isArray(AIHand) || AIHand.length < 2 || !AIHand[0] || !AIHand[1]) {
            console.warn('AI hand not ready, skipping action');
            setActionPending(false);
            setIsUserTurn(true);
            return;
        }
        
        setActionPending(true);
        const visibleBoard = getVisibleBoard();
        
        setTimeout(() => {
            // Get current state values
            setUserPot((currentUserPot) => {
                setAIPot((currentAIPot) => {
                    setCurrentPot((currentPot) => {
                        setAIBal((currentAIBal) => {
                            const betToCall = Math.max(0, currentUserPot - currentAIPot);
                            const turnType = betToCall === 0 ? 'check' : 'bet';
                            
                            const aiDecision = makeDecision(userBal, currentAIBal, AIHand, betToCall, currentPot, visibleBoard || [], turnType);
                            
                            if (aiDecision === 'fold') {
                                addLog('AI folds. You win!');
                                setUserBal((prev) => prev + currentPot);
                                setActionPending(false);
                                setTimeout(() => {
                                    startNewRound();
                                }, 2000);
                            } else if (aiDecision === 'check') {
                                addLog('AI checks');
                                setActionPending(false);
                                // Check if betting round is complete after state updates
                                setTimeout(() => {
                                    setUserPot((prevUserPot) => {
                                        setAIPot((prevAIPot) => {
                                            if (prevUserPot === prevAIPot) {
                                                // Both checked, proceed to next phase
                                                proceedToNextPhase();
                                            } else {
                                                setIsUserTurn(true);
                                            }
                                            return prevAIPot;
                                        });
                                        return prevUserPot;
                                    });
                                }, 100);
                            } else if (aiDecision.startsWith('call')) {
                                const callAmount = parseInt(aiDecision.split(' ')[1]) || betToCall;
                                const actualCall = Math.min(callAmount, currentAIBal);
                                addLog(`AI calls ${actualCall}`);
                                setCurrentPot((prev) => prev + actualCall);
                                setAIBal((prev) => prev - actualCall);
                                setAIPot((prev) => prev + actualCall);
                                setActionPending(false);
                                // Check if betting round is complete after state updates
                                setTimeout(() => {
                                    setUserPot((prevUserPot) => {
                                        setAIPot((prevAIPot) => {
                                            if (prevUserPot === prevAIPot) {
                                                // Betting round complete
                                                proceedToNextPhase();
                                            } else {
                                                setIsUserTurn(true);
                                            }
                                            return prevAIPot;
                                        });
                                        return prevUserPot;
                                    });
                                }, 100);
                            } else if (aiDecision.startsWith('bet')) {
                                const betAmount = parseInt(aiDecision.split(' ')[1]);
                                const actualBet = Math.min(betAmount, currentAIBal);
                                addLog(`AI bets ${actualBet}`);
                                setCurrentPot((prev) => prev + actualBet);
                                setAIBal((prev) => prev - actualBet);
                                setAIPot((prev) => prev + actualBet);
                                setActionPending(false);
                                setIsUserTurn(true);
                            } else if (aiDecision.startsWith('raise')) {
                                const raiseAmount = parseInt(aiDecision.split(' ')[1]);
                                const totalToCall = betToCall + raiseAmount;
                                const actualRaise = Math.min(totalToCall, currentAIBal);
                                addLog(`AI raises to ${currentAIPot + actualRaise}`);
                                setCurrentPot((prev) => prev + actualRaise);
                                setAIBal((prev) => prev - actualRaise);
                                setAIPot((prev) => prev + actualRaise);
                                setActionPending(false);
                                setIsUserTurn(true);
                            } else {
                                // Unknown decision - default to check
                                console.warn('Unknown AI decision:', aiDecision);
                                addLog('AI checks');
                                setActionPending(false);
                                setIsUserTurn(true);
                            }
                            
                            return currentAIBal;
                        });
                        return currentPot;
                    });
                    return currentAIPot;
                });
                return currentUserPot;
            });
        }, 800);
    };

    const handleCheck = () => {
        if (gameOver || actionPending || !isUserTurn) return;
        
        const betToCall = Math.max(0, AIPot - userPot);
        
        if (betToCall > 0) {
            addLog('Cannot check - you must call or fold');
            return;
        }
        
        addLog('You check');
        setIsUserTurn(false);
        setActionPending(true);
        
        setTimeout(() => {
            setUserPot((prevUserPot) => {
                setAIPot((prevAIPot) => {
                    if (prevUserPot === prevAIPot) {
                        // Both checked, proceed to next phase
                        setActionPending(false);
                        proceedToNextPhase();
                    } else {
                        // AI needs to act
                        setActionPending(false);
                        handleAIAction();
                    }
                    return prevAIPot;
                });
                return prevUserPot;
            });
        }, 100);
    };

    const handleBet = () => {
        if (gameOver || actionPending || !isUserTurn) return;
        
        const betToCall = Math.max(0, AIPot - userPot);
        const totalBet = betToCall > 0 ? sliderValue : sliderValue; // sliderValue is total bet amount
        
        if (betToCall > 0 && sliderValue < betToCall) {
            addLog(`You must bet at least ${betToCall} to call`);
            return;
        }
        
        if (totalBet < 50) {
            addLog('Minimum bet is 50');
            return;
        }
        
        if (totalBet > userBal) {
            addLog('Insufficient funds');
            return;
        }
        
        const actualBet = Math.min(totalBet, userBal);
        const isCall = betToCall > 0 && actualBet === betToCall;
        const isRaise = betToCall > 0 && actualBet > betToCall;
        
        if (isCall) {
            addLog(`You call ${actualBet}`);
        } else if (isRaise) {
            addLog(`You raise to ${userPot + actualBet}`);
        } else {
            addLog(`You bet ${actualBet}`);
        }
        
        setCurrentPot((prev) => prev + actualBet);
        setUserBal((prev) => prev - actualBet);
        setUserPot((prev) => prev + actualBet);
        setIsUserTurn(false);
        setActionPending(true);
        
        setTimeout(() => {
            setUserPot((prevUserPot) => {
                setAIPot((prevAIPot) => {
                    if (isCall && prevUserPot === prevAIPot) {
                        // Both players have matched bets, proceed to next phase
                        setActionPending(false);
                        proceedToNextPhase();
                    } else {
                        // AI needs to respond
                        setActionPending(false);
                        handleAIAction();
                    }
                    return prevAIPot;
                });
                return prevUserPot;
            });
        }, 100);
    };

    const handleFold = () => {
        if (gameOver || actionPending || !isUserTurn) return;
        
        addLog('You fold. AI wins!');
        setShowAICards(true);
        setAIBal((prev) => prev + currentPot);
        setGameOver(true);
        setActionPending(false);
        
        setTimeout(() => {
            startNewRound();
        }, 2000);
    };

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [logValue]);

    useEffect(() => {
        startNewRound();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const CardImage = ({ cardName }) => {
        const imagePath = getCardImage(cardName);
        return imagePath ? (
            <img src={imagePath} alt={`Card ${cardName}`} className="card-image" />
        ) : null;
    };

    const getBetButtonText = () => {
        const betToCall = Math.max(0, AIPot - userPot);
        if (betToCall === 0) {
            return `Bet ${sliderValue}`;
        } else if (sliderValue === betToCall) {
            return `Call ${betToCall}`;
        } else {
            return `Raise to ${userPot + sliderValue}`;
        }
    };

    const betToCall = Math.max(0, AIPot - userPot);
    const maxBet = userBal;
    
    // Update slider value when betToCall changes to ensure it's at least the call amount
    useEffect(() => {
        if (betToCall > 0 && sliderValue < betToCall) {
            setSliderValue(Math.max(50, betToCall));
        }
    }, [betToCall, sliderValue]);

    return (
        <div className="game-container">
            <div className="top-left player-info ai-info">
                <div className="player-name">Brian's AI</div>
                <div className="player-balance">${AIBal.toLocaleString()}</div>
                <div className="player-pot">Bet: ${AIPot}</div>
            </div>
            
            <div className="top-right">
                <div className="game-log-container">
                    <div className="game-log-header">Game Log</div>
                    <textarea 
                        ref={textareaRef} 
                        className="game-log" 
                        value={logValue} 
                        readOnly
                    />
                </div>
            </div>
            
            <div className="middle-right pot-info">
                <div className="pot-label">Pot</div>
                <div className="pot-amount">${currentPot.toLocaleString()}</div>
            </div>
            
            <div className="top-middle ai-cards">
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
            
            <div className="middle-middle board-cards">
                {board.slice(0, 3).map((card, index) => (
                    <CardImage key={`flop-${index}`} cardName={showFlop ? card : 'back'} />
                ))}
                {board.length >= 4 && (
                    <CardImage key="turn" cardName={showTurn ? board[3] : 'back'} />
                )}
                {board.length === 5 && (
                    <CardImage key="river" cardName={showRiver ? board[4] : 'back'} />
                )}
            </div>
            
            <div className="left-middle dealer-button">
                <div className="dealer-chip">D</div>
            </div>
            
            <div className="bottom-middle user-cards">
                <CardImage cardName={userHand[0]} />
                <CardImage cardName={userHand[1]} />
            </div>
            
            <div className="bottom-left player-info user-info">
                <div className="player-name">You</div>
                <div className="player-balance">${userBal.toLocaleString()}</div>
                <div className="player-pot">Bet: ${userPot}</div>
            </div>
            
            <div className="bottom-right controls">
                {!gameOver && isUserTurn && !actionPending && (
                    <>
                        <div className="bet-controls">
                            <input
                                type="range"
                                min="50"
                                max={maxBet}
                                step="50"
                                value={Math.max(50, Math.min(sliderValue, maxBet))}
                                className="bet-slider"
                                onChange={handleSliderChange}
                                disabled={gameOver || !isUserTurn || actionPending}
                            />
                            <div className="bet-display">
                                ${Math.max(50, Math.min(sliderValue, maxBet)).toLocaleString()}
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button 
                                className="action-button fold-button" 
                                onClick={handleFold}
                                disabled={gameOver || !isUserTurn || actionPending}
                            >
                                Fold
                            </button>
                            <button 
                                className="action-button check-button" 
                                onClick={handleCheck}
                                disabled={gameOver || !isUserTurn || actionPending || (AIPot - userPot > 0)}
                            >
                                {AIPot - userPot > 0 ? 'Call' : 'Check'}
                            </button>
                            <button 
                                className="action-button bet-button" 
                                onClick={handleBet}
                                disabled={gameOver || !isUserTurn || actionPending}
                            >
                                {getBetButtonText()}
                            </button>
                        </div>
                    </>
                )}
                {(!isUserTurn || actionPending) && !gameOver && (
                    <div className="waiting-message">Waiting for AI...</div>
                )}
                {gameOver && (
                    <div className="game-over-message">Hand complete. Starting new round...</div>
                )}
            </div>
        </div>
    );
};

export default Game;
