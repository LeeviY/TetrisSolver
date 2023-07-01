const { step, getNextPiece } = require("../src/app");

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

const boardMatrix = Array(20)
    .fill("")
    .map(() => Array(10).fill(""));

document.addEventListener("DOMContentLoaded", async () => {
    // for (let i = 0; i < 1; i++) {
    //     const nextPiece = getNextPiece();
    //     drawMatrix(step(nextPiece), nextPiece);
    //     await new Promise((r) => setTimeout(r, 1000));
    // }
    const button = document.getElementById("drop-piece-button");
    button.addEventListener("click", () => {
        const nextPiece = getNextPiece();
        drawMatrix(step(nextPiece), nextPiece);
    });
});

function drawStep() {
    drawMatrix();
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockWidth, blockHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, blockWidth, blockHeight);
}

function drawMatrix(matrix, piece) {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            const bit = (matrix[row] >> (9 - col)) & 1;
            if (bit !== 0 && boardMatrix[row][col] === "") {
                boardMatrix[row][col] = piece;
            }
            const block = colorMap[boardMatrix[row][col]];
            const color = block ? block : "white";
            drawBlock(col * blockWidth, row * blockHeight, color);
        }
    }
}
