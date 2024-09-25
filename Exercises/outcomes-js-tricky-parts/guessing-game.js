function guessingGame() {
    const randomNum = Math.floor(Math.random()*100);
    const obj = {
        won:false,
        guesses: 0
    }
    return function (guess) {
        if(obj.won) return `The game is over, you already won!`;

        obj.guesses = obj.guesses + 1;

        if(guess > randomNum) return `${guess} is too high!`;
        if(guess < randomNum) return `${guess} is too low!`;
        if(guess === randomNum){
            obj.won = true;
            return `You win! You found ${guess} in ${obj.guesses} guesses.`;            
        }

    }
    
}

module.exports = { guessingGame };
