const makeDecision = (userBal, AIBal, cards, bet, pot, board) => {

    const decision = Math.random();
    if (decision < 0.1) {
        return "fold";
    }
    else if (decision < 0.5) {
        return `call ${bet}`;
    }
    else if (decision < 0.9) {
        const raiseAmount = bet * 2;
        return `raise ${raiseAmount}`;
    }
    else {
        return "all in";
    }
};

export default makeDecision;