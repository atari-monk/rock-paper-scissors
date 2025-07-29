import type { GameEngine } from "zippy-game-engine";
import { computerMakeChoice, determineResult } from "./game-logic";
import type { GameStateData } from "./types/GameStateData";

export class InputHandler {
    private game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    public handleClick(state: GameStateData, e: MouseEvent): void {
        this.handleInput(state, e.clientX, e.clientY);
    }

    public handleTouch(state: GameStateData, e: TouchEvent): void {
        const touch = e.touches[0]; // Get the first touch
        this.handleInput(state, touch.clientX, touch.clientY);
    }

    private handleInput(
        state: GameStateData,
        clientX: number,
        clientY: number
    ): void {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const buttonRadius = 50;

        switch (state.gameState) {
            case "idle":
                this.handleIdleState(
                    state,
                    x,
                    y,
                    centerX,
                    centerY,
                    buttonRadius
                );
                break;
            case "player-choose":
                this.handlePlayerChooseState(
                    state,
                    x,
                    y,
                    centerX,
                    centerY,
                    buttonRadius
                );
                break;
            case "result":
                if (state.countdown <= 0) {
                    this.handleResultState(
                        state,
                        x,
                        y,
                        centerX,
                        centerY,
                        buttonRadius
                    );
                }
                break;
        }
    }

    private handleIdleState(
        state: GameStateData,
        x: number,
        y: number,
        centerX: number,
        centerY: number,
        buttonRadius: number
    ): void {
        const startButtonY = centerY + 100;
        if (Math.hypot(x - centerX, y - startButtonY) < buttonRadius) {
            state.gameState = "player-choose";
        }
    }

    private handlePlayerChooseState(
        state: GameStateData,
        x: number,
        y: number,
        centerX: number,
        centerY: number,
        buttonRadius: number
    ): void {
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
    }

    private handleResultState(
        state: GameStateData,
        x: number,
        y: number,
        centerX: number,
        centerY: number,
        buttonRadius: number
    ): void {
        const againButtonY = centerY + 150;
        if (Math.hypot(x - centerX, y - againButtonY) < buttonRadius) {
            this.resetGameState(state);
        }
    }

    private resetGameState(state: GameStateData): void {
        state.gameState = "player-choose";
        state.playerChoice = null;
        state.computerChoice = null;
        state.result = null;
        state.countdown = 0;
        state.pulseSize = 1;
        state.pulseDir = 1;
    }
}

export const createInputHandler = (game: GameEngine) => new InputHandler(game);
