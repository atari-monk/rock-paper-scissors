export const createRenderer = () => {
    // Preload sprites
    const sprites = {
        rock: Object.assign(new Image(), { src: "../assets/rock.png" }),
        paper: Object.assign(new Image(), { src: "../assets/paper.png" }),
        scissors: Object.assign(new Image(), { src: "../assets/scissors.png" }),
    };

    const drawSpriteSymbol = (ctx, type, x, y, size) => {
        if (!sprites[type]?.complete) return;

        ctx.save();
        ctx.translate(x, y);

        const aspectRatio =
            sprites[type].naturalWidth / sprites[type].naturalHeight;
        const width = size;
        const height = size / aspectRatio;

        ctx.drawImage(sprites[type], -width / 2, -height / 2, width, height);
        ctx.restore();
    };

    const renderIdleState = (ctx, centerX, centerY, state) => {
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

    const renderPlayerChooseState = (ctx, centerX, centerY, state) => {
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

    const renderResultState = (ctx, centerX, centerY, state) => {
        // Player choice
        drawSpriteSymbol(ctx, state.playerChoice, centerX - 100, centerY, 100);
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#90e0ef";
        ctx.fillText("You", centerX - 100, centerY + 100);

        // VS text
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#f72585";
        ctx.fillText("VS", centerX, centerY + 30);

        // Computer choice
        if (state.countdown > 0) {
            // Countdown animation
            const scale = 1 - state.countdown / 60;
            ctx.save();
            ctx.translate(centerX + 100, centerY);
            ctx.scale(scale, scale);
            drawSpriteSymbol(ctx, state.computerChoice, 0, 0, 100);
            ctx.restore();
        } else {
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

            ctx.font = "bold 30px Arial";
            ctx.fillStyle = resultColor;
            ctx.fillText(resultText, centerX, centerY - 120);

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

    const renderGame = (ctx, canvas, state) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        switch (state.gameState) {
            case "idle":
                return renderIdleState(ctx, centerX, centerY, state);
            case "player-choose":
                return renderPlayerChooseState(ctx, centerX, centerY, state);
            case "result":
                return renderResultState(ctx, centerX, centerY, state);
        }
    };

    return { renderGame };
};
