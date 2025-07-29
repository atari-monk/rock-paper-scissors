import type { GameStateData } from "./types/GameStateData";
import type { GameChoice } from "./types/GameChoice";

type SpriteMap = Record<GameChoice, HTMLImageElement>;
type SpriteLoadStatus = Record<GameChoice, boolean>;

export const createRenderer = () => {
    const sprites: SpriteMap = {
        rock: new Image(),
        paper: new Image(),
        scissors: new Image(),
    };

    const spritesLoaded: SpriteLoadStatus = {
        rock: false,
        paper: false,
        scissors: false,
    };

    // Load images from public directory
    const loadSprite = (key: GameChoice) => {
        return new Promise<void>((resolve) => {
            sprites[key].src = `/pages/rock-paper-scissors/assets/${key}.png`; // Note: No '../public' needed in Vite
            sprites[key].onload = () => {
                spritesLoaded[key] = true;
                resolve();
            };
            sprites[key].onerror = () => {
                console.error(`Failed to load sprite: ${key}`);
                resolve(); // Still resolve to continue game
            };
        });
    };

    // Load all sprites
    const loadAllSprites = async () => {
        await Promise.all([
            loadSprite("rock"),
            loadSprite("paper"),
            loadSprite("scissors"),
        ]);
    };

    const drawSpriteSymbol = (
        ctx: CanvasRenderingContext2D,
        type: GameChoice | null,
        x: number,
        y: number,
        size: number
    ): void => {
        if (!type || !spritesLoaded[type]) {
            // Fallback: Draw placeholder if image not loaded
            drawPlaceholder(ctx, type, x, y, size);
            return;
        }

        ctx.save();
        ctx.translate(x, y);

        const aspectRatio =
            sprites[type].naturalWidth / sprites[type].naturalHeight;
        const width = size;
        const height = size / aspectRatio;

        ctx.drawImage(sprites[type], -width / 2, -height / 2, width, height);
        ctx.restore();
    };

    const drawPlaceholder = (
        ctx: CanvasRenderingContext2D,
        type: GameChoice | null,
        x: number,
        y: number,
        size: number
    ) => {
        ctx.save();
        ctx.translate(x, y);

        // Draw a simple placeholder shape
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#cccccc";
        ctx.fill();
        ctx.strokeStyle = "#999999";
        ctx.stroke();

        // Add text indicating the type
        if (type) {
            ctx.font = `${size / 3}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#333333";
            ctx.fillText(type.charAt(0).toUpperCase(), 0, 0);
        }

        ctx.restore();
    };

    const renderIdleState = (
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        state: GameStateData
    ): void => {
        // Title
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#4cc9f0";
        ctx.fillText("Rock Paper Scissors", centerX, centerY);

        // Start button
        ctx.beginPath();
        ctx.arc(centerX, centerY + 100, 50, 0, Math.PI * 2);
        ctx.fillStyle = "#4CAF50";
        ctx.fill();

        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("START", centerX, centerY + 105);

        // Pulsing hand animation
        ctx.save();
        ctx.translate(centerX, centerY - 100);
        ctx.scale(state.pulseSize, state.pulseSize);
        drawSpriteSymbol(ctx, "rock", -50, 0, 60);
        drawSpriteSymbol(ctx, "paper", 0, 0, 60);
        drawSpriteSymbol(ctx, "scissors", 50, 0, 60);
        ctx.restore();
    };

    const renderPlayerChooseState = (
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        state: GameStateData
    ): void => {
        // Instruction
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#90e0ef";
        ctx.fillText("Choose your move:", centerX, centerY - 80);

        // Choices
        const choicesY = centerY + 50;
        const spacing = 100;

        state.choices.forEach((choice, i) => {
            const choiceX = centerX + (i - 1) * spacing;
            drawSpriteSymbol(ctx, choice, choiceX, choicesY, 80);
        });
    };

    const renderResultState = (
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        state: GameStateData
    ): void => {
        // Player choice
        if (state.playerChoice) {
            drawSpriteSymbol(
                ctx,
                state.playerChoice,
                centerX - 100,
                centerY,
                100
            );
        }
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#90e0ef";
        ctx.fillText("You", centerX - 100, centerY + 100);

        // VS text
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#f72585";
        ctx.fillText("VS", centerX, centerY + 30);

        // Computer choice
        if (state.countdown > 0 && state.computerChoice) {
            // Countdown animation
            const scale = 1 - state.countdown / 60;
            ctx.save();
            ctx.translate(centerX + 100, centerY);
            ctx.scale(scale, scale);
            drawSpriteSymbol(ctx, state.computerChoice, 0, 0, 100);
            ctx.restore();
        } else if (state.computerChoice) {
            // Show computer choice
            drawSpriteSymbol(
                ctx,
                state.computerChoice,
                centerX + 100,
                centerY,
                100
            );
            ctx.fillText("Computer", centerX + 100, centerY + 100);

            // Show result
            let resultText = "";
            let resultColor = "";

            switch (state.result) {
                case "win":
                    resultText = "You Win!";
                    resultColor = "#4CAF50";
                    break;
                case "lose":
                    resultText = "You Lose!";
                    resultColor = "#F44336";
                    break;
                case "draw":
                    resultText = "Draw!";
                    resultColor = "#FFC107";
                    break;
            }

            if (resultText && resultColor) {
                ctx.font = "bold 30px Arial";
                ctx.fillStyle = resultColor;
                ctx.fillText(resultText, centerX, centerY - 120);
            }

            // Play again button
            ctx.beginPath();
            ctx.arc(centerX, centerY + 170, 50, 0, Math.PI * 2);
            ctx.fillStyle = "#2196F3";
            ctx.fill();

            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("PLAY", centerX, centerY + 175);
        }
    };

    const renderGame = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        state: GameStateData
    ): void => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        switch (state.gameState) {
            case "idle":
                renderIdleState(ctx, centerX, centerY, state);
                break;
            case "player-choose":
                renderPlayerChooseState(ctx, centerX, centerY, state);
                break;
            case "result":
                renderResultState(ctx, centerX, centerY, state);
                break;
        }
    };

    loadAllSprites();

    return { renderGame };
};
