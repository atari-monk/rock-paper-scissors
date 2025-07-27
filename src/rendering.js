export function renderGame(ctx, canvas, state) {
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
}

function renderIdleState(ctx, centerX, centerY, state) {
    // Title
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#4cc9f0";
    ctx.fillText("Rock Paper Scissors", centerX, centerY - 50);

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
    drawHandSymbol(ctx, "rock", 0, 0, 30);
    drawHandSymbol(ctx, "paper", -50, 0, 30);
    drawHandSymbol(ctx, "scissors", 50, 0, 30);
    ctx.restore();
}

function renderPlayerChooseState(ctx, centerX, centerY, state) {
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
        drawHandSymbol(ctx, choice, choiceX, choicesY, 40);
    });
}

function renderResultState(ctx, centerX, centerY, state) {
    // Player choice
    drawHandSymbol(ctx, state.playerChoice, centerX - 100, centerY, 50);
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#90e0ef";
    ctx.fillText("You", centerX - 100, centerY + 80);

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
        drawHandSymbol(ctx, state.computerChoice, 0, 0, 50);
        ctx.restore();
    } else {
        // Show computer choice
        drawHandSymbol(ctx, state.computerChoice, centerX + 100, centerY, 50);
        ctx.fillText("Computer", centerX + 100, centerY + 80);

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
        ctx.fillText(resultText, centerX, centerY - 50);

        // Play again button
        ctx.beginPath();
        ctx.arc(centerX, centerY + 150, 50, 0, Math.PI * 2);
        ctx.fillStyle = "#2196F3";
        ctx.fill();

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("PLAY AGAIN", centerX, centerY + 155);
    }
}

export function drawHandSymbol(ctx, type, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    switch (type) {
        case "rock":
            // Draw rock (closed fist)
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fillStyle = "#795548";
            ctx.fill();
            ctx.strokeStyle = "#5d4037";
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case "paper":
            // Draw paper (flat hand)
            ctx.beginPath();
            ctx.rect(-size, -size * 0.7, size * 2, size * 1.4);
            ctx.fillStyle = "#F5F5F5";
            ctx.fill();
            ctx.strokeStyle = "#BDBDBD";
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case "scissors":
            // Draw scissors
            ctx.beginPath();
            ctx.moveTo(-size, -size);
            ctx.lineTo(0, 0);
            ctx.lineTo(-size, size);
            ctx.moveTo(size, -size);
            ctx.lineTo(0, 0);
            ctx.lineTo(size, size);
            ctx.strokeStyle = "#9E9E9E";
            ctx.lineWidth = size * 0.2;
            ctx.stroke();
            break;
    }

    ctx.restore();
}
