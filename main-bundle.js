/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetBoard = exports.step = void 0;
const StockBird_1 = __webpack_require__(/*! ./StockBird */ "./src/StockBird.ts");
const Board_1 = __webpack_require__(/*! ./Board */ "./src/Board.ts");
const Tetriminos_1 = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
const boardClass = new Board_1.Board();
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
let board = Array(20).fill(0);
function step() {
    const nextPieceType = boardClass.getNextPiece();
    const nextPieces = Tetriminos_1.Tetriminos.get(nextPieceType);
    if (!nextPieces)
        throw new Error("Unkown piece type");
    const bestMove = {
        column: 0,
        rotation: 0,
        score: -1234,
    };
    for (let col = 0; col < 10; col++) {
        for (let r = 0; r < nextPieces.length; r++) {
            const [newBoard, lost] = Board_1.Board.dropPiece([...board], nextPieceType, r, col);
            if (lost)
                continue;
            const score = StockBird_1.StockBird.calcScoreNormalized(newBoard);
            if (score > bestMove.score) {
                bestMove.column = col;
                bestMove.rotation = r;
                bestMove.score = score;
            }
        }
    }
    let lost;
    [board, lost] = Board_1.Board.dropPiece([...board], nextPieceType, bestMove.rotation, bestMove.column);
    board = Board_1.Board.clearLines(board);
    return {
        board: board,
        piece: nextPieceType,
        isLost: lost,
    };
}
exports.step = step;
function resetBoard() {
    board = Array(20).fill(0);
}
exports.resetBoard = resetBoard;


/***/ }),

/***/ "./src/Board.ts":
/*!**********************!*\
  !*** ./src/Board.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
const Tetriminos_1 = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
class Board {
    constructor() {
        this._shuffledPieces = [];
        this._currentIndex = 0;
    }
    static printBoard(board) {
        const boardString = board
            .map((value, index) => {
            const row = `${index.toString().padStart(2)} |${value
                .toString(2)
                .padStart(10, "0")
                .replaceAll("0", "  ")
                .replaceAll("1", " ■")}`;
            return row;
        })
            .join("\n");
        console.log(boardString);
        console.log("------------------------");
        console.log("   | 0 1 2 3 4 5 6 7 8 9");
    }
    // public getBoard(): number[] {
    //     return this._board;
    // }
    static dropPiece(board, piece, rotation, column) {
        const pieceShapes = Tetriminos_1.Tetriminos.get(piece);
        if (!pieceShapes) {
            throw new Error("Invalid piece type");
        }
        const pieceShape = pieceShapes[rotation];
        // console.log(pieceShape);
        // Shift piece to correct column.
        const pieceWidth = Math.floor(Math.log2(pieceShape.reduce((or, x) => or | x, 0))) + 1;
        let shiftedPiece = [...pieceShape];
        for (let i = 0; i < pieceShape.length; i++) {
            // shiftedPiece[i] = (pieceShape[i] << 10) >> Math.min(pieceWidth + column, 10);
            shiftedPiece[i] = pieceShape[i] << Math.max(10 - (pieceWidth + column), 0);
        }
        // console.log(`piece: ${piece} column: ${column} width: ${pieceWidth}`);
        // shiftedPiece.forEach((x) => {
        //     console.log(x.toString(2).padStart(10, "0").replace(/0/g, ".").replace(/1/g, "■"));
        // });
        // console.log("go to: ", board.length - pieceShape.length);
        // Find row before where piece overlaps with existing pieces.
        let y = 0;
        out: for (; y < board.length - pieceShape.length + 1; y++) {
            for (let pieceY = 0; pieceY < pieceShape.length; pieceY++) {
                if (board[y + pieceY] & shiftedPiece[pieceY]) {
                    y--;
                    break out;
                }
            }
        }
        y = Math.min(board.length - pieceShape.length, y);
        // Add new piece to the board.
        for (let i = 0; i < shiftedPiece.length; i++) {
            board[y + i] |= shiftedPiece[i];
        }
        return [board, y - pieceShape.length < 0];
    }
    static clearLines(board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0b1111111111) {
                board[i] = 0;
            }
        }
        for (let i = board.length - 1; i >= 0; i--) {
            if (board[i] === 0) {
                for (let j = i - 1; j >= 0; j--) {
                    if (board[j] !== 0) {
                        board[i] = board[j];
                        board[j] = 0;
                        break;
                    }
                }
            }
        }
        return board;
    }
    shufflePieces() {
        this._shuffledPieces = [...Tetriminos_1.PieceLetters];
        for (let i = this._shuffledPieces.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this._shuffledPieces[i], this._shuffledPieces[randomIndex]] = [
                this._shuffledPieces[randomIndex],
                this._shuffledPieces[i],
            ];
        }
        this._currentIndex = 0;
    }
    getNextPiece() {
        if (this._currentIndex >= this._shuffledPieces.length) {
            this.shufflePieces();
        }
        const nextPiece = this._shuffledPieces[this._currentIndex];
        this._currentIndex++;
        return nextPiece;
    }
}
exports.Board = Board;


/***/ }),

/***/ "./src/StockBird.ts":
/*!**************************!*\
  !*** ./src/StockBird.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StockBird = void 0;
class StockBird {
    static calcScore(matrix) {
        const heights = StockBird.clacHeights(matrix);
        // console.log("heights: ", heights);
        // console.log("total height: ", /*-0.510066 * */ StockBird.clacTotalHeight(heights));
        // console.log("complete lines: ", /* 0.760666 * */ StockBird.countCompleteLines(matrix));
        // console.log("holes: ", /*-0.35663 * */ StockBird.countHoles(matrix));
        // console.log("bumpiness: ", /*-0.184483 * */ StockBird.calcBumpiness(heights));
        const score = -0.510066 * StockBird.clacTotalHeight(heights) +
            0.760666 * StockBird.countCompleteLines(matrix) +
            -0.35663 * StockBird.countHoles(matrix) +
            -0.184483 * StockBird.calcBumpiness(heights);
        // console.log("score: ", score);
        return score;
    }
    static calcScoreNormalized(matrix) {
        const heights = StockBird.clacHeights(matrix);
        //-console.log(StockBird.clacTotalHeight(heights) / 180);
        //console.log(StockBird.countCompleteLines(matrix) / 4);
        //-console.log(StockBird.countHoles(matrix) / 100);
        //-console.log(StockBird.calcBumpiness(heights) / 180);
        return (-StockBird.clacTotalHeight(heights) / 180 +
            StockBird.countCompleteLines(matrix) / 4 +
            -StockBird.countHoles(matrix) / 100 +
            -StockBird.calcBumpiness(heights) / 180);
    }
    static clacHeights(matrix) {
        const heights = Array(10).fill(0);
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                if (heights[x] === 0 && (matrix[y] << x) & 0b10000000000) {
                    heights[x] = 20 - y;
                }
            }
        }
        return heights;
    }
    static clacTotalHeight(heights) {
        return heights.reduce((sum, x) => sum + x, 0);
    }
    static countCompleteLines(matrix) {
        let count = 0;
        matrix.forEach((row) => {
            if (row === 1023)
                count++;
        });
        return count;
    }
    static countHoles(matrix) {
        let count = 0;
        for (let y = 0; y < 19; y++) {
            for (let x = 0; x < 10; x++) {
                if ((matrix[y] >> x) & 1 && !((matrix[y + 1] >> x) & 1))
                    count++;
            }
        }
        return count;
    }
    static calcBumpiness(heights) {
        let bumpiness = 0;
        for (let i = 0; i < heights.length - 1; i++) {
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }
        return bumpiness;
    }
}
exports.StockBird = StockBird;


/***/ }),

/***/ "./src/Tetriminos.ts":
/*!***************************!*\
  !*** ./src/Tetriminos.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tetriminos = exports.PieceLetters = void 0;
exports.PieceLetters = ["I", "J", "L", "O", "S", "T", "Z"];
exports.Tetriminos = new Map([
    [
        "J",
        [
            [0b01, 0b01, 0b11],
            [0b111, 0b001],
            [0b11, 0b10, 0b10],
            [0b100, 0b111],
        ],
    ],
    [
        "L",
        [
            [0b10, 0b10, 0b11],
            [0b111, 0b100],
            [0b11, 0b01, 0b01],
            [0b001, 0b111],
        ],
    ],
    ["I", [[0b1, 0b1, 0b1, 0b1], [0b1111]]],
    ["O", [[0b11, 0b11]]],
    [
        "T",
        [
            [0b010, 0b111],
            [0b10, 0b11, 0b10],
            [0b111, 0b010],
            [0b01, 0b11, 0b01],
        ],
    ],
    [
        "S",
        [
            [0b011, 0b110],
            [0b10, 0b11, 0b01],
        ],
    ],
    [
        "Z",
        [
            [0b110, 0b011],
            [0b01, 0b11, 0b10],
        ],
    ],
]);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const { step, resetBoard } = __webpack_require__(/*! ./App */ "./src/App.ts");
const { StockBird } = __webpack_require__(/*! ./StockBird */ "./src/StockBird.ts");

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

document.addEventListener("DOMContentLoaded", async () => {
    drawEmpty();

    const slider = document.getElementById("speed-slider");
    sliderValue = (slider.value - 1) ** 4 * 1000;

    slider.addEventListener("input", function () {
        sliderValue = (slider.value - 1) ** 4 * 1000;
        console.log(sliderValue);
    });

    document.getElementById("drop-button").addEventListener("click", () => {
        const newBoard = step();
        drawBoard(newBoard.board, newBoard.piece);
    });

    // Kinda cursed but it works.
    document.getElementById("start-stop-button").addEventListener("click", async (event) => {
        if (didLose) {
            resetBoard();
            drawEmpty();
            didLose = false;
        }

        isRunning = !isRunning;
        event.target.innerText = isRunning ? "Stop" : "Start";

        while (isRunning) {
            const newBoard = step();
            drawBoard(newBoard.board, newBoard.piece);
            if (newBoard.isLost) {
                isRunning = false;
                event.target.innerText = "Start";
                didLose = true;
            }

            await new Promise((r) => setTimeout(r, sliderValue));
        }
    });

    document.getElementById("reset-button").addEventListener("click", async () => {
        resetBoard();
        drawEmpty();
    });
});

function drawStep() {
    drawBoard();
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockWidth, blockHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, blockWidth, blockHeight);
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
            drawBlock(col * blockWidth, row * blockHeight, color);
        }
    }
}

function drawEmpty() {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            drawBlock(col * blockWidth, row * blockHeight, "white");
        }
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFrQixHQUFHLFlBQVk7QUFDakMsb0JBQW9CLG1CQUFPLENBQUMsdUNBQWE7QUFDekMsZ0JBQWdCLG1CQUFPLENBQUMsK0JBQVM7QUFDakMscUJBQXFCLG1CQUFPLENBQUMseUNBQWM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7Ozs7Ozs7Ozs7O0FDL0NMO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYixxQkFBcUIsbUJBQU8sQ0FBQyx5Q0FBYztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDhCQUE4QixHQUFHO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxPQUFPLFVBQVUsUUFBUSxTQUFTLFdBQVc7QUFDOUU7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMENBQTBDO0FBQzlELGlDQUFpQyw0QkFBNEI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrQkFBa0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsUUFBUTtBQUMvQztBQUNBLG9DQUFvQyxRQUFRO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7Ozs7Ozs7QUN0R0E7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3QkFBd0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7Ozs7Ozs7O0FDckVKO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFrQixHQUFHLG9CQUFvQjtBQUN6QyxvQkFBb0I7QUFDcEIsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNoREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7O0FDdEJBLFFBQVEsbUJBQW1CLEVBQUUsbUJBQU8sQ0FBQywyQkFBTztBQUM1QyxRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLHVDQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyLy4vc3JjL0FwcC50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyLy4vc3JjL0JvYXJkLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvU3RvY2tCaXJkLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvVGV0cmltaW5vcy50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlc2V0Qm9hcmQgPSBleHBvcnRzLnN0ZXAgPSB2b2lkIDA7XG5jb25zdCBTdG9ja0JpcmRfMSA9IHJlcXVpcmUoXCIuL1N0b2NrQmlyZFwiKTtcbmNvbnN0IEJvYXJkXzEgPSByZXF1aXJlKFwiLi9Cb2FyZFwiKTtcbmNvbnN0IFRldHJpbWlub3NfMSA9IHJlcXVpcmUoXCIuL1RldHJpbWlub3NcIik7XG5jb25zdCBib2FyZENsYXNzID0gbmV3IEJvYXJkXzEuQm9hcmQoKTtcbmZ1bmN0aW9uIGdldFJhbmRvbUluUmFuZ2UobWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xufVxubGV0IGJvYXJkID0gQXJyYXkoMjApLmZpbGwoMCk7XG5mdW5jdGlvbiBzdGVwKCkge1xuICAgIGNvbnN0IG5leHRQaWVjZVR5cGUgPSBib2FyZENsYXNzLmdldE5leHRQaWVjZSgpO1xuICAgIGNvbnN0IG5leHRQaWVjZXMgPSBUZXRyaW1pbm9zXzEuVGV0cmltaW5vcy5nZXQobmV4dFBpZWNlVHlwZSk7XG4gICAgaWYgKCFuZXh0UGllY2VzKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGllY2UgdHlwZVwiKTtcbiAgICBjb25zdCBiZXN0TW92ZSA9IHtcbiAgICAgICAgY29sdW1uOiAwLFxuICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgc2NvcmU6IC0xMjM0LFxuICAgIH07XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgbmV4dFBpZWNlcy5sZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgY29uc3QgW25ld0JvYXJkLCBsb3N0XSA9IEJvYXJkXzEuQm9hcmQuZHJvcFBpZWNlKFsuLi5ib2FyZF0sIG5leHRQaWVjZVR5cGUsIHIsIGNvbCk7XG4gICAgICAgICAgICBpZiAobG9zdClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IHNjb3JlID0gU3RvY2tCaXJkXzEuU3RvY2tCaXJkLmNhbGNTY29yZU5vcm1hbGl6ZWQobmV3Qm9hcmQpO1xuICAgICAgICAgICAgaWYgKHNjb3JlID4gYmVzdE1vdmUuc2NvcmUpIHtcbiAgICAgICAgICAgICAgICBiZXN0TW92ZS5jb2x1bW4gPSBjb2w7XG4gICAgICAgICAgICAgICAgYmVzdE1vdmUucm90YXRpb24gPSByO1xuICAgICAgICAgICAgICAgIGJlc3RNb3ZlLnNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGxvc3Q7XG4gICAgW2JvYXJkLCBsb3N0XSA9IEJvYXJkXzEuQm9hcmQuZHJvcFBpZWNlKFsuLi5ib2FyZF0sIG5leHRQaWVjZVR5cGUsIGJlc3RNb3ZlLnJvdGF0aW9uLCBiZXN0TW92ZS5jb2x1bW4pO1xuICAgIGJvYXJkID0gQm9hcmRfMS5Cb2FyZC5jbGVhckxpbmVzKGJvYXJkKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZDogYm9hcmQsXG4gICAgICAgIHBpZWNlOiBuZXh0UGllY2VUeXBlLFxuICAgICAgICBpc0xvc3Q6IGxvc3QsXG4gICAgfTtcbn1cbmV4cG9ydHMuc3RlcCA9IHN0ZXA7XG5mdW5jdGlvbiByZXNldEJvYXJkKCkge1xuICAgIGJvYXJkID0gQXJyYXkoMjApLmZpbGwoMCk7XG59XG5leHBvcnRzLnJlc2V0Qm9hcmQgPSByZXNldEJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkJvYXJkID0gdm9pZCAwO1xuY29uc3QgVGV0cmltaW5vc18xID0gcmVxdWlyZShcIi4vVGV0cmltaW5vc1wiKTtcbmNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fc2h1ZmZsZWRQaWVjZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gMDtcbiAgICB9XG4gICAgc3RhdGljIHByaW50Qm9hcmQoYm9hcmQpIHtcbiAgICAgICAgY29uc3QgYm9hcmRTdHJpbmcgPSBib2FyZFxuICAgICAgICAgICAgLm1hcCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBgJHtpbmRleC50b1N0cmluZygpLnBhZFN0YXJ0KDIpfSB8JHt2YWx1ZVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgIC5wYWRTdGFydCgxMCwgXCIwXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIwXCIsIFwiICBcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcIjFcIiwgXCIg4pagXCIpfWA7XG4gICAgICAgICAgICByZXR1cm4gcm93O1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGJvYXJkU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiICAgfCAwIDEgMiAzIDQgNSA2IDcgOCA5XCIpO1xuICAgIH1cbiAgICAvLyBwdWJsaWMgZ2V0Qm9hcmQoKTogbnVtYmVyW10ge1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5fYm9hcmQ7XG4gICAgLy8gfVxuICAgIHN0YXRpYyBkcm9wUGllY2UoYm9hcmQsIHBpZWNlLCByb3RhdGlvbiwgY29sdW1uKSB7XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGVzID0gVGV0cmltaW5vc18xLlRldHJpbWlub3MuZ2V0KHBpZWNlKTtcbiAgICAgICAgaWYgKCFwaWVjZVNoYXBlcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwaWVjZSB0eXBlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGUgPSBwaWVjZVNoYXBlc1tyb3RhdGlvbl07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBpZWNlU2hhcGUpO1xuICAgICAgICAvLyBTaGlmdCBwaWVjZSB0byBjb3JyZWN0IGNvbHVtbi5cbiAgICAgICAgY29uc3QgcGllY2VXaWR0aCA9IE1hdGguZmxvb3IoTWF0aC5sb2cyKHBpZWNlU2hhcGUucmVkdWNlKChvciwgeCkgPT4gb3IgfCB4LCAwKSkpICsgMTtcbiAgICAgICAgbGV0IHNoaWZ0ZWRQaWVjZSA9IFsuLi5waWVjZVNoYXBlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZVNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBzaGlmdGVkUGllY2VbaV0gPSAocGllY2VTaGFwZVtpXSA8PCAxMCkgPj4gTWF0aC5taW4ocGllY2VXaWR0aCArIGNvbHVtbiwgMTApO1xuICAgICAgICAgICAgc2hpZnRlZFBpZWNlW2ldID0gcGllY2VTaGFwZVtpXSA8PCBNYXRoLm1heCgxMCAtIChwaWVjZVdpZHRoICsgY29sdW1uKSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coYHBpZWNlOiAke3BpZWNlfSBjb2x1bW46ICR7Y29sdW1ufSB3aWR0aDogJHtwaWVjZVdpZHRofWApO1xuICAgICAgICAvLyBzaGlmdGVkUGllY2UuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coeC50b1N0cmluZygyKS5wYWRTdGFydCgxMCwgXCIwXCIpLnJlcGxhY2UoLzAvZywgXCIuXCIpLnJlcGxhY2UoLzEvZywgXCLilqBcIikpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJnbyB0bzogXCIsIGJvYXJkLmxlbmd0aCAtIHBpZWNlU2hhcGUubGVuZ3RoKTtcbiAgICAgICAgLy8gRmluZCByb3cgYmVmb3JlIHdoZXJlIHBpZWNlIG92ZXJsYXBzIHdpdGggZXhpc3RpbmcgcGllY2VzLlxuICAgICAgICBsZXQgeSA9IDA7XG4gICAgICAgIG91dDogZm9yICg7IHkgPCBib2FyZC5sZW5ndGggLSBwaWVjZVNoYXBlLmxlbmd0aCArIDE7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgcGllY2VZID0gMDsgcGllY2VZIDwgcGllY2VTaGFwZS5sZW5ndGg7IHBpZWNlWSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW3kgKyBwaWVjZVldICYgc2hpZnRlZFBpZWNlW3BpZWNlWV0pIHtcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xuICAgICAgICAgICAgICAgICAgICBicmVhayBvdXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHkgPSBNYXRoLm1pbihib2FyZC5sZW5ndGggLSBwaWVjZVNoYXBlLmxlbmd0aCwgeSk7XG4gICAgICAgIC8vIEFkZCBuZXcgcGllY2UgdG8gdGhlIGJvYXJkLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaWZ0ZWRQaWVjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm9hcmRbeSArIGldIHw9IHNoaWZ0ZWRQaWVjZVtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2JvYXJkLCB5IC0gcGllY2VTaGFwZS5sZW5ndGggPCAwXTtcbiAgICB9XG4gICAgc3RhdGljIGNsZWFyTGluZXMoYm9hcmQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2ldID09PSAwYjExMTExMTExMTEpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IGJvYXJkLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbaV0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gaSAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib2FyZFtqXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRbaV0gPSBib2FyZFtqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkW2pdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2FyZDtcbiAgICB9XG4gICAgc2h1ZmZsZVBpZWNlcygpIHtcbiAgICAgICAgdGhpcy5fc2h1ZmZsZWRQaWVjZXMgPSBbLi4uVGV0cmltaW5vc18xLlBpZWNlTGV0dGVyc107XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9zaHVmZmxlZFBpZWNlcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW3RoaXMuX3NodWZmbGVkUGllY2VzW2ldLCB0aGlzLl9zaHVmZmxlZFBpZWNlc1tyYW5kb21JbmRleF1dID0gW1xuICAgICAgICAgICAgICAgIHRoaXMuX3NodWZmbGVkUGllY2VzW3JhbmRvbUluZGV4XSxcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHVmZmxlZFBpZWNlc1tpXSxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gMDtcbiAgICB9XG4gICAgZ2V0TmV4dFBpZWNlKCkge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudEluZGV4ID49IHRoaXMuX3NodWZmbGVkUGllY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zaHVmZmxlUGllY2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV4dFBpZWNlID0gdGhpcy5fc2h1ZmZsZWRQaWVjZXNbdGhpcy5fY3VycmVudEluZGV4XTtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4Kys7XG4gICAgICAgIHJldHVybiBuZXh0UGllY2U7XG4gICAgfVxufVxuZXhwb3J0cy5Cb2FyZCA9IEJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN0b2NrQmlyZCA9IHZvaWQgMDtcbmNsYXNzIFN0b2NrQmlyZCB7XG4gICAgc3RhdGljIGNhbGNTY29yZShtYXRyaXgpIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0cyA9IFN0b2NrQmlyZC5jbGFjSGVpZ2h0cyhtYXRyaXgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhlaWdodHM6IFwiLCBoZWlnaHRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0b3RhbCBoZWlnaHQ6IFwiLCAvKi0wLjUxMDA2NiAqICovIFN0b2NrQmlyZC5jbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbXBsZXRlIGxpbmVzOiBcIiwgLyogMC43NjA2NjYgKiAqLyBTdG9ja0JpcmQuY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhvbGVzOiBcIiwgLyotMC4zNTY2MyAqICovIFN0b2NrQmlyZC5jb3VudEhvbGVzKG1hdHJpeCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJ1bXBpbmVzczogXCIsIC8qLTAuMTg0NDgzICogKi8gU3RvY2tCaXJkLmNhbGNCdW1waW5lc3MoaGVpZ2h0cykpO1xuICAgICAgICBjb25zdCBzY29yZSA9IC0wLjUxMDA2NiAqIFN0b2NrQmlyZC5jbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykgK1xuICAgICAgICAgICAgMC43NjA2NjYgKiBTdG9ja0JpcmQuY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkgK1xuICAgICAgICAgICAgLTAuMzU2NjMgKiBTdG9ja0JpcmQuY291bnRIb2xlcyhtYXRyaXgpICtcbiAgICAgICAgICAgIC0wLjE4NDQ4MyAqIFN0b2NrQmlyZC5jYWxjQnVtcGluZXNzKGhlaWdodHMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjb3JlOiBcIiwgc2NvcmUpO1xuICAgICAgICByZXR1cm4gc2NvcmU7XG4gICAgfVxuICAgIHN0YXRpYyBjYWxjU2NvcmVOb3JtYWxpemVkKG1hdHJpeCkge1xuICAgICAgICBjb25zdCBoZWlnaHRzID0gU3RvY2tCaXJkLmNsYWNIZWlnaHRzKG1hdHJpeCk7XG4gICAgICAgIC8vLWNvbnNvbGUubG9nKFN0b2NrQmlyZC5jbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykgLyAxODApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFN0b2NrQmlyZC5jb3VudENvbXBsZXRlTGluZXMobWF0cml4KSAvIDQpO1xuICAgICAgICAvLy1jb25zb2xlLmxvZyhTdG9ja0JpcmQuY291bnRIb2xlcyhtYXRyaXgpIC8gMTAwKTtcbiAgICAgICAgLy8tY29uc29sZS5sb2coU3RvY2tCaXJkLmNhbGNCdW1waW5lc3MoaGVpZ2h0cykgLyAxODApO1xuICAgICAgICByZXR1cm4gKC1TdG9ja0JpcmQuY2xhY1RvdGFsSGVpZ2h0KGhlaWdodHMpIC8gMTgwICtcbiAgICAgICAgICAgIFN0b2NrQmlyZC5jb3VudENvbXBsZXRlTGluZXMobWF0cml4KSAvIDQgK1xuICAgICAgICAgICAgLVN0b2NrQmlyZC5jb3VudEhvbGVzKG1hdHJpeCkgLyAxMDAgK1xuICAgICAgICAgICAgLVN0b2NrQmlyZC5jYWxjQnVtcGluZXNzKGhlaWdodHMpIC8gMTgwKTtcbiAgICB9XG4gICAgc3RhdGljIGNsYWNIZWlnaHRzKG1hdHJpeCkge1xuICAgICAgICBjb25zdCBoZWlnaHRzID0gQXJyYXkoMTApLmZpbGwoMCk7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMjA7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodHNbeF0gPT09IDAgJiYgKG1hdHJpeFt5XSA8PCB4KSAmIDBiMTAwMDAwMDAwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0c1t4XSA9IDIwIC0geTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlaWdodHM7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykge1xuICAgICAgICByZXR1cm4gaGVpZ2h0cy5yZWR1Y2UoKHN1bSwgeCkgPT4gc3VtICsgeCwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyBjb3VudENvbXBsZXRlTGluZXMobWF0cml4KSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIG1hdHJpeC5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgICAgIGlmIChyb3cgPT09IDEwMjMpXG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG4gICAgc3RhdGljIGNvdW50SG9sZXMobWF0cml4KSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTk7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKChtYXRyaXhbeV0gPj4geCkgJiAxICYmICEoKG1hdHJpeFt5ICsgMV0gPj4geCkgJiAxKSlcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuICAgIHN0YXRpYyBjYWxjQnVtcGluZXNzKGhlaWdodHMpIHtcbiAgICAgICAgbGV0IGJ1bXBpbmVzcyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGJ1bXBpbmVzcyArPSBNYXRoLmFicyhoZWlnaHRzW2ldIC0gaGVpZ2h0c1tpICsgMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidW1waW5lc3M7XG4gICAgfVxufVxuZXhwb3J0cy5TdG9ja0JpcmQgPSBTdG9ja0JpcmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGV0cmltaW5vcyA9IGV4cG9ydHMuUGllY2VMZXR0ZXJzID0gdm9pZCAwO1xuZXhwb3J0cy5QaWVjZUxldHRlcnMgPSBbXCJJXCIsIFwiSlwiLCBcIkxcIiwgXCJPXCIsIFwiU1wiLCBcIlRcIiwgXCJaXCJdO1xuZXhwb3J0cy5UZXRyaW1pbm9zID0gbmV3IE1hcChbXG4gICAgW1xuICAgICAgICBcIkpcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMDEsIDBiMDEsIDBiMTFdLFxuICAgICAgICAgICAgWzBiMTExLCAwYjAwMV0sXG4gICAgICAgICAgICBbMGIxMSwgMGIxMCwgMGIxMF0sXG4gICAgICAgICAgICBbMGIxMDAsIDBiMTExXSxcbiAgICAgICAgXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgXCJMXCIsXG4gICAgICAgIFtcbiAgICAgICAgICAgIFswYjEwLCAwYjEwLCAwYjExXSxcbiAgICAgICAgICAgIFswYjExMSwgMGIxMDBdLFxuICAgICAgICAgICAgWzBiMTEsIDBiMDEsIDBiMDFdLFxuICAgICAgICAgICAgWzBiMDAxLCAwYjExMV0sXG4gICAgICAgIF0sXG4gICAgXSxcbiAgICBbXCJJXCIsIFtbMGIxLCAwYjEsIDBiMSwgMGIxXSwgWzBiMTExMV1dXSxcbiAgICBbXCJPXCIsIFtbMGIxMSwgMGIxMV1dXSxcbiAgICBbXG4gICAgICAgIFwiVFwiLFxuICAgICAgICBbXG4gICAgICAgICAgICBbMGIwMTAsIDBiMTExXSxcbiAgICAgICAgICAgIFswYjEwLCAwYjExLCAwYjEwXSxcbiAgICAgICAgICAgIFswYjExMSwgMGIwMTBdLFxuICAgICAgICAgICAgWzBiMDEsIDBiMTEsIDBiMDFdLFxuICAgICAgICBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBcIlNcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMDExLCAwYjExMF0sXG4gICAgICAgICAgICBbMGIxMCwgMGIxMSwgMGIwMV0sXG4gICAgICAgIF0sXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFwiWlwiLFxuICAgICAgICBbXG4gICAgICAgICAgICBbMGIxMTAsIDBiMDExXSxcbiAgICAgICAgICAgIFswYjAxLCAwYjExLCAwYjEwXSxcbiAgICAgICAgXSxcbiAgICBdLFxuXSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgeyBzdGVwLCByZXNldEJvYXJkIH0gPSByZXF1aXJlKFwiLi9BcHBcIik7XHJcbmNvbnN0IHsgU3RvY2tCaXJkIH0gPSByZXF1aXJlKFwiLi9TdG9ja0JpcmRcIik7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJpcy1ib2FyZFwiKTtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbmNvbnN0IGJsb2NrV2lkdGggPSBjYW52YXMud2lkdGggLyAxMDtcclxuY29uc3QgYmxvY2tIZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gMjA7XHJcblxyXG5jb25zdCBjb2xvck1hcCA9IHtcclxuICAgIEk6IFwiQ3lhblwiLFxyXG4gICAgTzogXCJZZWxsb3dcIixcclxuICAgIFQ6IFwiTWFnZW50YVwiLFxyXG4gICAgSjogXCJCbHVlXCIsXHJcbiAgICBMOiBcIk9yYW5nZVwiLFxyXG4gICAgUzogXCJTcHJpbmdHcmVlblwiLFxyXG4gICAgWjogXCJSZWRcIixcclxufTtcclxuXHJcbmxldCBib2FyZE1hdHJpeCA9IEFycmF5KDIwKVxyXG4gICAgLmZpbGwoXCJcIilcclxuICAgIC5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwoXCJcIikpO1xyXG5cclxubGV0IGlzUnVubmluZyA9IGZhbHNlO1xyXG5sZXQgc2xpZGVyVmFsdWUgPSAwO1xyXG5sZXQgZGlkTG9zZSA9IGZhbHNlO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgZHJhd0VtcHR5KCk7XHJcblxyXG4gICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGVlZC1zbGlkZXJcIik7XHJcbiAgICBzbGlkZXJWYWx1ZSA9IChzbGlkZXIudmFsdWUgLSAxKSAqKiA0ICogMTAwMDtcclxuXHJcbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzbGlkZXJWYWx1ZSA9IChzbGlkZXIudmFsdWUgLSAxKSAqKiA0ICogMTAwMDtcclxuICAgICAgICBjb25zb2xlLmxvZyhzbGlkZXJWYWx1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3AtYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3Qm9hcmQgPSBzdGVwKCk7XHJcbiAgICAgICAgZHJhd0JvYXJkKG5ld0JvYXJkLmJvYXJkLCBuZXdCb2FyZC5waWVjZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBLaW5kYSBjdXJzZWQgYnV0IGl0IHdvcmtzLlxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1zdG9wLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGRpZExvc2UpIHtcclxuICAgICAgICAgICAgcmVzZXRCb2FyZCgpO1xyXG4gICAgICAgICAgICBkcmF3RW1wdHkoKTtcclxuICAgICAgICAgICAgZGlkTG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNSdW5uaW5nID0gIWlzUnVubmluZztcclxuICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gaXNSdW5uaW5nID8gXCJTdG9wXCIgOiBcIlN0YXJ0XCI7XHJcblxyXG4gICAgICAgIHdoaWxlIChpc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3Qm9hcmQgPSBzdGVwKCk7XHJcbiAgICAgICAgICAgIGRyYXdCb2FyZChuZXdCb2FyZC5ib2FyZCwgbmV3Qm9hcmQucGllY2UpO1xyXG4gICAgICAgICAgICBpZiAobmV3Qm9hcmQuaXNMb3N0KSB7XHJcbiAgICAgICAgICAgICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSBcIlN0YXJ0XCI7XHJcbiAgICAgICAgICAgICAgICBkaWRMb3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgc2xpZGVyVmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0LWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHJlc2V0Qm9hcmQoKTtcclxuICAgICAgICBkcmF3RW1wdHkoKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYXdTdGVwKCkge1xyXG4gICAgZHJhd0JvYXJkKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCbG9jayh4LCB5LCBjb2xvcikge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0JvYXJkKGJvYXJkLCBwaWVjZSkge1xyXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMjA7IHJvdysrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpdCA9IChib2FyZFtyb3ddID4+ICg5IC0gY29sKSkgJiAxO1xyXG4gICAgICAgICAgICBpZiAoYml0ICE9PSAwICYmIGJvYXJkTWF0cml4W3Jvd11bY29sXSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYm9hcmRNYXRyaXhbcm93XVtjb2xdID0gcGllY2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYml0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBib2FyZE1hdHJpeFtyb3ddW2NvbF0gPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gY29sb3JNYXBbYm9hcmRNYXRyaXhbcm93XVtjb2xdXTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBibG9jayA/IGJsb2NrIDogXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICBkcmF3QmxvY2soY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdFbXB0eSgpIHtcclxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDIwOyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xyXG4gICAgICAgICAgICBkcmF3QmxvY2soY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIFwid2hpdGVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==