const checkWin = (board, AIHand, userHand) => {
    const AICards = [...board, ...AIHand];
    const userCards = [...board, ...userHand];

    const AIRank = getHandRank(AICards);
    const userRank = getHandRank(userCards);

    if (AIRank > userRank) {
        return "AI";
    } else if (AIRank < userRank) {
        return "user";
    } else {
        return "draw";
    }
};

const getHandRank = (cards) => {
    cards.sort((a, b) => rankToValue(b.charAt(0)) - rankToValue(a.charAt(0)));

    if (hasStraightFlush(cards)) {
        return 9;
    } else if (hasFourOfAKind(cards)) {
        return 8;
    } else if (hasFullHouse(cards)) {
        return 7;
    } else if (hasFlush(cards)) {
        return 6;
    } else if (hasStraight(cards)) {
        return 5;
    } else if (hasThreeOfAKind(cards)) {
        return 4;
    } else if (hasTwoPair(cards)) {
        return 3;
    } else if (hasPair(cards)) {
        return 2;
    } else {
        return 1;
    }
};

const rankToValue = (rank) => {
    const values = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'T': 10,
        'J': 11,
        'Q': 12,
        'K': 13,
        'A': 14
    };
    return values[rank];
};

const hasStraightFlush = (cards) => {
    return hasFlush(cards) && hasStraight(cards);
};

const hasFourOfAKind = (cards) => {
    const ranks = getRanks(cards);
    return Object.values(ranks).some(count => count === 4);
};

const hasFullHouse = (cards) => {
    const ranks = getRanks(cards);
    return Object.values(ranks).includes(3) && Object.values(ranks).includes(2);
};

const hasFlush = (cards) => {
    const suits = getSuits(cards);
    return Object.values(suits).some(count => count === 5);
};

const hasStraight = (cards) => {
    const ranks = getRanks(cards);
    const sortedRanks = Object.keys(ranks).sort((a, b) => rankToValue(b) - rankToValue(a));

    let consecutiveCount = 0;
    for (let i = 0; i < sortedRanks.length - 1; i++) {
        const currentRank = rankToValue(sortedRanks[i]);
        const nextRank = rankToValue(sortedRanks[i + 1]);
        if (currentRank - nextRank === 1) {
            consecutiveCount++;
        } else if (currentRank === nextRank) {
            continue;
        } else {
            consecutiveCount = 0;
        }

        if (consecutiveCount === 4) {
            return true;
        }
    }

    if (sortedRanks.includes('A') && sortedRanks.includes('2') && sortedRanks.includes('3')
        && sortedRanks.includes('4') && sortedRanks.includes('5')) {
        return true;
    }

    return false;
};

const hasThreeOfAKind = (cards) => {
    const ranks = getRanks(cards);
    return Object.values(ranks).some(count => count === 3);
};

const hasTwoPair = (cards) => {
    const ranks = getRanks(cards);
    const pairCounts = Object.values(ranks).filter(count => count === 2);
    return pairCounts.length === 2;
};

const hasPair = (cards) => {
    const ranks = getRanks(cards);
    return Object.values(ranks).some(count => count === 2);
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