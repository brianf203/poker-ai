const checkWin = (board, AIHand, userHand) => {
    const AICards = [...board, ...AIHand];
    const userCards = [...board, ...userHand];
    const AIRank = getHandRank(AICards);
    const userRank = getHandRank(userCards);
    
    if (AIRank[0] > userRank[0]) {
        const highCard = valueToRank(AIRank[2][0]);
        const userHighCard = valueToRank(userRank[2][0]);
        return `AI wins with a ${AIRank[1]} (${highCard} high), you had a ${userRank[1]} (${userHighCard} high)`;
    }
    else if (AIRank[0] < userRank[0]) {
        const highCard = valueToRank(userRank[2][0]);
        const aiHighCard = valueToRank(AIRank[2][0]);
        return `You won with a ${userRank[1]} (${highCard} high), AI had a ${AIRank[1]} (${aiHighCard} high)`;
    }
    else {
        for (let i = 0; i < Math.max(AIRank[2].length, userRank[2].length); i++) {
            const aiValue = AIRank[2][i] || 0;
            const userValue = userRank[2][i] || 0;
            if (aiValue > userValue) {
                const highCard = valueToRank(aiValue);
                return `AI wins with a ${AIRank[1]} (${highCard} high), you tied with a ${userRank[1]}`;
            }
            else if (aiValue < userValue) {
                const highCard = valueToRank(userValue);
                return `You won with a ${userRank[1]} (${highCard} high), AI tied with a ${AIRank[1]}`;
            }
        }
        return `Draw! Both players have ${AIRank[1]}`;
    }
};

const valueToRank = (value) => {
    const ranks = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
    return ranks[value] || value;
};

const getHandRank = (cards) => {
    // Safety check
    if (!cards || !Array.isArray(cards) || cards.length < 5) {
        return [0, "Invalid Hand", [0]];
    }
    
    // Get all possible 5-card combinations from 7 cards
    const combinations = getCombinations(cards, 5);
    let bestRank = [0, "", [0]];
    
    for (const combo of combinations) {
        const rank = evaluateHand(combo);
        if (rank[0] > bestRank[0] || (rank[0] === bestRank[0] && compareKickers(rank[2], bestRank[2]) > 0)) {
            bestRank = rank;
        }
    }
    
    return bestRank;
};

const getCombinations = (arr, k) => {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
    const withoutFirst = getCombinations(rest, k);
    
    return [...withFirst, ...withoutFirst];
};

const evaluateHand = (cards) => {
    const sortedCards = [...cards].sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));
    
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
    const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 't': 10, 'j': 11, 'q': 12, 'k': 13, 'a': 14 };
    return values[rank] || 0;
};

const hasRoyalFlush = (cards) => {
    const suits = getSuits(cards);
    for (const suit in suits) {
        if (suits[suit] >= 5) {
            const flushCards = cards.filter(card => card.charAt(1) === suit);
            const ranks = new Set(flushCards.map(c => c.charAt(0).toLowerCase()));
            if (ranks.has('a') && ranks.has('k') && ranks.has('q') && ranks.has('j') && ranks.has('t')) {
                return true;
            }
        }
    }
    return false;
};

const hasStraightFlush = (cards) => {
    const suits = getSuits(cards);
    for (const suit in suits) {
        if (suits[suit] >= 5) {
            const flushCards = cards.filter(card => card.charAt(1) === suit);
            const straightResult = hasStraight(flushCards);
            if (straightResult[0]) {
                return [true, straightResult[1]];
            }
        }
    }
    return [false, 0];
};

const hasFourOfAKind = (cards) => {
    const ranks = getRanks(cards);
    const fourOfAKindRank = Object.keys(ranks).find(rank => ranks[rank] === 4);
    return [!!fourOfAKindRank, fourOfAKindRank ? rankToValue(fourOfAKindRank) : 0];
};

const hasFullHouse = (cards) => {
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
    const suits = getSuits(cards);
    const flushSuit = Object.keys(suits).find(suit => suits[suit] >= 5);
    if (flushSuit) {
        const flushCards = cards.filter(card => card.charAt(1) === flushSuit);
        flushCards.sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));
        const highestFlushCards = flushCards.slice(0, 5);
        return [true, highestFlushCards.map(card => rankToValue(card.charAt(0)))];
    }
    return [false, [0, 0, 0, 0, 0]];
};

const hasStraight = (cards) => {
    const uniqueRanks = [...new Set(cards.map(c => c.charAt(0)))];
    const rankValues = uniqueRanks.map(r => rankToValue(r)).sort((a, b) => b - a);
    
    // Check for regular straight
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
    
    // Check for A-2-3-4-5 straight (wheel)
    const hasAce = rankValues.includes(14);
    const hasTwo = rankValues.includes(2);
    const hasThree = rankValues.includes(3);
    const hasFour = rankValues.includes(4);
    const hasFive = rankValues.includes(5);
    
    if (hasAce && hasTwo && hasThree && hasFour && hasFive) {
        return [true, 5]; // 5-high straight
    }
    
    return [false, 0];
};

const hasThreeOfAKind = (cards) => {
    const ranks = getRanks(cards);
    const triplet = Object.entries(ranks).find(([rank, count]) => count === 3);
    const hasThreeOfAKind = triplet !== undefined;
    const tripletRank = hasThreeOfAKind ? rankToValue(triplet[0]) : 0;
    return [hasThreeOfAKind, tripletRank];
};

const hasTwoPair = (cards) => {
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
    const ranks = getRanks(cards);
    const pairs = Object.entries(ranks).filter(([rank, count]) => count === 2);
    const hasPair = pairs.length > 0;
    const highestPair = hasPair ? Math.max(...pairs.map(([rank]) => rankToValue(rank))) : 0;
    return [hasPair, highestPair];
};

const getRanks = (cards) => {
    const ranks = {};
    for (const card of cards) {
        const rank = card.charAt(0);
        ranks[rank] = (ranks[rank] || 0) + 1;
    }
    return ranks;
};

const getSuits = (cards) => {
    const suits = {};
    for (const card of cards) {
        const suit = card.charAt(1);
        suits[suit] = (suits[suit] || 0) + 1;
    }
    return suits;
};

export default checkWin;
