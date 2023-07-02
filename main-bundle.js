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
            const score = StockBird_1.StockBird.calcScore(newBoard);
            // const score = StockBird.calcScoreNormalized(newBoard);
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
        const score = -0.5 * StockBird.clacTotalHeight(heights) +
            0.8 * StockBird.countCompleteLines(matrix) +
            -1 * StockBird.countHoles(matrix) +
            -0.2 * StockBird.calcBumpiness(heights);
        // console.log("score: ", score);
        return score;
    }
    static calcScoreNormalized(matrix) {
        const heights = StockBird.clacHeights(matrix);
        //-console.log(StockBird.clacTotalHeight(heights) / 180);
        //console.log(StockBird.countCompleteLines(matrix) / 4);
        //-console.log(StockBird.countHoles(matrix) / 100);
        //-console.log(StockBird.calcBumpiness(heights) / 180);
        return (-StockBird.clacTotalHeight(heights) / 200 +
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
let pieceCounter = 0;

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
        const newBoard = step();
        drawBoard(newBoard.board, newBoard.piece);
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
            const newBoard = step();
            drawBoard(newBoard.board, newBoard.piece);
            if (newBoard.isLost) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaERBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxRQUFRLG1CQUFtQixFQUFFLG1CQUFPLENBQUMsMkJBQU87QUFDNUMsUUFBUSxZQUFZLEVBQUUsbUJBQU8sQ0FBQyx1Q0FBYTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyLy4vc3JjL0FwcC50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyLy4vc3JjL0JvYXJkLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvU3RvY2tCaXJkLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvVGV0cmltaW5vcy50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlc2V0Qm9hcmQgPSBleHBvcnRzLnN0ZXAgPSB2b2lkIDA7XG5jb25zdCBTdG9ja0JpcmRfMSA9IHJlcXVpcmUoXCIuL1N0b2NrQmlyZFwiKTtcbmNvbnN0IEJvYXJkXzEgPSByZXF1aXJlKFwiLi9Cb2FyZFwiKTtcbmNvbnN0IFRldHJpbWlub3NfMSA9IHJlcXVpcmUoXCIuL1RldHJpbWlub3NcIik7XG5jb25zdCBib2FyZENsYXNzID0gbmV3IEJvYXJkXzEuQm9hcmQoKTtcbmZ1bmN0aW9uIGdldFJhbmRvbUluUmFuZ2UobWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xufVxubGV0IGJvYXJkID0gQXJyYXkoMjApLmZpbGwoMCk7XG5mdW5jdGlvbiBzdGVwKCkge1xuICAgIGNvbnN0IG5leHRQaWVjZVR5cGUgPSBib2FyZENsYXNzLmdldE5leHRQaWVjZSgpO1xuICAgIGNvbnN0IG5leHRQaWVjZXMgPSBUZXRyaW1pbm9zXzEuVGV0cmltaW5vcy5nZXQobmV4dFBpZWNlVHlwZSk7XG4gICAgaWYgKCFuZXh0UGllY2VzKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGllY2UgdHlwZVwiKTtcbiAgICBjb25zdCBiZXN0TW92ZSA9IHtcbiAgICAgICAgY29sdW1uOiAwLFxuICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgc2NvcmU6IC0xMjM0LFxuICAgIH07XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgbmV4dFBpZWNlcy5sZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgY29uc3QgW25ld0JvYXJkLCBsb3N0XSA9IEJvYXJkXzEuQm9hcmQuZHJvcFBpZWNlKFsuLi5ib2FyZF0sIG5leHRQaWVjZVR5cGUsIHIsIGNvbCk7XG4gICAgICAgICAgICBpZiAobG9zdClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IHNjb3JlID0gU3RvY2tCaXJkXzEuU3RvY2tCaXJkLmNhbGNTY29yZShuZXdCb2FyZCk7XG4gICAgICAgICAgICAvLyBjb25zdCBzY29yZSA9IFN0b2NrQmlyZC5jYWxjU2NvcmVOb3JtYWxpemVkKG5ld0JvYXJkKTtcbiAgICAgICAgICAgIGlmIChzY29yZSA+IGJlc3RNb3ZlLnNjb3JlKSB7XG4gICAgICAgICAgICAgICAgYmVzdE1vdmUuY29sdW1uID0gY29sO1xuICAgICAgICAgICAgICAgIGJlc3RNb3ZlLnJvdGF0aW9uID0gcjtcbiAgICAgICAgICAgICAgICBiZXN0TW92ZS5zY29yZSA9IHNjb3JlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBsb3N0O1xuICAgIFtib2FyZCwgbG9zdF0gPSBCb2FyZF8xLkJvYXJkLmRyb3BQaWVjZShbLi4uYm9hcmRdLCBuZXh0UGllY2VUeXBlLCBiZXN0TW92ZS5yb3RhdGlvbiwgYmVzdE1vdmUuY29sdW1uKTtcbiAgICBib2FyZCA9IEJvYXJkXzEuQm9hcmQuY2xlYXJMaW5lcyhib2FyZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYm9hcmQ6IGJvYXJkLFxuICAgICAgICBwaWVjZTogbmV4dFBpZWNlVHlwZSxcbiAgICAgICAgaXNMb3N0OiBsb3N0LFxuICAgIH07XG59XG5leHBvcnRzLnN0ZXAgPSBzdGVwO1xuZnVuY3Rpb24gcmVzZXRCb2FyZCgpIHtcbiAgICBib2FyZCA9IEFycmF5KDIwKS5maWxsKDApO1xufVxuZXhwb3J0cy5yZXNldEJvYXJkID0gcmVzZXRCb2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Cb2FyZCA9IHZvaWQgMDtcbmNvbnN0IFRldHJpbWlub3NfMSA9IHJlcXVpcmUoXCIuL1RldHJpbWlub3NcIik7XG5jbGFzcyBCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3NodWZmbGVkUGllY2VzID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IDA7XG4gICAgfVxuICAgIHN0YXRpYyBwcmludEJvYXJkKGJvYXJkKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkU3RyaW5nID0gYm9hcmRcbiAgICAgICAgICAgIC5tYXAoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gYCR7aW5kZXgudG9TdHJpbmcoKS5wYWRTdGFydCgyKX0gfCR7dmFsdWVcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAucGFkU3RhcnQoMTAsIFwiMFwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiMFwiLCBcIiAgXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIxXCIsIFwiIOKWoFwiKX1gO1xuICAgICAgICAgICAgcmV0dXJuIHJvdztcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhib2FyZFN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIiAgIHwgMCAxIDIgMyA0IDUgNiA3IDggOVwiKTtcbiAgICB9XG4gICAgLy8gcHVibGljIGdldEJvYXJkKCk6IG51bWJlcltdIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuX2JvYXJkO1xuICAgIC8vIH1cbiAgICBzdGF0aWMgZHJvcFBpZWNlKGJvYXJkLCBwaWVjZSwgcm90YXRpb24sIGNvbHVtbikge1xuICAgICAgICBjb25zdCBwaWVjZVNoYXBlcyA9IFRldHJpbWlub3NfMS5UZXRyaW1pbm9zLmdldChwaWVjZSk7XG4gICAgICAgIGlmICghcGllY2VTaGFwZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGllY2UgdHlwZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaWVjZVNoYXBlID0gcGllY2VTaGFwZXNbcm90YXRpb25dO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwaWVjZVNoYXBlKTtcbiAgICAgICAgLy8gU2hpZnQgcGllY2UgdG8gY29ycmVjdCBjb2x1bW4uXG4gICAgICAgIGNvbnN0IHBpZWNlV2lkdGggPSBNYXRoLmZsb29yKE1hdGgubG9nMihwaWVjZVNoYXBlLnJlZHVjZSgob3IsIHgpID0+IG9yIHwgeCwgMCkpKSArIDE7XG4gICAgICAgIGxldCBzaGlmdGVkUGllY2UgPSBbLi4ucGllY2VTaGFwZV07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gc2hpZnRlZFBpZWNlW2ldID0gKHBpZWNlU2hhcGVbaV0gPDwgMTApID4+IE1hdGgubWluKHBpZWNlV2lkdGggKyBjb2x1bW4sIDEwKTtcbiAgICAgICAgICAgIHNoaWZ0ZWRQaWVjZVtpXSA9IHBpZWNlU2hhcGVbaV0gPDwgTWF0aC5tYXgoMTAgLSAocGllY2VXaWR0aCArIGNvbHVtbiksIDApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBwaWVjZTogJHtwaWVjZX0gY29sdW1uOiAke2NvbHVtbn0gd2lkdGg6ICR7cGllY2VXaWR0aH1gKTtcbiAgICAgICAgLy8gc2hpZnRlZFBpZWNlLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHgudG9TdHJpbmcoMikucGFkU3RhcnQoMTAsIFwiMFwiKS5yZXBsYWNlKC8wL2csIFwiLlwiKS5yZXBsYWNlKC8xL2csIFwi4pagXCIpKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ28gdG86IFwiLCBib2FyZC5sZW5ndGggLSBwaWVjZVNoYXBlLmxlbmd0aCk7XG4gICAgICAgIC8vIEZpbmQgcm93IGJlZm9yZSB3aGVyZSBwaWVjZSBvdmVybGFwcyB3aXRoIGV4aXN0aW5nIHBpZWNlcy5cbiAgICAgICAgbGV0IHkgPSAwO1xuICAgICAgICBvdXQ6IGZvciAoOyB5IDwgYm9hcmQubGVuZ3RoIC0gcGllY2VTaGFwZS5sZW5ndGggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBpZWNlWSA9IDA7IHBpZWNlWSA8IHBpZWNlU2hhcGUubGVuZ3RoOyBwaWVjZVkrKykge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZFt5ICsgcGllY2VZXSAmIHNoaWZ0ZWRQaWVjZVtwaWVjZVldKSB7XG4gICAgICAgICAgICAgICAgICAgIHktLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB5ID0gTWF0aC5taW4oYm9hcmQubGVuZ3RoIC0gcGllY2VTaGFwZS5sZW5ndGgsIHkpO1xuICAgICAgICAvLyBBZGQgbmV3IHBpZWNlIHRvIHRoZSBib2FyZC5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlmdGVkUGllY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJvYXJkW3kgKyBpXSB8PSBzaGlmdGVkUGllY2VbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtib2FyZCwgeSAtIHBpZWNlU2hhcGUubGVuZ3RoIDwgMF07XG4gICAgfVxuICAgIHN0YXRpYyBjbGVhckxpbmVzKGJvYXJkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXSA9PT0gMGIxMTExMTExMTExKSB7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBib2FyZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKGJvYXJkW2ldID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYm9hcmRbal0gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkW2ldID0gYm9hcmRbal07XG4gICAgICAgICAgICAgICAgICAgICAgICBib2FyZFtqXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9hcmQ7XG4gICAgfVxuICAgIHNodWZmbGVQaWVjZXMoKSB7XG4gICAgICAgIHRoaXMuX3NodWZmbGVkUGllY2VzID0gWy4uLlRldHJpbWlub3NfMS5QaWVjZUxldHRlcnNdO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fc2h1ZmZsZWRQaWVjZXMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIFt0aGlzLl9zaHVmZmxlZFBpZWNlc1tpXSwgdGhpcy5fc2h1ZmZsZWRQaWVjZXNbcmFuZG9tSW5kZXhdXSA9IFtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHVmZmxlZFBpZWNlc1tyYW5kb21JbmRleF0sXG4gICAgICAgICAgICAgICAgdGhpcy5fc2h1ZmZsZWRQaWVjZXNbaV0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IDA7XG4gICAgfVxuICAgIGdldE5leHRQaWVjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbmRleCA+PSB0aGlzLl9zaHVmZmxlZFBpZWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2h1ZmZsZVBpZWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHRQaWVjZSA9IHRoaXMuX3NodWZmbGVkUGllY2VzW3RoaXMuX2N1cnJlbnRJbmRleF07XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCsrO1xuICAgICAgICByZXR1cm4gbmV4dFBpZWNlO1xuICAgIH1cbn1cbmV4cG9ydHMuQm9hcmQgPSBCb2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdG9ja0JpcmQgPSB2b2lkIDA7XG5jbGFzcyBTdG9ja0JpcmQge1xuICAgIHN0YXRpYyBjYWxjU2NvcmUobWF0cml4KSB7XG4gICAgICAgIGNvbnN0IGhlaWdodHMgPSBTdG9ja0JpcmQuY2xhY0hlaWdodHMobWF0cml4KTtcbiAgICAgICAgY29uc3Qgc2NvcmUgPSAtMC41ICogU3RvY2tCaXJkLmNsYWNUb3RhbEhlaWdodChoZWlnaHRzKSArXG4gICAgICAgICAgICAwLjggKiBTdG9ja0JpcmQuY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkgK1xuICAgICAgICAgICAgLTEgKiBTdG9ja0JpcmQuY291bnRIb2xlcyhtYXRyaXgpICtcbiAgICAgICAgICAgIC0wLjIgKiBTdG9ja0JpcmQuY2FsY0J1bXBpbmVzcyhoZWlnaHRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY29yZTogXCIsIHNjb3JlKTtcbiAgICAgICAgcmV0dXJuIHNjb3JlO1xuICAgIH1cbiAgICBzdGF0aWMgY2FsY1Njb3JlTm9ybWFsaXplZChtYXRyaXgpIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0cyA9IFN0b2NrQmlyZC5jbGFjSGVpZ2h0cyhtYXRyaXgpO1xuICAgICAgICAvLy1jb25zb2xlLmxvZyhTdG9ja0JpcmQuY2xhY1RvdGFsSGVpZ2h0KGhlaWdodHMpIC8gMTgwKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhTdG9ja0JpcmQuY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkgLyA0KTtcbiAgICAgICAgLy8tY29uc29sZS5sb2coU3RvY2tCaXJkLmNvdW50SG9sZXMobWF0cml4KSAvIDEwMCk7XG4gICAgICAgIC8vLWNvbnNvbGUubG9nKFN0b2NrQmlyZC5jYWxjQnVtcGluZXNzKGhlaWdodHMpIC8gMTgwKTtcbiAgICAgICAgcmV0dXJuICgtU3RvY2tCaXJkLmNsYWNUb3RhbEhlaWdodChoZWlnaHRzKSAvIDIwMCArXG4gICAgICAgICAgICBTdG9ja0JpcmQuY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkgLyA0ICtcbiAgICAgICAgICAgIC1TdG9ja0JpcmQuY291bnRIb2xlcyhtYXRyaXgpIC8gMTAwICtcbiAgICAgICAgICAgIC1TdG9ja0JpcmQuY2FsY0J1bXBpbmVzcyhoZWlnaHRzKSAvIDE4MCk7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFjSGVpZ2h0cyhtYXRyaXgpIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0cyA9IEFycmF5KDEwKS5maWxsKDApO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDIwOyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmIChoZWlnaHRzW3hdID09PSAwICYmIChtYXRyaXhbeV0gPDwgeCkgJiAwYjEwMDAwMDAwMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodHNbeF0gPSAyMCAtIHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZWlnaHRzO1xuICAgIH1cbiAgICBzdGF0aWMgY2xhY1RvdGFsSGVpZ2h0KGhlaWdodHMpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodHMucmVkdWNlKChzdW0sIHgpID0+IHN1bSArIHgsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgY291bnRDb21wbGV0ZUxpbmVzKG1hdHJpeCkge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBtYXRyaXguZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICBpZiAocm93ID09PSAxMDIzKVxuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuICAgIHN0YXRpYyBjb3VudEhvbGVzKG1hdHJpeCkge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDE5OyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICgobWF0cml4W3ldID4+IHgpICYgMSAmJiAhKChtYXRyaXhbeSArIDFdID4+IHgpICYgMSkpXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cbiAgICBzdGF0aWMgY2FsY0J1bXBpbmVzcyhoZWlnaHRzKSB7XG4gICAgICAgIGxldCBidW1waW5lc3MgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlaWdodHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBidW1waW5lc3MgKz0gTWF0aC5hYnMoaGVpZ2h0c1tpXSAtIGhlaWdodHNbaSArIDFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVtcGluZXNzO1xuICAgIH1cbn1cbmV4cG9ydHMuU3RvY2tCaXJkID0gU3RvY2tCaXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRldHJpbWlub3MgPSBleHBvcnRzLlBpZWNlTGV0dGVycyA9IHZvaWQgMDtcbmV4cG9ydHMuUGllY2VMZXR0ZXJzID0gW1wiSVwiLCBcIkpcIiwgXCJMXCIsIFwiT1wiLCBcIlNcIiwgXCJUXCIsIFwiWlwiXTtcbmV4cG9ydHMuVGV0cmltaW5vcyA9IG5ldyBNYXAoW1xuICAgIFtcbiAgICAgICAgXCJKXCIsXG4gICAgICAgIFtcbiAgICAgICAgICAgIFswYjAxLCAwYjAxLCAwYjExXSxcbiAgICAgICAgICAgIFswYjExMSwgMGIwMDFdLFxuICAgICAgICAgICAgWzBiMTEsIDBiMTAsIDBiMTBdLFxuICAgICAgICAgICAgWzBiMTAwLCAwYjExMV0sXG4gICAgICAgIF0sXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFwiTFwiLFxuICAgICAgICBbXG4gICAgICAgICAgICBbMGIxMCwgMGIxMCwgMGIxMV0sXG4gICAgICAgICAgICBbMGIxMTEsIDBiMTAwXSxcbiAgICAgICAgICAgIFswYjExLCAwYjAxLCAwYjAxXSxcbiAgICAgICAgICAgIFswYjAwMSwgMGIxMTFdLFxuICAgICAgICBdLFxuICAgIF0sXG4gICAgW1wiSVwiLCBbWzBiMSwgMGIxLCAwYjEsIDBiMV0sIFswYjExMTFdXV0sXG4gICAgW1wiT1wiLCBbWzBiMTEsIDBiMTFdXV0sXG4gICAgW1xuICAgICAgICBcIlRcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMDEwLCAwYjExMV0sXG4gICAgICAgICAgICBbMGIxMCwgMGIxMSwgMGIxMF0sXG4gICAgICAgICAgICBbMGIxMTEsIDBiMDEwXSxcbiAgICAgICAgICAgIFswYjAxLCAwYjExLCAwYjAxXSxcbiAgICAgICAgXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgXCJTXCIsXG4gICAgICAgIFtcbiAgICAgICAgICAgIFswYjAxMSwgMGIxMTBdLFxuICAgICAgICAgICAgWzBiMTAsIDBiMTEsIDBiMDFdLFxuICAgICAgICBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBcIlpcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMTEwLCAwYjAxMV0sXG4gICAgICAgICAgICBbMGIwMSwgMGIxMSwgMGIxMF0sXG4gICAgICAgIF0sXG4gICAgXSxcbl0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IHsgc3RlcCwgcmVzZXRCb2FyZCB9ID0gcmVxdWlyZShcIi4vQXBwXCIpO1xyXG5jb25zdCB7IFN0b2NrQmlyZCB9ID0gcmVxdWlyZShcIi4vU3RvY2tCaXJkXCIpO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyaXMtYm9hcmRcIik7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5jb25zdCBibG9ja1dpZHRoID0gY2FudmFzLndpZHRoIC8gMTA7XHJcbmNvbnN0IGJsb2NrSGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIDIwO1xyXG5cclxuY29uc3QgY29sb3JNYXAgPSB7XHJcbiAgICBJOiBcIkN5YW5cIixcclxuICAgIE86IFwiWWVsbG93XCIsXHJcbiAgICBUOiBcIk1hZ2VudGFcIixcclxuICAgIEo6IFwiQmx1ZVwiLFxyXG4gICAgTDogXCJPcmFuZ2VcIixcclxuICAgIFM6IFwiU3ByaW5nR3JlZW5cIixcclxuICAgIFo6IFwiUmVkXCIsXHJcbn07XHJcblxyXG5sZXQgYm9hcmRNYXRyaXggPSBBcnJheSgyMClcclxuICAgIC5maWxsKFwiXCIpXHJcbiAgICAubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKFwiXCIpKTtcclxuXHJcbmxldCBpc1J1bm5pbmcgPSBmYWxzZTtcclxubGV0IHNsaWRlclZhbHVlID0gMDtcclxubGV0IGRpZExvc2UgPSBmYWxzZTtcclxubGV0IHBpZWNlQ291bnRlciA9IDA7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBkcmF3RW1wdHkoKTtcclxuXHJcbiAgICBjb25zdCBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3VudGVyXCIpO1xyXG4gICAgZnVuY3Rpb24gaW5jcmVtZW50Q291bnRlcigpIHtcclxuICAgICAgICBwaWVjZUNvdW50ZXIrKztcclxuICAgICAgICBjb3VudGVyLmlubmVyVGV4dCA9IHBpZWNlQ291bnRlcjtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlc2V0Q291bnRlcigpIHtcclxuICAgICAgICBwaWVjZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIGNvdW50ZXIuaW5uZXJUZXh0ID0gcGllY2VDb3VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3BlZWQtc2xpZGVyXCIpO1xyXG4gICAgc2xpZGVyVmFsdWUgPSAoc2xpZGVyLnZhbHVlIC0gMSkgKiogNCAqIDEwMDA7XHJcblxyXG4gICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2xpZGVyVmFsdWUgPSAoc2xpZGVyLnZhbHVlIC0gMSkgKiogNCAqIDEwMDA7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3AtYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3Qm9hcmQgPSBzdGVwKCk7XHJcbiAgICAgICAgZHJhd0JvYXJkKG5ld0JvYXJkLmJvYXJkLCBuZXdCb2FyZC5waWVjZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBLaW5kYSBjdXJzZWQgYnV0IGl0IHdvcmtzLlxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1zdG9wLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGRpZExvc2UpIHtcclxuICAgICAgICAgICAgcmVzZXRCb2FyZCgpO1xyXG4gICAgICAgICAgICBkcmF3RW1wdHkoKTtcclxuICAgICAgICAgICAgcmVzZXRDb3VudGVyKCk7XHJcbiAgICAgICAgICAgIGRpZExvc2UgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzUnVubmluZyA9ICFpc1J1bm5pbmc7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVyVGV4dCA9IGlzUnVubmluZyA/IFwiU3RvcFwiIDogXCJTdGFydFwiO1xyXG5cclxuICAgICAgICB3aGlsZSAoaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0JvYXJkID0gc3RlcCgpO1xyXG4gICAgICAgICAgICBkcmF3Qm9hcmQobmV3Qm9hcmQuYm9hcmQsIG5ld0JvYXJkLnBpZWNlKTtcclxuICAgICAgICAgICAgaWYgKG5ld0JvYXJkLmlzTG9zdCkge1xyXG4gICAgICAgICAgICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gXCJTdGFydFwiO1xyXG4gICAgICAgICAgICAgICAgZGlkTG9zZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluY3JlbWVudENvdW50ZXIoKTtcclxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgc2xpZGVyVmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0LWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHJlc2V0Qm9hcmQoKTtcclxuICAgICAgICBkcmF3RW1wdHkoKTtcclxuICAgICAgICByZXNldENvdW50ZXIoKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYXdTdGVwKCkge1xyXG4gICAgZHJhd0JvYXJkKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCbG9jayh4LCB5LCBjb2xvcikge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0JvYXJkKGJvYXJkLCBwaWVjZSkge1xyXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMjA7IHJvdysrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpdCA9IChib2FyZFtyb3ddID4+ICg5IC0gY29sKSkgJiAxO1xyXG4gICAgICAgICAgICBpZiAoYml0ICE9PSAwICYmIGJvYXJkTWF0cml4W3Jvd11bY29sXSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYm9hcmRNYXRyaXhbcm93XVtjb2xdID0gcGllY2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYml0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBib2FyZE1hdHJpeFtyb3ddW2NvbF0gPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gY29sb3JNYXBbYm9hcmRNYXRyaXhbcm93XVtjb2xdXTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBibG9jayA/IGJsb2NrIDogXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICBkcmF3QmxvY2soY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdFbXB0eSgpIHtcclxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDIwOyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xyXG4gICAgICAgICAgICBkcmF3QmxvY2soY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIFwid2hpdGVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==