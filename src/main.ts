import { createRockPaperScissorsScene } from "./rock-paper-scissors";
import "./style.css";
import { GameAppFactory } from "zippy-game-engine";

window.addEventListener("load", async () => {
    const gameApp = new GameAppFactory();
    await gameApp.initialize();

    gameApp.registerScene(
        "Rock Paper Scissors",
        createRockPaperScissorsScene(gameApp.getGameEngine())
    );
    
    gameApp.transitionToScene("Rock Paper Scissors");
});
