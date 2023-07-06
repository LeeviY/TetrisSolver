const { step, resetBoard } = require("./App");
const { StockBird } = require("./StockBird");
const { Tetriminos } = require("./Tetriminos");
const { GeneticAlgorithm } = require("./Genetic");

const canvas = document.getElementById("tetris-board");
const ctx = canvas.getContext("2d");

const blockWidth = canvas.width / 10;
const blockHeight = canvas.height / 20;

const colorMap = {
    I: "Cyan",
    O: "Yellow",
    T: "Magenta",
    J: "Blue",
    L: "Orange",
    S: "SpringGreen",
    Z: "Red",
};

let boardMatrix = Array(20)
    .fill("")
    .map(() => Array(10).fill(""));

let isRunning = false;
let sliderValue = 0;
let didLose = false;
let pieceCounter = 0;

const lookaheadSlots = Array.from(document.getElementsByClassName("lookahead"), (c) =>
    c.getContext("2d")
);

document.addEventListener("DOMContentLoaded", async () => {
    drawEmpty();

    const counter = document.getElementById("counter");
    function incrementCounter() {
        pieceCounter++;
        counter.innerText = pieceCounter;
    }
    function resetCounter() {
        pieceCounter = 0;
        counter.innerText = pieceCounter;
    }

    const slider = document.getElementById("speed-slider");
    sliderValue = (slider.value - 1) ** 4 * 1000;

    slider.addEventListener("input", function () {
        sliderValue = (slider.value - 1) ** 4 * 1000;
    });

    document.getElementById("drop-button").addEventListener("click", () => {
        stepOne();
    });

    // Kinda cursed but it works.
    document.getElementById("start-stop-button").addEventListener("click", async (event) => {
        if (didLose) {
            resetBoard();
            drawEmpty();
            resetCounter();
            didLose = false;
        }

        isRunning = !isRunning;
        event.target.innerText = isRunning ? "Stop" : "Start";

        while (isRunning) {
            const lost = stepOne();
            if (lost) {
                isRunning = false;
                event.target.innerText = "Start";
                didLose = true;
            }

            incrementCounter();
            await new Promise((r) => setTimeout(r, sliderValue));
        }
    });

    document.getElementById("reset-button").addEventListener("click", async () => {
        resetBoard();
        drawEmpty();
        resetCounter();
    });

    document.getElementById("train-button").addEventListener("click", async () => {
        const alg = new GeneticAlgorithm(100);
        alg.run();
    });
});

function stepOne() {
    const newBoard = step();
    drawBoard(newBoard.board, newBoard.piece);
    drawLookahead(newBoard.lookahead);
    return newBoard.isLost;
}

function drawBlock(canvas, x, y, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, blockWidth, blockHeight);
    canvas.strokeStyle = "black";
    canvas.strokeRect(x, y, blockWidth, blockHeight);
}

function drawBoard(board, piece) {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            const bit = (board[row] >> (9 - col)) & 1;
            if (bit !== 0 && boardMatrix[row][col] === "") {
                boardMatrix[row][col] = piece;
            } else if (bit === 0) {
                boardMatrix[row][col] = "";
            }
            const block = colorMap[boardMatrix[row][col]];
            const color = block ? block : "white";
            drawBlock(ctx, col * blockWidth, row * blockHeight, color);
        }
    }
}

function drawLookahead(lookahead) {
    for (let i = 0; i < lookaheadSlots.length; i++) {
        const slot = lookaheadSlots[i];
        slot.clearRect(0, 0, slot.canvas.width, slot.canvas.height);

        const piece = Tetriminos.get(lookahead[i])[0];
        const pieceWidth = Math.floor(Math.log2(piece.reduce((or, x) => or | x, 0))) + 1;

        const color = colorMap[lookahead[i]];

        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < pieceWidth; x++) {
                const bit = (piece[y] >> x) & 1;
                if (bit !== 0) {
                    drawBlock(slot, y * blockHeight, x * blockWidth, color);
                }
            }
        }
    }
}

function drawEmpty() {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            drawBlock(ctx, col * blockWidth, row * blockHeight, "white");
        }
    }
    for (let i = 0; i < lookaheadSlots.length; i++) {
        const slot = lookaheadSlots[i];
        slot.clearRect(0, 0, slot.canvas.width, slot.canvas.height);
    }
}
