/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.step = exports.getNextPiece = void 0;
const boardv2_1 = __webpack_require__(/*! ./boardv2 */ "./src/boardv2.ts");
const board = new boardv2_1.Board();
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function getNextPiece() {
    return board.getNextPiece();
}
exports.getNextPiece = getNextPiece;
function step(nextPiece) {
    board.dropPiece(nextPiece, 0, getRandomInRange(0, 9));
    //board.printBoard();
    return board.getBoard();
}
exports.step = step;


/***/ }),

/***/ "./src/boardv2.ts":
/*!************************!*\
  !*** ./src/boardv2.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
class Board {
    constructor() {
        this._board = Array(20).fill(0);
        this._tetriminos = new Map();
        this.pieceLetters = ["I", "J", "L", "O", "S", "T", "Z"];
        this.shuffledPieces = [];
        this.currentIndex = 0;
        this._tetriminos.set("J", [
            [parseInt("01", 2), parseInt("01", 2), parseInt("11", 2)],
            [parseInt("111", 2), parseInt("001", 2)],
            [parseInt("11", 2), parseInt("10", 2), parseInt("10", 2)],
            [parseInt("100", 2), parseInt("111", 2)],
        ]);
        this._tetriminos.set("L", [
            [parseInt("10", 2), parseInt("10", 2), parseInt("11", 2)],
            [parseInt("111", 2), parseInt("100", 2)],
            [parseInt("11", 2), parseInt("01", 2), parseInt("01", 2)],
            [parseInt("001", 2), parseInt("111", 2)],
        ]);
        this._tetriminos.set("I", [
            [parseInt("1", 2), parseInt("1", 2), parseInt("1", 2), parseInt("1", 2)],
            [parseInt("1111", 2)],
        ]);
        this._tetriminos.set("O", [[parseInt("11", 2), parseInt("11", 2)]]);
        this._tetriminos.set("T", [
            [parseInt("010", 2), parseInt("111", 2)],
            [parseInt("10", 2), parseInt("11", 2), parseInt("10", 2)],
            [parseInt("111", 2), parseInt("010", 2)],
            [parseInt("01", 2), parseInt("11", 2), parseInt("01", 2)],
        ]);
        this._tetriminos.set("S", [
            [parseInt("011", 2), parseInt("110", 2)],
            [parseInt("10", 2), parseInt("11", 2), parseInt("01", 2)],
        ]);
        this._tetriminos.set("Z", [
            [parseInt("110", 2), parseInt("011", 2)],
            [parseInt("01", 2), parseInt("11", 2), parseInt("10", 2)],
        ]);
        this.printBoard();
    }
    toBin(s) {
        return parseInt(s, 2);
    }
    printBoard() {
        for (let i = 0; i < 20; i++) {
            const value = this._board[i];
            const s = `${i.toString().padStart(2)} |${value
                .toString(2)
                .padStart(10, "0")
                .replace(/0/g, "  ")
                .replace(/1/g, " O")}`;
            console.log(s);
        }
        console.log("------------------------");
        console.log("   | 0 1 2 3 4 5 6 7 8 9");
        //console.log(this._board);
    }
    getBoard() {
        return this._board;
    }
    dropPiece(piece, rotation, column) {
        var _a;
        const pieceShapes = (_a = this._tetriminos) === null || _a === void 0 ? void 0 : _a.get(piece);
        if (!pieceShapes) {
            console.log("Invalid piece type");
            return;
        }
        const pieceShape = pieceShapes[rotation];
        console.log(pieceShape);
        // Shift piece to correct column.
        const pieceWidth = Math.floor(Math.log2(pieceShape.reduce((or, x) => or | x, 0))) + 1;
        let shiftedPiece = [...pieceShape];
        for (let i = 0; i < pieceShape.length; i++) {
            // shiftedPiece[i] = (pieceShape[i] << 10) >> Math.min(pieceWidth + column, 10);
            shiftedPiece[i] = pieceShape[i] << Math.max(10 - (pieceWidth + column), 0);
        }
        console.log(`piece: ${piece} column: ${column} width: ${pieceWidth}`);
        shiftedPiece.forEach((x) => {
            console.log(x.toString(2).padStart(10, "0").replace(/0/g, ".").replace(/1/g, "■"));
        });
        // Find row before where piece overlaps with existing pieces.
        let y = 0;
        let early = false;
        console.log("go to: ", this._board.length - pieceShape.length);
        out: for (; y < this._board.length - pieceShape.length + 1; y++) {
            for (let pieceY = 0; pieceY < pieceShape.length; pieceY++) {
                // console.log(y, pieceY, y + pieceY, this._board[y + pieceY].toString(2).padStart(10, "0"));
                // console.log(y, pieceY, y + pieceY, shiftedPiece[pieceY].toString(2).padStart(10, "0"));
                //console.log(y, pieceY);
                if (this._board[y + pieceY] & shiftedPiece[pieceY]) {
                    y--;
                    early = true;
                    console.log("break out");
                    break out;
                }
            }
        }
        y = Math.min(this._board.length - pieceShape.length, y);
        //if (!early) y--;
        console.log("y: ", y);
        // this.printBoard();
        // Add new piece to the board.
        for (let i = 0; i < shiftedPiece.length; i++) {
            this._board[y + i] |= shiftedPiece[i];
        }
        // this.printBoard();
        console.log("\n");
    }
    shufflePieces() {
        this.shuffledPieces = [...this.pieceLetters];
        for (let i = this.shuffledPieces.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this.shuffledPieces[i], this.shuffledPieces[randomIndex]] = [
                this.shuffledPieces[randomIndex],
                this.shuffledPieces[i],
            ];
        }
        this.currentIndex = 0;
    }
    getNextPiece() {
        if (this.currentIndex >= this.shuffledPieces.length) {
            this.shufflePieces();
        }
        const nextPiece = this.shuffledPieces[this.currentIndex];
        this.currentIndex++;
        return nextPiece;
    }
}
exports.Board = Board;


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
/*!*************************!*\
  !*** ./public/index.js ***!
  \*************************/
const { step, getNextPiece } = __webpack_require__(/*! ../src/app */ "./src/app.ts");

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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELFlBQVksR0FBRyxvQkFBb0I7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7Ozs7Ozs7Ozs7OztBQ2pCQztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0EseUJBQXlCLDBCQUEwQixHQUFHO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixPQUFPLFVBQVUsUUFBUSxTQUFTLFdBQVc7QUFDM0U7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnREFBZ0Q7QUFDcEUsaUNBQWlDLDRCQUE0QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsT0FBTztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7Ozs7OztVQ25JYjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsUUFBUSxxQkFBcUIsRUFBRSxtQkFBTyxDQUFDLGdDQUFZO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQywwQkFBMEIsVUFBVTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvYm9hcmR2Mi50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9wdWJsaWMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnN0ZXAgPSBleHBvcnRzLmdldE5leHRQaWVjZSA9IHZvaWQgMDtcbmNvbnN0IGJvYXJkdjJfMSA9IHJlcXVpcmUoXCIuL2JvYXJkdjJcIik7XG5jb25zdCBib2FyZCA9IG5ldyBib2FyZHYyXzEuQm9hcmQoKTtcbmZ1bmN0aW9uIGdldFJhbmRvbUluUmFuZ2UobWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xufVxuZnVuY3Rpb24gZ2V0TmV4dFBpZWNlKCkge1xuICAgIHJldHVybiBib2FyZC5nZXROZXh0UGllY2UoKTtcbn1cbmV4cG9ydHMuZ2V0TmV4dFBpZWNlID0gZ2V0TmV4dFBpZWNlO1xuZnVuY3Rpb24gc3RlcChuZXh0UGllY2UpIHtcbiAgICBib2FyZC5kcm9wUGllY2UobmV4dFBpZWNlLCAwLCBnZXRSYW5kb21JblJhbmdlKDAsIDkpKTtcbiAgICAvL2JvYXJkLnByaW50Qm9hcmQoKTtcbiAgICByZXR1cm4gYm9hcmQuZ2V0Qm9hcmQoKTtcbn1cbmV4cG9ydHMuc3RlcCA9IHN0ZXA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQm9hcmQgPSB2b2lkIDA7XG5jbGFzcyBCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2JvYXJkID0gQXJyYXkoMjApLmZpbGwoMCk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3MgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucGllY2VMZXR0ZXJzID0gW1wiSVwiLCBcIkpcIiwgXCJMXCIsIFwiT1wiLCBcIlNcIiwgXCJUXCIsIFwiWlwiXTtcbiAgICAgICAgdGhpcy5zaHVmZmxlZFBpZWNlcyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiSlwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMTFcIiwgMiksIHBhcnNlSW50KFwiMDAxXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjEwXCIsIDIpLCBwYXJzZUludChcIjEwXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjEwMFwiLCAyKSwgcGFyc2VJbnQoXCIxMTFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJMXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjEwXCIsIDIpLCBwYXJzZUludChcIjEwXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMVwiLCAyKSwgcGFyc2VJbnQoXCIxMDBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMDFcIiwgMiksIHBhcnNlSW50KFwiMDFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDAxXCIsIDIpLCBwYXJzZUludChcIjExMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIklcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMVwiLCAyKSwgcGFyc2VJbnQoXCIxXCIsIDIpLCBwYXJzZUludChcIjFcIiwgMiksIHBhcnNlSW50KFwiMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMTExXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiT1wiLCBbW3BhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMildXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiVFwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMTBcIiwgMiksIHBhcnNlSW50KFwiMTExXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjEwXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjEwXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMVwiLCAyKSwgcGFyc2VJbnQoXCIwMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDFcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMDFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJTXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMDFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJaXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMFwiLCAyKSwgcGFyc2VJbnQoXCIwMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDFcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5wcmludEJvYXJkKCk7XG4gICAgfVxuICAgIHRvQmluKHMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHMsIDIpO1xuICAgIH1cbiAgICBwcmludEJvYXJkKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fYm9hcmRbaV07XG4gICAgICAgICAgICBjb25zdCBzID0gYCR7aS50b1N0cmluZygpLnBhZFN0YXJ0KDIpfSB8JHt2YWx1ZVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgIC5wYWRTdGFydCgxMCwgXCIwXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzAvZywgXCIgIFwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8xL2csIFwiIE9cIil9YDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIiAgIHwgMCAxIDIgMyA0IDUgNiA3IDggOVwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLl9ib2FyZCk7XG4gICAgfVxuICAgIGdldEJvYXJkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQ7XG4gICAgfVxuICAgIGRyb3BQaWVjZShwaWVjZSwgcm90YXRpb24sIGNvbHVtbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGVzID0gKF9hID0gdGhpcy5fdGV0cmltaW5vcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldChwaWVjZSk7XG4gICAgICAgIGlmICghcGllY2VTaGFwZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBwaWVjZSB0eXBlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGUgPSBwaWVjZVNoYXBlc1tyb3RhdGlvbl07XG4gICAgICAgIGNvbnNvbGUubG9nKHBpZWNlU2hhcGUpO1xuICAgICAgICAvLyBTaGlmdCBwaWVjZSB0byBjb3JyZWN0IGNvbHVtbi5cbiAgICAgICAgY29uc3QgcGllY2VXaWR0aCA9IE1hdGguZmxvb3IoTWF0aC5sb2cyKHBpZWNlU2hhcGUucmVkdWNlKChvciwgeCkgPT4gb3IgfCB4LCAwKSkpICsgMTtcbiAgICAgICAgbGV0IHNoaWZ0ZWRQaWVjZSA9IFsuLi5waWVjZVNoYXBlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZVNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBzaGlmdGVkUGllY2VbaV0gPSAocGllY2VTaGFwZVtpXSA8PCAxMCkgPj4gTWF0aC5taW4ocGllY2VXaWR0aCArIGNvbHVtbiwgMTApO1xuICAgICAgICAgICAgc2hpZnRlZFBpZWNlW2ldID0gcGllY2VTaGFwZVtpXSA8PCBNYXRoLm1heCgxMCAtIChwaWVjZVdpZHRoICsgY29sdW1uKSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYHBpZWNlOiAke3BpZWNlfSBjb2x1bW46ICR7Y29sdW1ufSB3aWR0aDogJHtwaWVjZVdpZHRofWApO1xuICAgICAgICBzaGlmdGVkUGllY2UuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coeC50b1N0cmluZygyKS5wYWRTdGFydCgxMCwgXCIwXCIpLnJlcGxhY2UoLzAvZywgXCIuXCIpLnJlcGxhY2UoLzEvZywgXCLilqBcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gRmluZCByb3cgYmVmb3JlIHdoZXJlIHBpZWNlIG92ZXJsYXBzIHdpdGggZXhpc3RpbmcgcGllY2VzLlxuICAgICAgICBsZXQgeSA9IDA7XG4gICAgICAgIGxldCBlYXJseSA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhcImdvIHRvOiBcIiwgdGhpcy5fYm9hcmQubGVuZ3RoIC0gcGllY2VTaGFwZS5sZW5ndGgpO1xuICAgICAgICBvdXQ6IGZvciAoOyB5IDwgdGhpcy5fYm9hcmQubGVuZ3RoIC0gcGllY2VTaGFwZS5sZW5ndGggKyAxOyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBpZWNlWSA9IDA7IHBpZWNlWSA8IHBpZWNlU2hhcGUubGVuZ3RoOyBwaWVjZVkrKykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHksIHBpZWNlWSwgeSArIHBpZWNlWSwgdGhpcy5fYm9hcmRbeSArIHBpZWNlWV0udG9TdHJpbmcoMikucGFkU3RhcnQoMTAsIFwiMFwiKSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeSwgcGllY2VZLCB5ICsgcGllY2VZLCBzaGlmdGVkUGllY2VbcGllY2VZXS50b1N0cmluZygyKS5wYWRTdGFydCgxMCwgXCIwXCIpKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHksIHBpZWNlWSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW3kgKyBwaWVjZVldICYgc2hpZnRlZFBpZWNlW3BpZWNlWV0pIHtcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xuICAgICAgICAgICAgICAgICAgICBlYXJseSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnJlYWsgb3V0XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhayBvdXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHkgPSBNYXRoLm1pbih0aGlzLl9ib2FyZC5sZW5ndGggLSBwaWVjZVNoYXBlLmxlbmd0aCwgeSk7XG4gICAgICAgIC8vaWYgKCFlYXJseSkgeS0tO1xuICAgICAgICBjb25zb2xlLmxvZyhcInk6IFwiLCB5KTtcbiAgICAgICAgLy8gdGhpcy5wcmludEJvYXJkKCk7XG4gICAgICAgIC8vIEFkZCBuZXcgcGllY2UgdG8gdGhlIGJvYXJkLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaWZ0ZWRQaWVjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fYm9hcmRbeSArIGldIHw9IHNoaWZ0ZWRQaWVjZVtpXTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLnByaW50Qm9hcmQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIik7XG4gICAgfVxuICAgIHNodWZmbGVQaWVjZXMoKSB7XG4gICAgICAgIHRoaXMuc2h1ZmZsZWRQaWVjZXMgPSBbLi4udGhpcy5waWVjZUxldHRlcnNdO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zaHVmZmxlZFBpZWNlcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW3RoaXMuc2h1ZmZsZWRQaWVjZXNbaV0sIHRoaXMuc2h1ZmZsZWRQaWVjZXNbcmFuZG9tSW5kZXhdXSA9IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzW3JhbmRvbUluZGV4XSxcbiAgICAgICAgICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzW2ldLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgfVxuICAgIGdldE5leHRQaWVjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID49IHRoaXMuc2h1ZmZsZWRQaWVjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNodWZmbGVQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0UGllY2UgPSB0aGlzLnNodWZmbGVkUGllY2VzW3RoaXMuY3VycmVudEluZGV4XTtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXgrKztcbiAgICAgICAgcmV0dXJuIG5leHRQaWVjZTtcbiAgICB9XG59XG5leHBvcnRzLkJvYXJkID0gQm9hcmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgeyBzdGVwLCBnZXROZXh0UGllY2UgfSA9IHJlcXVpcmUoXCIuLi9zcmMvYXBwXCIpO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyaXMtYm9hcmRcIik7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5jb25zdCBibG9ja1dpZHRoID0gY2FudmFzLndpZHRoIC8gMTA7XHJcbmNvbnN0IGJsb2NrSGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIDIwO1xyXG5cclxuY29uc3QgY29sb3JNYXAgPSB7XHJcbiAgICBJOiBcIkN5YW5cIixcclxuICAgIE86IFwiWWVsbG93XCIsXHJcbiAgICBUOiBcIk1hZ2VudGFcIixcclxuICAgIEo6IFwiQmx1ZVwiLFxyXG4gICAgTDogXCJPcmFuZ2VcIixcclxuICAgIFM6IFwiU3ByaW5nR3JlZW5cIixcclxuICAgIFo6IFwiUmVkXCIsXHJcbn07XHJcblxyXG5jb25zdCBib2FyZE1hdHJpeCA9IEFycmF5KDIwKVxyXG4gICAgLmZpbGwoXCJcIilcclxuICAgIC5tYXAoKCkgPT4gQXJyYXkoMTApLmZpbGwoXCJcIikpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgIC8vICAgICBjb25zdCBuZXh0UGllY2UgPSBnZXROZXh0UGllY2UoKTtcclxuICAgIC8vICAgICBkcmF3TWF0cml4KHN0ZXAobmV4dFBpZWNlKSwgbmV4dFBpZWNlKTtcclxuICAgIC8vICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAxMDAwKSk7XHJcbiAgICAvLyB9XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3AtcGllY2UtYnV0dG9uXCIpO1xyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV4dFBpZWNlID0gZ2V0TmV4dFBpZWNlKCk7XHJcbiAgICAgICAgZHJhd01hdHJpeChzdGVwKG5leHRQaWVjZSksIG5leHRQaWVjZSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmF3U3RlcCgpIHtcclxuICAgIGRyYXdNYXRyaXgoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Jsb2NrKHgsIHksIGNvbG9yKSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjdHguZmlsbFJlY3QoeCwgeSwgYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3TWF0cml4KG1hdHJpeCwgcGllY2UpIHtcclxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDIwOyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xyXG4gICAgICAgICAgICBjb25zdCBiaXQgPSAobWF0cml4W3Jvd10gPj4gKDkgLSBjb2wpKSAmIDE7XHJcbiAgICAgICAgICAgIGlmIChiaXQgIT09IDAgJiYgYm9hcmRNYXRyaXhbcm93XVtjb2xdID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBib2FyZE1hdHJpeFtyb3ddW2NvbF0gPSBwaWVjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IGNvbG9yTWFwW2JvYXJkTWF0cml4W3Jvd11bY29sXV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gYmxvY2sgPyBibG9jayA6IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgZHJhd0Jsb2NrKGNvbCAqIGJsb2NrV2lkdGgsIHJvdyAqIGJsb2NrSGVpZ2h0LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==