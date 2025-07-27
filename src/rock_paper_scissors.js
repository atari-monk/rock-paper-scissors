import { createGameState } from "./game_logic.js";
import { createInputHandler } from "./input_handler.js";
import { createRenderer } from "./rendering_sprites.js";

export const createRockPaperScissorsScene = (game) => {
    const state = createGameState();
    const inputHandler = createInputHandler(game);
    const renderer = createRenderer();

    const update = (deltaTime) => {
        if (state.gameState === "result" && state.countdown > 0) {
            state.countdown -= 1;
        }

        if (state.gameState === "idle") {
            state.pulseSize += 0.0005 * deltaTime * state.pulseDir;
            if (state.pulseSize > 1.2) state.pulseDir = -1;
            if (state.pulseSize < 0.8) state.pulseDir = 1;
        }
    };

    return {
        name: "Rock Paper Scissors",

        init() {
            console.log("Initializing Rock Paper Scissors Scene");
        },

        onEnter() {
            state.gameState = "idle";
            game.canvas.addEventListener("click", (e) =>
                inputHandler.handleClick(state, e)
            );
        },

        onExit() {
            game.canvas.removeEventListener("click", inputHandler.handleClick);
        },

        update,

        render(ctx) {
            renderer.renderGame(ctx, game.canvas, state);
        },

        resize() {
            // Handle resize if needed
        },
    };
};
