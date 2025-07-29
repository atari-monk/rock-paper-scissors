import type { GameEngine, Scene } from "zippy-game-engine";
import type { GameStateData } from "./types/GameStateData";
import { createInputHandler } from "./input-handler";
import { createRenderer } from "./rendering-sprites";
import { createGameState } from "./game-logic";

export const createRockPaperScissorsScene = (game: GameEngine): Scene => {
    const state: GameStateData = createGameState();
    const inputHandler = createInputHandler(game);
    const renderer = createRenderer();

    const update = (deltaTime: number): void => {
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

        init(): void {
            console.log("Initializing Rock Paper Scissors Scene");
        },

        onEnter(): void {
            state.gameState = "idle";

            // Click handler
            const clickHandler = (e: MouseEvent) =>
                inputHandler.handleClick(state, e);
            game.canvas.addEventListener("click", clickHandler);
            (this as any)._clickHandler = clickHandler;

            // Touch handler
            const touchHandler = (e: TouchEvent) =>
                inputHandler.handleTouch(state, e);
            game.canvas.addEventListener("touchstart", touchHandler);
            (this as any)._touchHandler = touchHandler;
        },

        onExit(): void {
            // Remove click handler
            if ((this as any)._clickHandler) {
                game.canvas.removeEventListener(
                    "click",
                    (this as any)._clickHandler
                );
            }

            // Remove touch handler
            if ((this as any)._touchHandler) {
                game.canvas.removeEventListener(
                    "touchstart",
                    (this as any)._touchHandler
                );
            }
        },

        update,

        render(ctx: CanvasRenderingContext2D): void {
            renderer.renderGame(ctx, game.canvas, state);
        },

        resize(): void {
            // Handle resize if needed
        },
    };
};
