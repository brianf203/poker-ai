const makeDecision = (userBal, AIBal, cards, bet, pot, board, dec) => {

    // user check
    if (dec) {
        const decision = Math.random();
        if(decision < 0.5) {
            return "check";
        }
        else {
            return "bet 100";
        }
    }

    // user bets
    else {
        const decision = Math.random();
        if (decision < 0.1) {
            return "fold";
        }
        else if (decision < 0.7) {
            return `call ${bet}`;
        }
        else {
            const raiseAmount = bet * 2;
            return `raise ${raiseAmount}`;
        }
    }

};

export default makeDecision;