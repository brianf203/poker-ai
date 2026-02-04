// Helper function to evaluate hand strength (0-1 scale)
const evaluateHandStrength = (hand, board) => {
    // Safety check: ensure hand and board are valid
    if (!hand || !Array.isArray(hand) || hand.length < 2) {
        return 0.3; // Default to weak hand if invalid
    }
    
    const allCards = [...board, ...hand];
    
    // If board is empty (pre-flop), evaluate based on hole cards
    if (!board || board.length === 0) {
        return evaluatePreFlopHand(hand);
    }
    
    // Evaluate hand strength based on board
    return evaluatePostFlopHand(allCards, board.length);
};

// Pre-flop hand strength evaluation
const evaluatePreFlopHand = (hand) => {
    try {
        // Comprehensive safety check
        if (!hand || !Array.isArray(hand) || hand.length < 2) {
            return 0.3; // Default to weak hand if invalid
        }
        
        const card1 = hand[0];
        const card2 = hand[1];
        
        // Check if cards exist
        if (!card1 || !card2) {
            return 0.3;
        }
        
        // Convert to string if needed and validate
        const card1Str = String(card1);
        const card2Str = String(card2);
        
        if (card1Str.length < 2 || card2Str.length < 2) {
            return 0.3;
        }
        
        // Safely extract rank and suit
        const rank1 = card1Str.charAt(0);
        const rank2 = card2Str.charAt(0);
        const suit1 = card1Str.length > 1 ? card1Str.charAt(1) : '';
        const suit2 = card2Str.length > 1 ? card2Str.charAt(1) : '';
        
        // Validate that we got valid characters
        if (!rank1 || !rank2 || !suit1 || !suit2) {
            return 0.3;
        }
        
        const isPair = rank1 === rank2;
        const isSuited = suit1 === suit2;
        
        const rankValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 't': 10, 'j': 11, 'q': 12, 'k': 13, 'a': 14 };
        const val1 = rankValues[rank1.toLowerCase()] || 0;
        const val2 = rankValues[rank2.toLowerCase()] || 0;
        
        if (val1 === 0 || val2 === 0) {
            return 0.3; // Invalid rank
        }
        
        const highCard = Math.max(val1, val2);
        const lowCard = Math.min(val1, val2);
        
        // Premium pairs
        if (isPair && highCard >= 10) return 0.85 + (highCard - 10) * 0.03;
        // Medium pairs
        if (isPair && highCard >= 7) return 0.65 + (highCard - 7) * 0.05;
        // Low pairs
        if (isPair) return 0.45 + (highCard - 2) * 0.02;
        
        // High cards
        if (highCard === 14 && lowCard >= 10) return isSuited ? 0.75 : 0.70; // Ace-high
        if (highCard === 13 && lowCard >= 10) return isSuited ? 0.70 : 0.65; // King-high
        if (highCard === 12 && lowCard >= 10) return isSuited ? 0.65 : 0.60; // Queen-high
        
        // Suited connectors
        if (isSuited && Math.abs(val1 - val2) <= 2 && highCard >= 7) {
            return 0.55 + (highCard - 7) * 0.02;
        }
        
        // Default weak hand
        return Math.max(0.2, (highCard - 2) / 12 * 0.4);
    } catch (error) {
        console.error('Error in evaluatePreFlopHand:', error, hand);
        return 0.3; // Return safe default on any error
    }
};

// Post-flop hand strength evaluation
const evaluatePostFlopHand = (allCards, boardSize) => {
    // Safety check
    if (!allCards || !Array.isArray(allCards) || allCards.length < 5) {
        return 0.3; // Default to weak hand if invalid
    }
    
    // Filter out any invalid cards
    const validCards = allCards.filter(card => card && typeof card === 'string' && card.length >= 2);
    if (validCards.length < 5) {
        return 0.3;
    }
    
    // Get best possible hand from all cards
    const combinations = getCombinations(validCards, 5);
    let bestRank = [0, "", [0]];
    
    for (const combo of combinations) {
        const rank = evaluateHand(combo);
        if (rank[0] > bestRank[0] || (rank[0] === bestRank[0] && compareKickers(rank[2], bestRank[2]) > 0)) {
            bestRank = rank;
        }
    }
    
    // Convert hand rank to strength (0-1)
    const handRank = bestRank[0];
    const highCard = bestRank[2][0];
    
    // Normalize based on hand type
    if (handRank === 10) return 1.0; // Royal flush
    if (handRank === 9) return 0.95 + (highCard - 5) / 9 * 0.05; // Straight flush
    if (handRank === 8) return 0.90 + (highCard - 2) / 12 * 0.05; // Four of a kind
    if (handRank === 7) return 0.80 + (highCard - 2) / 12 * 0.10; // Full house
    if (handRank === 6) return 0.70 + (highCard - 2) / 12 * 0.10; // Flush
    if (handRank === 5) return 0.60 + (highCard - 5) / 9 * 0.10; // Straight
    if (handRank === 4) return 0.50 + (highCard - 2) / 12 * 0.10; // Three of a kind
    if (handRank === 3) return 0.40 + (highCard - 2) / 12 * 0.10; // Two pair
    if (handRank === 2) return 0.30 + (highCard - 2) / 12 * 0.10; // Pair
    return 0.20 + (highCard - 2) / 12 * 0.10; // High card
};

// Helper functions for hand evaluation
const getCombinations = (arr, k) => {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
    const withoutFirst = getCombinations(rest, k);
    
    return [...withFirst, ...withoutFirst];
};

const evaluateHand = (cards) => {
    // Safety check
    if (!cards || !Array.isArray(cards) || cards.length !== 5) {
        return [0, "Invalid Hand", [0]];
    }
    
    // Filter and validate cards
    const validCards = cards.filter(card => card && typeof card === 'string' && card.length >= 2);
    if (validCards.length !== 5) {
        return [0, "Invalid Hand", [0]];
    }
    
    const sortedCards = [...validCards].sort((a, b) => {
        const valA = rankToValue(a.charAt(0));
        const valB = rankToValue(b.charAt(0));
        return valB - valA;
    });
    
    if (hasRoyalFlush(sortedCards)) {
        return [10, "Royal Flush", [14]];
    }
    else if (hasStraightFlush(sortedCards)[0]) {
        const straightFlushRank = hasStraightFlush(sortedCards)[1];
        return [9, "Straight Flush", [straightFlushRank]];
    }
    else if (hasFourOfAKind(sortedCards)[0]) {
        const fourOfAKindRank = hasFourOfAKind(sortedCards)[1];
        const kicker = sortedCards.find(c => rankToValue(c.charAt(0)) !== fourOfAKindRank);
        return [8, "Four of a Kind", [fourOfAKindRank, kicker ? rankToValue(kicker.charAt(0)) : 0]];
    }
    else if (hasFullHouse(sortedCards)[0]) {
        const fullHouseRanks = hasFullHouse(sortedCards)[1];
        return [7, "Full House", fullHouseRanks];
    }
    else if (hasFlush(sortedCards)[0]) {
        const flushRanks = hasFlush(sortedCards)[1];
        return [6, "Flush", flushRanks];
    }
    else if (hasStraight(sortedCards)[0]) {
        const straightRank = hasStraight(sortedCards)[1];
        return [5, "Straight", [straightRank]];
    }
    else if (hasThreeOfAKind(sortedCards)[0]) {
        const threeOfAKindRank = hasThreeOfAKind(sortedCards)[1];
        const kickers = sortedCards
            .filter(c => rankToValue(c.charAt(0)) !== threeOfAKindRank)
            .slice(0, 2)
            .map(c => rankToValue(c.charAt(0)));
        return [4, "Three of a Kind", [threeOfAKindRank, ...kickers]];
    }
    else if (hasTwoPair(sortedCards)[0]) {
        const twoPairRanks = hasTwoPair(sortedCards)[1];
        const kicker = sortedCards.find(c => 
            rankToValue(c.charAt(0)) !== twoPairRanks[0] && 
            rankToValue(c.charAt(0)) !== twoPairRanks[1]
        );
        return [3, "Two Pair", [...twoPairRanks, kicker ? rankToValue(kicker.charAt(0)) : 0]];
    }
    else if (hasPair(sortedCards)[0]) {
        const pairRank = hasPair(sortedCards)[1];
        const kickers = sortedCards
            .filter(c => rankToValue(c.charAt(0)) !== pairRank)
            .slice(0, 3)
            .map(c => rankToValue(c.charAt(0)));
        return [2, "Pair", [pairRank, ...kickers]];
    }
    else {
        const highCardRanks = sortedCards.slice(0, 5).map(card => rankToValue(card.charAt(0)));
        return [1, "High Card", highCardRanks];
    }
};

const compareKickers = (kickers1, kickers2) => {
    for (let i = 0; i < Math.max(kickers1.length, kickers2.length); i++) {
        const val1 = kickers1[i] || 0;
        const val2 = kickers2[i] || 0;
        if (val1 > val2) return 1;
        if (val1 < val2) return -1;
    }
    return 0;
};

const rankToValue = (rank) => {
    if (!rank || typeof rank !== 'string') return 0;
    const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 't': 10, 'j': 11, 'q': 12, 'k': 13, 'a': 14 };
    return values[rank.toLowerCase()] || 0;
};

const hasRoyalFlush = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 5) return false;
    const suits = getSuits(cards);
    for (const suit in suits) {
        if (suits[suit] >= 5) {
            const flushCards = cards.filter(card => card && typeof card === 'string' && card.charAt(1) === suit);
            const ranks = new Set(flushCards.map(c => c.charAt(0).toLowerCase()));
            if (ranks.has('a') && ranks.has('k') && ranks.has('q') && ranks.has('j') && ranks.has('t')) {
                return true;
            }
        }
    }
    return false;
};

const hasStraightFlush = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 5) return [false, 0];
    const suits = getSuits(cards);
    for (const suit in suits) {
        if (suits[suit] >= 5) {
            const flushCards = cards.filter(card => card && typeof card === 'string' && card.charAt(1) === suit);
            const straightResult = hasStraight(flushCards);
            if (straightResult[0]) {
                return [true, straightResult[1]];
            }
        }
    }
    return [false, 0];
};

const hasFourOfAKind = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 4) return [false, 0];
    const ranks = getRanks(cards);
    const fourOfAKindRank = Object.keys(ranks).find(rank => ranks[rank] === 4);
    return [!!fourOfAKindRank, fourOfAKindRank ? rankToValue(fourOfAKindRank) : 0];
};

const hasFullHouse = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 5) return [false, [0, 0]];
    const ranks = getRanks(cards);
    const tripletRanks = Object.keys(ranks).filter(rank => ranks[rank] === 3);
    const pairRanks = Object.keys(ranks).filter(rank => ranks[rank] === 2);
    
    if (tripletRanks.length >= 2) {
        const sortedTripletRanks = tripletRanks.sort((a, b) => rankToValue(b) - rankToValue(a));
        return [true, [rankToValue(sortedTripletRanks[0]), rankToValue(sortedTripletRanks[1])]];
    }
    
    if (tripletRanks.length === 1 && pairRanks.length >= 1) {
        const highestPair = pairRanks.sort((a, b) => rankToValue(b) - rankToValue(a))[0];
        return [true, [rankToValue(tripletRanks[0]), rankToValue(highestPair)]];
    }
    
    return [false, [0, 0]];
};

const hasFlush = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 5) return [false, [0, 0, 0, 0, 0]];
    const suits = getSuits(cards);
    const flushSuit = Object.keys(suits).find(suit => suits[suit] >= 5);
    if (flushSuit) {
        const flushCards = cards.filter(card => card && typeof card === 'string' && card.charAt(1) === flushSuit);
        flushCards.sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));
        const highestFlushCards = flushCards.slice(0, 5);
        return [true, highestFlushCards.map(card => rankToValue(card.charAt(0)))];
    }
    return [false, [0, 0, 0, 0, 0]];
};

const hasStraight = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 5) return [false, 0];
    const validCards = cards.filter(card => card && typeof card === 'string' && card.length >= 1);
    if (validCards.length < 5) return [false, 0];
    const uniqueRanks = [...new Set(validCards.map(c => c.charAt(0).toLowerCase()))];
    const rankValues = uniqueRanks.map(r => rankToValue(r)).sort((a, b) => b - a);
    
    for (let i = 0; i <= rankValues.length - 5; i++) {
        let consecutive = true;
        for (let j = 0; j < 4; j++) {
            if (rankValues[i + j] - rankValues[i + j + 1] !== 1) {
                consecutive = false;
                break;
            }
        }
        if (consecutive) {
            return [true, rankValues[i]];
        }
    }
    
    const hasAce = rankValues.includes(14);
    const hasTwo = rankValues.includes(2);
    const hasThree = rankValues.includes(3);
    const hasFour = rankValues.includes(4);
    const hasFive = rankValues.includes(5);
    
    if (hasAce && hasTwo && hasThree && hasFour && hasFive) {
        return [true, 5];
    }
    
    return [false, 0];
};

const hasThreeOfAKind = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 3) return [false, 0];
    const ranks = getRanks(cards);
    const triplet = Object.entries(ranks).find(([rank, count]) => count === 3);
    const hasThreeOfAKind = triplet !== undefined;
    const tripletRank = hasThreeOfAKind ? rankToValue(triplet[0]) : 0;
    return [hasThreeOfAKind, tripletRank];
};

const hasTwoPair = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 4) return [false, [0, 0]];
    const ranks = getRanks(cards);
    const pairs = Object.entries(ranks).filter(([rank, count]) => count === 2);
    const hasTwoPair = pairs.length >= 2;
    if (hasTwoPair) {
        const pairRanks = pairs.map(([rank]) => rankToValue(rank)).sort((a, b) => b - a);
        return [true, [pairRanks[0], pairRanks[1]]];
    }
    return [false, [0, 0]];
};

const hasPair = (cards) => {
    if (!cards || !Array.isArray(cards) || cards.length < 2) return [false, 0];
    const ranks = getRanks(cards);
    const pairs = Object.entries(ranks).filter(([rank, count]) => count === 2);
    const hasPair = pairs.length > 0;
    const highestPair = hasPair ? Math.max(...pairs.map(([rank]) => rankToValue(rank))) : 0;
    return [hasPair, highestPair];
};

const getRanks = (cards) => {
    const ranks = {};
    if (!cards || !Array.isArray(cards)) return ranks;
    for (const card of cards) {
        if (card && typeof card === 'string' && card.length >= 1) {
            const rank = card.charAt(0).toLowerCase();
            ranks[rank] = (ranks[rank] || 0) + 1;
        }
    }
    return ranks;
};

const getSuits = (cards) => {
    const suits = {};
    if (!cards || !Array.isArray(cards)) return suits;
    for (const card of cards) {
        if (card && typeof card === 'string' && card.length >= 2) {
            const suit = card.charAt(1).toLowerCase();
            suits[suit] = (suits[suit] || 0) + 1;
        }
    }
    return suits;
};

// Calculate pot odds
const calculatePotOdds = (betToCall, potSize) => {
    if (betToCall === 0) return 1.0;
    return betToCall / (potSize + betToCall);
};

// Main AI decision function
const makeDecision = (userBal, AIBal, cards, betToCall, pot, board, turn) => {
    try {
        // Safety check for cards
        if (!cards || !Array.isArray(cards) || cards.length < 2) {
            // If no valid cards, fold
            return 'fold';
        }
        
        // Ensure cards are valid strings
        const validCards = cards.filter(card => card && (typeof card === 'string' || String(card).length >= 2));
        if (validCards.length < 2) {
            return 'fold';
        }
        
        const handStrength = evaluateHandStrength(validCards, board || []);
        const potOdds = calculatePotOdds(betToCall, pot);
        const betRatio = betToCall / Math.max(AIBal, 1);
    
        // Pre-flop logic (first action)
        if (turn === 'first') {
            if (handStrength > 0.75) {
                // Premium hand - raise
                const raiseAmount = Math.min(150, Math.floor(AIBal * 0.15));
                return `raise ${raiseAmount}`;
            } else if (handStrength > 0.55) {
                // Good hand - call
                return 'call 50';
            } else if (handStrength > 0.35 && Math.random() < 0.3) {
                // Medium hand - sometimes call
                return 'call 50';
            } else {
                // Weak hand - fold
                return 'fold';
            }
        }
        
        // User checked
        if (turn === 'check') {
            if (handStrength > 0.65) {
                // Strong hand - bet
                const betAmount = Math.min(Math.floor(pot * 0.6), Math.floor(AIBal * 0.2));
                return `bet ${Math.max(50, betAmount)}`;
            } else if (handStrength > 0.45 && Math.random() < 0.4) {
                // Medium hand - sometimes bet (bluff)
                const betAmount = Math.min(Math.floor(pot * 0.5), Math.floor(AIBal * 0.15));
                return `bet ${Math.max(50, betAmount)}`;
            } else {
                // Weak hand - check back
                return 'check';
            }
        }
        
        // User bet/raised
        if (turn === 'bet') {
            // Calculate if we should call based on pot odds and hand strength
            const equityNeeded = potOdds;
            const shouldCall = handStrength > equityNeeded * 0.8; // Need 80% of pot odds to call
            
            if (handStrength > 0.8) {
                // Very strong hand - raise
                const raiseAmount = Math.min(betToCall * 2.5, Math.floor(AIBal * 0.25));
                if (raiseAmount > betToCall && raiseAmount <= AIBal) {
                    return `raise ${raiseAmount}`;
                } else {
                    return `call ${betToCall}`;
                }
            } else if (handStrength > 0.65 && betRatio < 0.3) {
                // Strong hand, reasonable bet - raise
                const raiseAmount = Math.min(betToCall * 2, Math.floor(AIBal * 0.2));
                if (raiseAmount > betToCall && raiseAmount <= AIBal) {
                    return `raise ${raiseAmount}`;
                } else {
                    return `call ${betToCall}`;
                }
            } else if (shouldCall && betRatio < 0.5) {
                // Pot odds justify calling
                return `call ${betToCall}`;
            } else if (handStrength < 0.25 || betRatio > 0.6) {
                // Very weak hand or too expensive - fold
                return 'fold';
            } else if (handStrength > 0.4 && betRatio < 0.4 && Math.random() < 0.3) {
                // Medium hand, reasonable bet - sometimes call
                return `call ${betToCall}`;
            } else {
                // Default - fold
                return 'fold';
            }
        }
        
        // Default fallback
        return 'check';
    } catch (error) {
        console.error('Error in makeDecision:', error, { cards, board, turn });
        return 'fold'; // Return safe default on any error
    }
};

export default makeDecision;
