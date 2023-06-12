const checkWin = (board, AIHand, userHand) => {
    const AICards = [...board, ...AIHand];
    const userCards = [...board, ...userHand];
    const AIRank = getHandRank(AICards);
    const userRank = getHandRank(userCards);
    if (AIRank[0] > userRank[0]) {
        return "AI wins with a " + AIRank[1] + ", you had a " + userRank[1];
    }
    else if (AIRank[0] < userRank[0]) {
        return "You won with a " + userRank[1] + ", AI had a " + AIRank[1];
    }
    else {
        for (let i = 0; i < AIRank[2].length; i++) {
            if (AIRank[2][i] > userRank[2][i]) {
                return "AI wins with a " + AIRank[1] + ", you tied with a " + userRank[1];
            }
            else if (AIRank[2][i] < userRank[2][i]) {
                return "You won with a " + userRank[1] + ", AI tied with a " + AIRank[1];
            }
        }
        return "Draw, AI had " + AIRank[1] + ", you had " + userRank[1];
    }
};

const getHandRank = (cards) => {
    cards.sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));
    if (hasRoyalFlush(cards)[0]) {
        const royalFlushRank = hasRoyalFlush(cards)[1];
        return [10, "Royal Flush", royalFlushRank];
    }
    else if (hasStraightFlush(cards)[0]) {
        const straightFlushRank = hasStraightFlush(cards)[1];
        return [9, "Straight Flush", straightFlushRank];
    }
    else if (hasFourOfAKind(cards)[0]) {
        const fourOfAKindRank = hasFourOfAKind(cards)[1];
        return [8, "Four of a Kind", fourOfAKindRank];
    }
    else if (hasFullHouse(cards)[0]) {
        const fullHouseRanks = hasFullHouse(cards).slice(1);
        return [7, "Full House", ...fullHouseRanks];
    }
    else if (hasFlush(cards)[0]) {
        const flushRanks = hasFlush(cards).slice(1);
        return [6, "Flush", ...flushRanks];
    }
    else if (hasStraight(cards)[0]) {
        const straightRank = hasStraight(cards)[1];
        return [5, "Straight", straightRank];
    }
    else if (hasThreeOfAKind(cards)[0]) {
        const threeOfAKindRank = hasThreeOfAKind(cards)[1];
        return [4, "Three of a Kind", threeOfAKindRank];
    }
    else if (hasTwoPair(cards)[0]) {
        const twoPairRanks = hasTwoPair(cards).slice(1);
        return [3, "Two Pair", ...twoPairRanks];
    }
    else if (hasPair(cards)[0]) {
        const pairRank = hasPair(cards)[1];
        return [2, "Pair", pairRank];
    }
    else {
        const highCardRanks = cards.slice(0, 5).map(card => rankToValue(card.charAt(0)));
        return [1, "High Card", ...highCardRanks];
    }
};

const rankToValue = (rank) => {
    const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 't': 10, 'j': 11, 'q': 12, 'k': 13, 'a': 14 };
    return values[rank];
};

const hasRoyalFlush = (cards) => {
    const straightFlushResult = hasStraightFlush(cards);
    return straightFlushResult[0] && cards.some(card => card.charAt(0) === 'a');
};

const hasStraightFlush = (cards) => {
    const flushResult = hasFlush(cards);
    const straightResult = hasStraight(cards);
    if (flushResult[0] && straightResult[0]) {
        const highestStraightRank = flushResult[1];
        return [true, highestStraightRank];
    }
    return [false, 0];
};

const hasFourOfAKind = (cards) => {
    const ranks = getRanks(cards);
    const fourOfAKindRank = Object.keys(ranks).find(rank => ranks[rank] === 4);
    return [!!fourOfAKindRank, rankToValue(fourOfAKindRank)];
};

const hasFullHouse = (cards) => {
    const ranks = getRanks(cards);
    const tripletRanks = Object.keys(ranks).filter(rank => ranks[rank] === 3);
    if (tripletRanks.length == 2) {
        const sortedTripletRanks = tripletRanks.sort((a, b) => rankToValue(b) - rankToValue(a));
        const highestTripletRank = sortedTripletRanks[0];
        const secondTripletRank = sortedTripletRanks[1];
        return [true, rankToValue(highestTripletRank), rankToValue(secondTripletRank)];
    }
    const hasThreeOfAKind = Object.values(ranks).includes(3);
    const hasPair = Object.values(ranks).includes(2);
    if (hasThreeOfAKind && hasPair) {
        const threeRank = Object.keys(ranks).find(rank => ranks[rank] === 3);
        const pairRank = Object.keys(ranks).find(rank => ranks[rank] === 2);
        return [true, rankToValue(threeRank), rankToValue(pairRank)];
    }
    return [false, 0, 0];
};

const hasFlush = (cards) => {
    const suits = getSuits(cards);
    const flushSuit = Object.keys(suits).find(suit => suits[suit] >= 5);
    if (flushSuit) {
        const flushCards = cards.filter(card => card.charAt(1) === flushSuit);
        flushCards.sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));
        const highestFlushCards = flushCards.slice(0, 5);
        return [true, ...highestFlushCards.map(card => rankToValue(card.charAt(0)))];
    }
    return [false, 0, 0, 0, 0, 0];
};

const hasStraight = (cards) => {
    const ranks = getRanks(cards);
    const sortedRanks = Object.keys(ranks).sort((a, b) => rankToValue(b) - rankToValue(a));
    let consecutiveCount = 0;
    let highestStraightRank = 0;
    for (let i = 0; i < sortedRanks.length - 1; i++) {
        const currentRank = rankToValue(sortedRanks[i]);
        const nextRank = rankToValue(sortedRanks[i + 1]);
        if (currentRank - nextRank === 1) {
            consecutiveCount++;
            if (consecutiveCount === 4) {
                highestStraightRank = currentRank + 4;
                break;
            }
        }
        else if (currentRank !== nextRank) {
            consecutiveCount = 0;
        }
    }
    if (sortedRanks.includes('A') && sortedRanks.includes('2') && sortedRanks.includes('3') && sortedRanks.includes('4') && sortedRanks.includes('5')) {
        highestStraightRank = rankToValue('5');
    }
    return [consecutiveCount === 4 || highestStraightRank !== 0, highestStraightRank];
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
    const hasTwoPair = pairs.length === 2;
    const pairRanks = hasTwoPair ? pairs.map(([rank]) => rankToValue(rank)) : [0, 0];
    const [firstPairRank, secondPairRank] = pairRanks.sort((a, b) => b - a);
    return [hasTwoPair, firstPairRank, secondPairRank];
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