import type { GameResult } from "./GameResult";
import type { GameState } from "./GameState";
import type { PlayerChoice } from "./PlayerChoice";
import type { GameChoice } from "./GameChoice";

export interface GameStateData {
    gameState: GameState;
    playerChoice: PlayerChoice;
    computerChoice: PlayerChoice;
    result: GameResult;
    countdown: number;
    choices: GameChoice[];
    pulseSize: number;
    pulseDir: number;
}
