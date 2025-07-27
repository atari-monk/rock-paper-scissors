export const createGameState = () => ({
    gameState: "idle",
    playerChoice: null,
    computerChoice: null,
    result: null,
    countdown: 0,
    choices: ["rock", "paper", "scissors"],
    pulseSize: 1,
    pulseDir: 1,
});

export const determineResult = (state) => {
    if (state.playerChoice === state.computerChoice) {
        state.result = "draw";
        return;
    }

    const wins = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };

    state.result =
        wins[state.playerChoice] === state.computerChoice ? "win" : "lose";
};

export const computerMakeChoice = (state) => {
    state.computerChoice =
        state.choices[Math.floor(Math.random() * state.choices.length)];
};
