import { createRockPaperScissorsScene } from "./rock_paper_scissors.js";

export function registerRPS(game) {
    game.registerScene(
        "Rock Paper Scissors",
        createRockPaperScissorsScene(game)
    );
}
