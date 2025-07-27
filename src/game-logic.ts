import type { GameChoice } from "./types/GameChoice";
import type { GameStateData } from "./types/GameStateData";

export const createGameState = (): GameStateData => ({
    gameState: "idle",
    playerChoice: null,
    computerChoice: null,
    result: null,
    countdown: 0,
    choices: ["rock", "paper", "scissors"],
    pulseSize: 1,
    pulseDir: 1,
});

export const determineResult = (state: GameStateData): void => {
    if (!state.playerChoice || !state.computerChoice) {
        state.result = null;
        return;
    }

    if (state.playerChoice === state.computerChoice) {
        state.result = "draw";
        return;
    }

    const wins: Record<GameChoice, GameChoice> = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };

    state.result =
        wins[state.playerChoice] === state.computerChoice ? "win" : "lose";
};

export const computerMakeChoice = (state: GameStateData): void => {
    state.computerChoice =
        state.choices[Math.floor(Math.random() * state.choices.length)];
};
