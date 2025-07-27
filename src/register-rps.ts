import type { GameEngine } from "zippy-game-engine";
import { createRockPaperScissorsScene } from "./rock-paper-scissors";

export function registerRPS(game: GameEngine): void {
    game.registerScene(
        "Rock Paper Scissors",
        createRockPaperScissorsScene(game)
    );
}
