const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");

const cellSize = 20;
const cellsPerSide = snakeCanvas.width / cellSize;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let orange = { x: 15, y: 8 };

const snakeMessage = document.getElementById("snakeMessage");
const snakeScoreDisplay = document.getElementById("snakeScore");
const snakeBestDisplay = document.getElementById("snakeBest");

let snakeScore = 0;
let snakeBest = Number(localStorage.getItem("basixSnakeBest")) || 0;

snakeBestDisplay.textContent = snakeBest;

let snakeDirection = { x: 1, y: 0 };
let nextSnakeDirection = { x: 1, y: 0 };
let snakeLoop = null;
let snakeOver = false;
let snakeMoveDelay = 150;

function spawnOrange() {
    const emptyCells = [];

    for (let y = 0; y < cellsPerSide; y++) {
        for (let x = 0; x < cellsPerSide; x++) {
            if (!snake.some(function(segment) {
                return segment.x === x && segment.y === y;
            })) {
                emptyCells.push({ x: x, y: y });
            }
        }
    }

    if (emptyCells.length === 0) return null;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function drawSnakeBoard() {
    snakeCtx.fillStyle = "#2c241d";
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snakeCtx.strokeStyle = "#44372f"
    snakeCtx.lineWidth = 1;

    for (let i = 1; i < cellsPerSide; i++) {
        const line = i * cellSize;

        snakeCtx.beginPath();
        snakeCtx.moveTo(line, 0);
        snakeCtx.lineTo(line, snakeCanvas.height);

        snakeCtx.moveTo(0, line);
        snakeCtx.lineTo(snakeCanvas.width, line);
        snakeCtx.stroke();
    }

    if (orange !== null) {
    snakeCtx.fillStyle = "#e69b39";
    snakeCtx.beginPath();
    snakeCtx.arc(
        orange.x * cellSize + cellSize / 2,
        orange.y * cellSize + cellSize / 2,
        7, 0, Math.PI * 2
    );

    snakeCtx.fill();
    }

    snake.forEach(function(segment, index) {
        snakeCtx.fillStyle = index === 0 ? "#b5cd7c" : "#7a9d56";

        snakeCtx.fillRect(
            segment.x * cellSize + 2,
            segment.y * cellSize + 2,
            cellSize - 4,
            cellSize - 4
        );

        if (index === 0) {
            let eyeX = segment.x * cellSize + cellSize / 2;
            let eyeY = segment.y * cellSize + cellSize / 2;

            if (snakeDirection.x === 1) {
                eyeX += 4;
                eyeY -= 3;
            } else if (snakeDirection.x === -1) {
                eyeX -= 4;
                eyeY -= 3;
            } else if (snakeDirection.y === 1) {
                eyeX += 3;
                eyeY += 4;
            } else if (snakeDirection.y === -1) {
                eyeX += 3;
                eyeY -= 4;
            }

            snakeCtx.fillStyle = "#111111";
            snakeCtx.beginPath();
            snakeCtx.arc(eyeX, eyeY, 2.2, 0, Math.PI * 2);
            snakeCtx.fill();
        }
    });
}

drawSnakeBoard();

function moveSnake() {
    snakeDirection = nextSnakeDirection;

    const head = {
        x: snake[0].x + snakeDirection.x,
        y: snake[0].y + snakeDirection.y
    };

    if (head.x < 0 || head.x >= cellsPerSide || head.y < 0 || head.y >= cellsPerSide) {
        clearInterval(snakeLoop);
        snakeLoop = null;
        snakeOver = true;
        snakeMessage.textContent = "Game over! CAPY hit the wall!";
        return;
    }

    const eating = head.x === orange.x && head.y === orange.y;
    const body = eating ? snake : snake.slice(0, -1);

    if (body.some(function(segment) {
        return segment.x === head.x && segment.y === head.y;
    })) {
        clearInterval(snakeLoop);
        snakeLoop = null;
        snakeOver = true;
        snakeMessage.textContent = "Game over! CAPY ate Himself!";
        return;
    }

    snake.unshift(head);

    if (eating) {
        snakeScore += 1;
        snakeScoreDisplay.textContent = snakeScore;

        if (snakeScore > snakeBest) {
            snakeBest = snakeScore;
            snakeBestDisplay.textContent = snakeBest;
            localStorage.setItem("basixSnakeBest", String(snakeBest));
        }

        if (snake.length === cellsPerSide * cellsPerSide) {
            clearInterval(snakeLoop);
            snakeLoop = null;
            snakeOver = true;
            orange = null;
            snakeMessage.textContent = "You win! CAPY ate the whole board!";
        } else {
            orange = spawnOrange();

            const newDelay = Math.max(
                55,
                150 - Math.floor(snakeScore / 3) * 20
            );

            if (newDelay !== snakeMoveDelay) {
                snakeMoveDelay = newDelay;

                clearInterval(snakeLoop);
                snakeLoop = setInterval(moveSnake, snakeMoveDelay);
            }

            snakeMessage.textContent = "Orange collected! Score: " + snakeScore;
        }
    } else {
        snake.pop();
    }

drawSnakeBoard();
}

function startSnake() {
    if (snakeLoop !== null || snakeOver) return;

    snakeLoop = setInterval(moveSnake, snakeMoveDelay);
    snakeMessage.textContent = "Use arrow keys to move!";
}

function pauseSnake() {
    if (snakeLoop === null) return;

    clearInterval(snakeLoop);
    snakeLoop = null;
    snakeMessage.textContent = "Paused. CAPY is resting.";
}

document.getElementById("snakeStart").addEventListener("click", startSnake);
document.getElementById("snakePause").addEventListener("click", pauseSnake);
document.getElementById("closeSnake").addEventListener("click", pauseSnake);

document.getElementById("snakeRestart").addEventListener("click", function() {
    clearInterval(snakeLoop);
    snakeLoop = null;
    snakeOver = false;
    snakeMoveDelay = 150;
    snakeScore = 0;
    snakeScoreDisplay.textContent = "0";

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    orange = { x: 15, y: 8 };
    snakeDirection = { x: 1, y: 0 };
    nextSnakeDirection = { x: 1, y: 0};

    drawSnakeBoard();
    startSnake();
});

document.addEventListener("keydown", function(event) {
    const windowElement = document.getElementById("snakeWindow");

    if (windowElement.hidden || windowElement.classList.contains("closing")) return;

    if (event.target && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;

    const directions = {
        ArrowUp: { x: 0, y: -1},
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const requested = directions[event.key];
    if (!requested) return;

    event.preventDefault();

    if (requested.x === -snakeDirection.x && requested.y === -snakeDirection.y) return;

    nextSnakeDirection = requested;
});