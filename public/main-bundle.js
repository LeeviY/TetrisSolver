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
            let s = i.toString().padStart(2) + " |";
            const value = this._board[i];
            s += ` ${value ? value.toString(2) : " "}`;
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
            shiftedPiece[i] = (pieceShape[i] << 10) >> (pieceWidth + column);
        }
        console.log(`piece: ${piece} column: ${column} width: ${pieceWidth}`);
        shiftedPiece.forEach((x) => {
            console.log(x.toString(2).padStart(10, "0").replace(/0/g, ".").replace(/1/g, "■"));
        });
        // Find row before where piece overlaps with existing pieces.
        let y = 0;
        out: for (; y < this._board.length - shiftedPiece.length; y++) {
            for (let pieceY = 0; pieceY < shiftedPiece.length; pieceY++) {
                if (this._board[y + pieceY] & shiftedPiece[pieceY]) {
                    y--;
                    break out;
                }
            }
        }
        console.log("y: ", y);
        // Add new piece to the board.
        for (let i = 0; i < shiftedPiece.length; i++) {
            this._board[y + i] |= shiftedPiece[i];
        }
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
    for (let i = 0; i < 10; i++) {
        const nextPiece = getNextPiece();
        drawMatrix(step(nextPiece), nextPiece);
        await new Promise((r) => setTimeout(r, 1000));
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELFlBQVksR0FBRyxvQkFBb0I7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7Ozs7Ozs7Ozs7OztBQ2pCQztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0E7QUFDQSxxQkFBcUIsZ0NBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBLDhCQUE4QixPQUFPLFVBQVUsUUFBUSxTQUFTLFdBQVc7QUFDM0U7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLDhDQUE4QztBQUNsRSxpQ0FBaUMsOEJBQThCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxPQUFPO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7O1VDcEhiO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxRQUFRLHFCQUFxQixFQUFFLG1CQUFPLENBQUMsZ0NBQVk7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGV0cmlzX3Njb3JlLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc2NvcmUvLi9zcmMvYm9hcmR2Mi50cyIsIndlYnBhY2s6Ly90ZXRyaXNfc2NvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGV0cmlzX3Njb3JlLy4vcHVibGljL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdGVwID0gZXhwb3J0cy5nZXROZXh0UGllY2UgPSB2b2lkIDA7XG5jb25zdCBib2FyZHYyXzEgPSByZXF1aXJlKFwiLi9ib2FyZHYyXCIpO1xuY29uc3QgYm9hcmQgPSBuZXcgYm9hcmR2Ml8xLkJvYXJkKCk7XG5mdW5jdGlvbiBnZXRSYW5kb21JblJhbmdlKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbn1cbmZ1bmN0aW9uIGdldE5leHRQaWVjZSgpIHtcbiAgICByZXR1cm4gYm9hcmQuZ2V0TmV4dFBpZWNlKCk7XG59XG5leHBvcnRzLmdldE5leHRQaWVjZSA9IGdldE5leHRQaWVjZTtcbmZ1bmN0aW9uIHN0ZXAobmV4dFBpZWNlKSB7XG4gICAgYm9hcmQuZHJvcFBpZWNlKG5leHRQaWVjZSwgMCwgZ2V0UmFuZG9tSW5SYW5nZSgwLCA5KSk7XG4gICAgLy9ib2FyZC5wcmludEJvYXJkKCk7XG4gICAgcmV0dXJuIGJvYXJkLmdldEJvYXJkKCk7XG59XG5leHBvcnRzLnN0ZXAgPSBzdGVwO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkJvYXJkID0gdm9pZCAwO1xuY2xhc3MgQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9ib2FyZCA9IEFycmF5KDIwKS5maWxsKDApO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBpZWNlTGV0dGVycyA9IFtcIklcIiwgXCJKXCIsIFwiTFwiLCBcIk9cIiwgXCJTXCIsIFwiVFwiLCBcIlpcIl07XG4gICAgICAgIHRoaXMuc2h1ZmZsZWRQaWVjZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIkpcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDFcIiwgMiksIHBhcnNlSW50KFwiMDFcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExXCIsIDIpLCBwYXJzZUludChcIjAwMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMDBcIiwgMiksIHBhcnNlSW50KFwiMTExXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiTFwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMTFcIiwgMiksIHBhcnNlSW50KFwiMTAwXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMTFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJJXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjFcIiwgMiksIHBhcnNlSW50KFwiMVwiLCAyKSwgcGFyc2VJbnQoXCIxXCIsIDIpLCBwYXJzZUludChcIjFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIk9cIiwgW1twYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpXV0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIlRcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDEwXCIsIDIpLCBwYXJzZUludChcIjExMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMTFcIiwgMiksIHBhcnNlSW50KFwiMDEwXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiU1wiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMTFcIiwgMiksIHBhcnNlSW50KFwiMTEwXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjEwXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiWlwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMTBcIiwgMiksIHBhcnNlSW50KFwiMDExXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpLCBwYXJzZUludChcIjEwXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMucHJpbnRCb2FyZCgpO1xuICAgIH1cbiAgICB0b0JpbihzKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChzLCAyKTtcbiAgICB9XG4gICAgcHJpbnRCb2FyZCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcyA9IGkudG9TdHJpbmcoKS5wYWRTdGFydCgyKSArIFwiIHxcIjtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fYm9hcmRbaV07XG4gICAgICAgICAgICBzICs9IGAgJHt2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKDIpIDogXCIgXCJ9YDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIiAgIHwgMCAxIDIgMyA0IDUgNiA3IDggOVwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLl9ib2FyZCk7XG4gICAgfVxuICAgIGdldEJvYXJkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQ7XG4gICAgfVxuICAgIGRyb3BQaWVjZShwaWVjZSwgcm90YXRpb24sIGNvbHVtbikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGVzID0gKF9hID0gdGhpcy5fdGV0cmltaW5vcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldChwaWVjZSk7XG4gICAgICAgIGlmICghcGllY2VTaGFwZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBwaWVjZSB0eXBlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpZWNlU2hhcGUgPSBwaWVjZVNoYXBlc1tyb3RhdGlvbl07XG4gICAgICAgIGNvbnNvbGUubG9nKHBpZWNlU2hhcGUpO1xuICAgICAgICAvLyBTaGlmdCBwaWVjZSB0byBjb3JyZWN0IGNvbHVtbi5cbiAgICAgICAgY29uc3QgcGllY2VXaWR0aCA9IE1hdGguZmxvb3IoTWF0aC5sb2cyKHBpZWNlU2hhcGUucmVkdWNlKChvciwgeCkgPT4gb3IgfCB4LCAwKSkpICsgMTtcbiAgICAgICAgbGV0IHNoaWZ0ZWRQaWVjZSA9IFsuLi5waWVjZVNoYXBlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZVNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzaGlmdGVkUGllY2VbaV0gPSAocGllY2VTaGFwZVtpXSA8PCAxMCkgPj4gKHBpZWNlV2lkdGggKyBjb2x1bW4pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBwaWVjZTogJHtwaWVjZX0gY29sdW1uOiAke2NvbHVtbn0gd2lkdGg6ICR7cGllY2VXaWR0aH1gKTtcbiAgICAgICAgc2hpZnRlZFBpZWNlLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHgudG9TdHJpbmcoMikucGFkU3RhcnQoMTAsIFwiMFwiKS5yZXBsYWNlKC8wL2csIFwiLlwiKS5yZXBsYWNlKC8xL2csIFwi4pagXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEZpbmQgcm93IGJlZm9yZSB3aGVyZSBwaWVjZSBvdmVybGFwcyB3aXRoIGV4aXN0aW5nIHBpZWNlcy5cbiAgICAgICAgbGV0IHkgPSAwO1xuICAgICAgICBvdXQ6IGZvciAoOyB5IDwgdGhpcy5fYm9hcmQubGVuZ3RoIC0gc2hpZnRlZFBpZWNlLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwaWVjZVkgPSAwOyBwaWVjZVkgPCBzaGlmdGVkUGllY2UubGVuZ3RoOyBwaWVjZVkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFt5ICsgcGllY2VZXSAmIHNoaWZ0ZWRQaWVjZVtwaWVjZVldKSB7XG4gICAgICAgICAgICAgICAgICAgIHktLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcInk6IFwiLCB5KTtcbiAgICAgICAgLy8gQWRkIG5ldyBwaWVjZSB0byB0aGUgYm9hcmQuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpZnRlZFBpZWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFt5ICsgaV0gfD0gc2hpZnRlZFBpZWNlW2ldO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIpO1xuICAgIH1cbiAgICBzaHVmZmxlUGllY2VzKCkge1xuICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzID0gWy4uLnRoaXMucGllY2VMZXR0ZXJzXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc2h1ZmZsZWRQaWVjZXMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIFt0aGlzLnNodWZmbGVkUGllY2VzW2ldLCB0aGlzLnNodWZmbGVkUGllY2VzW3JhbmRvbUluZGV4XV0gPSBbXG4gICAgICAgICAgICAgICAgdGhpcy5zaHVmZmxlZFBpZWNlc1tyYW5kb21JbmRleF0sXG4gICAgICAgICAgICAgICAgdGhpcy5zaHVmZmxlZFBpZWNlc1tpXSxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgIH1cbiAgICBnZXROZXh0UGllY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA+PSB0aGlzLnNodWZmbGVkUGllY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zaHVmZmxlUGllY2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV4dFBpZWNlID0gdGhpcy5zaHVmZmxlZFBpZWNlc1t0aGlzLmN1cnJlbnRJbmRleF07XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XG4gICAgICAgIHJldHVybiBuZXh0UGllY2U7XG4gICAgfVxufVxuZXhwb3J0cy5Cb2FyZCA9IEJvYXJkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IHsgc3RlcCwgZ2V0TmV4dFBpZWNlIH0gPSByZXF1aXJlKFwiLi4vc3JjL2FwcFwiKTtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmlzLWJvYXJkXCIpO1xyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuY29uc3QgYmxvY2tXaWR0aCA9IGNhbnZhcy53aWR0aCAvIDEwO1xyXG5jb25zdCBibG9ja0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyAyMDtcclxuXHJcbmNvbnN0IGNvbG9yTWFwID0ge1xyXG4gICAgSTogXCJDeWFuXCIsXHJcbiAgICBPOiBcIlllbGxvd1wiLFxyXG4gICAgVDogXCJNYWdlbnRhXCIsXHJcbiAgICBKOiBcIkJsdWVcIixcclxuICAgIEw6IFwiT3JhbmdlXCIsXHJcbiAgICBTOiBcIlNwcmluZ0dyZWVuXCIsXHJcbiAgICBaOiBcIlJlZFwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9hcmRNYXRyaXggPSBBcnJheSgyMClcclxuICAgIC5maWxsKFwiXCIpXHJcbiAgICAubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKFwiXCIpKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IG5leHRQaWVjZSA9IGdldE5leHRQaWVjZSgpO1xyXG4gICAgICAgIGRyYXdNYXRyaXgoc3RlcChuZXh0UGllY2UpLCBuZXh0UGllY2UpO1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDEwMDApKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmF3U3RlcCgpIHtcclxuICAgIGRyYXdNYXRyaXgoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0Jsb2NrKHgsIHksIGNvbG9yKSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjdHguZmlsbFJlY3QoeCwgeSwgYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3TWF0cml4KG1hdHJpeCwgcGllY2UpIHtcclxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDIwOyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xyXG4gICAgICAgICAgICBjb25zdCBiaXQgPSAobWF0cml4W3Jvd10gPj4gKDkgLSBjb2wpKSAmIDE7XHJcbiAgICAgICAgICAgIGlmIChiaXQgIT09IDAgJiYgYm9hcmRNYXRyaXhbcm93XVtjb2xdID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBib2FyZE1hdHJpeFtyb3ddW2NvbF0gPSBwaWVjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IGNvbG9yTWFwW2JvYXJkTWF0cml4W3Jvd11bY29sXV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gYmxvY2sgPyBibG9jayA6IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgZHJhd0Jsb2NrKGNvbCAqIGJsb2NrV2lkdGgsIHJvdyAqIGJsb2NrSGVpZ2h0LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==