import "./style.css";
import { createCrossLinesScene } from "./createCrossLinesScene";
import { GameAppFactory } from "zippy-game-engine";

window.addEventListener("load", async () => {
    const gameApp = new GameAppFactory();
    await gameApp.initialize();
    gameApp.registerScene(
        "Cross Lines",
        createCrossLinesScene(gameApp.getGameEngine())
    );
    gameApp.transitionToScene("Cross Lines");
});
