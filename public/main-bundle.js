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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELFlBQVksR0FBRyxvQkFBb0I7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7Ozs7Ozs7Ozs7OztBQ2pCQztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0E7QUFDQSxxQkFBcUIsZ0NBQWdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBLDhCQUE4QixPQUFPLFVBQVUsUUFBUSxTQUFTLFdBQVc7QUFDM0U7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLDhDQUE4QztBQUNsRSxpQ0FBaUMsOEJBQThCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUJBQXlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxPQUFPO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7O1VDcEhiO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxRQUFRLHFCQUFxQixFQUFFLG1CQUFPLENBQUMsZ0NBQVk7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9ib2FyZHYyLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3B1YmxpYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3RlcCA9IGV4cG9ydHMuZ2V0TmV4dFBpZWNlID0gdm9pZCAwO1xuY29uc3QgYm9hcmR2Ml8xID0gcmVxdWlyZShcIi4vYm9hcmR2MlwiKTtcbmNvbnN0IGJvYXJkID0gbmV3IGJvYXJkdjJfMS5Cb2FyZCgpO1xuZnVuY3Rpb24gZ2V0UmFuZG9tSW5SYW5nZShtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG59XG5mdW5jdGlvbiBnZXROZXh0UGllY2UoKSB7XG4gICAgcmV0dXJuIGJvYXJkLmdldE5leHRQaWVjZSgpO1xufVxuZXhwb3J0cy5nZXROZXh0UGllY2UgPSBnZXROZXh0UGllY2U7XG5mdW5jdGlvbiBzdGVwKG5leHRQaWVjZSkge1xuICAgIGJvYXJkLmRyb3BQaWVjZShuZXh0UGllY2UsIDAsIGdldFJhbmRvbUluUmFuZ2UoMCwgOSkpO1xuICAgIC8vYm9hcmQucHJpbnRCb2FyZCgpO1xuICAgIHJldHVybiBib2FyZC5nZXRCb2FyZCgpO1xufVxuZXhwb3J0cy5zdGVwID0gc3RlcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Cb2FyZCA9IHZvaWQgMDtcbmNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fYm9hcmQgPSBBcnJheSgyMCkuZmlsbCgwKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5waWVjZUxldHRlcnMgPSBbXCJJXCIsIFwiSlwiLCBcIkxcIiwgXCJPXCIsIFwiU1wiLCBcIlRcIiwgXCJaXCJdO1xuICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJKXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMVwiLCAyKSwgcGFyc2VJbnQoXCIwMDFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTAwXCIsIDIpLCBwYXJzZUludChcIjExMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIkxcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExXCIsIDIpLCBwYXJzZUludChcIjEwMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMDFcIiwgMiksIHBhcnNlSW50KFwiMTExXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiSVwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxXCIsIDIpLCBwYXJzZUludChcIjFcIiwgMiksIHBhcnNlSW50KFwiMVwiLCAyKSwgcGFyc2VJbnQoXCIxXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMTFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJPXCIsIFtbcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKV1dKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJUXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExXCIsIDIpLCBwYXJzZUludChcIjAxMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIlNcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDExXCIsIDIpLCBwYXJzZUludChcIjExMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIlpcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTEwXCIsIDIpLCBwYXJzZUludChcIjAxMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnByaW50Qm9hcmQoKTtcbiAgICB9XG4gICAgdG9CaW4ocykge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQocywgMik7XG4gICAgfVxuICAgIHByaW50Qm9hcmQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgICAgICAgbGV0IHMgPSBpLnRvU3RyaW5nKCkucGFkU3RhcnQoMikgKyBcIiB8XCI7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2JvYXJkW2ldO1xuICAgICAgICAgICAgcyArPSBgICR7dmFsdWUgPyB2YWx1ZS50b1N0cmluZygyKSA6IFwiIFwifWA7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIgICB8IDAgMSAyIDMgNCA1IDYgNyA4IDlcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5fYm9hcmQpO1xuICAgIH1cbiAgICBnZXRCb2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkO1xuICAgIH1cbiAgICBkcm9wUGllY2UocGllY2UsIHJvdGF0aW9uLCBjb2x1bW4pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBwaWVjZVNoYXBlcyA9IChfYSA9IHRoaXMuX3RldHJpbWlub3MpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXQocGllY2UpO1xuICAgICAgICBpZiAoIXBpZWNlU2hhcGVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgcGllY2UgdHlwZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaWVjZVNoYXBlID0gcGllY2VTaGFwZXNbcm90YXRpb25dO1xuICAgICAgICBjb25zb2xlLmxvZyhwaWVjZVNoYXBlKTtcbiAgICAgICAgLy8gU2hpZnQgcGllY2UgdG8gY29ycmVjdCBjb2x1bW4uXG4gICAgICAgIGNvbnN0IHBpZWNlV2lkdGggPSBNYXRoLmZsb29yKE1hdGgubG9nMihwaWVjZVNoYXBlLnJlZHVjZSgob3IsIHgpID0+IG9yIHwgeCwgMCkpKSArIDE7XG4gICAgICAgIGxldCBzaGlmdGVkUGllY2UgPSBbLi4ucGllY2VTaGFwZV07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hpZnRlZFBpZWNlW2ldID0gKHBpZWNlU2hhcGVbaV0gPDwgMTApID4+IChwaWVjZVdpZHRoICsgY29sdW1uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgcGllY2U6ICR7cGllY2V9IGNvbHVtbjogJHtjb2x1bW59IHdpZHRoOiAke3BpZWNlV2lkdGh9YCk7XG4gICAgICAgIHNoaWZ0ZWRQaWVjZS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh4LnRvU3RyaW5nKDIpLnBhZFN0YXJ0KDEwLCBcIjBcIikucmVwbGFjZSgvMC9nLCBcIi5cIikucmVwbGFjZSgvMS9nLCBcIuKWoFwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBGaW5kIHJvdyBiZWZvcmUgd2hlcmUgcGllY2Ugb3ZlcmxhcHMgd2l0aCBleGlzdGluZyBwaWVjZXMuXG4gICAgICAgIGxldCB5ID0gMDtcbiAgICAgICAgb3V0OiBmb3IgKDsgeSA8IHRoaXMuX2JvYXJkLmxlbmd0aCAtIHNoaWZ0ZWRQaWVjZS5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgcGllY2VZID0gMDsgcGllY2VZIDwgc2hpZnRlZFBpZWNlLmxlbmd0aDsgcGllY2VZKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbeSArIHBpZWNlWV0gJiBzaGlmdGVkUGllY2VbcGllY2VZXSkge1xuICAgICAgICAgICAgICAgICAgICB5LS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJ5OiBcIiwgeSk7XG4gICAgICAgIC8vIEFkZCBuZXcgcGllY2UgdG8gdGhlIGJvYXJkLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaWZ0ZWRQaWVjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fYm9hcmRbeSArIGldIHw9IHNoaWZ0ZWRQaWVjZVtpXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiKTtcbiAgICB9XG4gICAgc2h1ZmZsZVBpZWNlcygpIHtcbiAgICAgICAgdGhpcy5zaHVmZmxlZFBpZWNlcyA9IFsuLi50aGlzLnBpZWNlTGV0dGVyc107XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnNodWZmbGVkUGllY2VzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBbdGhpcy5zaHVmZmxlZFBpZWNlc1tpXSwgdGhpcy5zaHVmZmxlZFBpZWNlc1tyYW5kb21JbmRleF1dID0gW1xuICAgICAgICAgICAgICAgIHRoaXMuc2h1ZmZsZWRQaWVjZXNbcmFuZG9tSW5kZXhdLFxuICAgICAgICAgICAgICAgIHRoaXMuc2h1ZmZsZWRQaWVjZXNbaV0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcbiAgICB9XG4gICAgZ2V0TmV4dFBpZWNlKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPj0gdGhpcy5zaHVmZmxlZFBpZWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2h1ZmZsZVBpZWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHRQaWVjZSA9IHRoaXMuc2h1ZmZsZWRQaWVjZXNbdGhpcy5jdXJyZW50SW5kZXhdO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCsrO1xuICAgICAgICByZXR1cm4gbmV4dFBpZWNlO1xuICAgIH1cbn1cbmV4cG9ydHMuQm9hcmQgPSBCb2FyZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCB7IHN0ZXAsIGdldE5leHRQaWVjZSB9ID0gcmVxdWlyZShcIi4uL3NyYy9hcHBcIik7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJpcy1ib2FyZFwiKTtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbmNvbnN0IGJsb2NrV2lkdGggPSBjYW52YXMud2lkdGggLyAxMDtcclxuY29uc3QgYmxvY2tIZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC8gMjA7XHJcblxyXG5jb25zdCBjb2xvck1hcCA9IHtcclxuICAgIEk6IFwiQ3lhblwiLFxyXG4gICAgTzogXCJZZWxsb3dcIixcclxuICAgIFQ6IFwiTWFnZW50YVwiLFxyXG4gICAgSjogXCJCbHVlXCIsXHJcbiAgICBMOiBcIk9yYW5nZVwiLFxyXG4gICAgUzogXCJTcHJpbmdHcmVlblwiLFxyXG4gICAgWjogXCJSZWRcIixcclxufTtcclxuXHJcbmNvbnN0IGJvYXJkTWF0cml4ID0gQXJyYXkoMjApXHJcbiAgICAuZmlsbChcIlwiKVxyXG4gICAgLm1hcCgoKSA9PiBBcnJheSgxMCkuZmlsbChcIlwiKSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBjb25zdCBuZXh0UGllY2UgPSBnZXROZXh0UGllY2UoKTtcclxuICAgICAgICBkcmF3TWF0cml4KHN0ZXAobmV4dFBpZWNlKSwgbmV4dFBpZWNlKTtcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAxMDAwKSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhd1N0ZXAoKSB7XHJcbiAgICBkcmF3TWF0cml4KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCbG9jayh4LCB5LCBjb2xvcikge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd01hdHJpeChtYXRyaXgsIHBpZWNlKSB7XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAyMDsgcm93KyspIHtcclxuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYml0ID0gKG1hdHJpeFtyb3ddID4+ICg5IC0gY29sKSkgJiAxO1xyXG4gICAgICAgICAgICBpZiAoYml0ICE9PSAwICYmIGJvYXJkTWF0cml4W3Jvd11bY29sXSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYm9hcmRNYXRyaXhbcm93XVtjb2xdID0gcGllY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBjb2xvck1hcFtib2FyZE1hdHJpeFtyb3ddW2NvbF1dO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGJsb2NrID8gYmxvY2sgOiBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIGRyYXdCbG9jayhjb2wgKiBibG9ja1dpZHRoLCByb3cgKiBibG9ja0hlaWdodCwgY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=