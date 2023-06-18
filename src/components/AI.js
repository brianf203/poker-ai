const makeDecision = (userBal, AIBal, cards, bet, pot, board, turn) => {

    // user check
    if (turn == 'check') {
        const decision = Math.random();
        if(decision < 0.5) {
            return 'check';
        }
        else {
            return 'bet 100';
        }
    }

    // user bets
    else if (turn == 'bet') {
        const decision = Math.random();
        if (decision < 0.1) {
            return 'fold';
        }
        else if (decision < 0.7) {
            return `call ${bet}`;
        }
        else {
            const raiseAmount = bet * 2;
            return `raise ${raiseAmount}`;
        }
    }

    // ai turn (first)
    else if (turn == 'first') {
        const decision = Math.random();
        if (decision < 0.8) {
            return 'call 50';
        }
        else if (decision < 0.9) {
            return 'raise 150';
        }
        else {
            return 'fold';
        }
    }

    // ai turn
    else {
        const decision = Math.random();
        if (decision < 0.6) {
            return 'check';
        }
        else {
            return 'bet 100';
        }
    }

};

export default makeDecision;