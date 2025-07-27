import { computerMakeChoice, determineResult } from "./game_logic.js";

export const createInputHandler = (game) => {
    const handleClick = (state, e) => {
        const canvas = game.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const buttonRadius = 50;

        if (state.gameState === "idle") {
            const startButtonY = centerY + 100;
            if (Math.hypot(x - centerX, y - startButtonY) < buttonRadius) {
                state.gameState = "player-choose";
            }
        } else if (state.gameState === "player-choose") {
            const choicesY = centerY + 50;
            const spacing = 100;

            state.choices.forEach((choice, i) => {
                const choiceX = centerX + (i - 1) * spacing;
                if (Math.hypot(x - choiceX, y - choicesY) < buttonRadius) {
                    state.playerChoice = choice;
                    state.gameState = "result";
                    state.countdown = 60;
                    computerMakeChoice(state);
                    determineResult(state);
                }
            });
        } else if (state.gameState === "result" && state.countdown <= 0) {
            const againButtonY = centerY + 150;
            if (Math.hypot(x - centerX, y - againButtonY) < buttonRadius) {
                state.gameState = "player-choose";
                state.playerChoice = null;
                state.computerChoice = null;
                state.result = null;
                state.countdown = 0;
            }
        }
    };

    return { handleClick };
};
