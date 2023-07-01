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
        console.log("go to: ", this._board.length - pieceShape.length);
        out: for (; y < this._board.length - pieceShape.length + 1; y++) {
            for (let pieceY = 0; pieceY < pieceShape.length; pieceY++) {
                if (this._board[y + pieceY] & shiftedPiece[pieceY]) {
                    y--;
                    break out;
                }
            }
        }
        y = Math.min(this._board.length - pieceShape.length, y);
        // Add new piece to the board.
        for (let i = 0; i < shiftedPiece.length; i++) {
            this._board[y + i] |= shiftedPiece[i];
        }
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
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const { step, getNextPiece } = __webpack_require__(/*! ./app */ "./src/app.ts");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELFlBQVksR0FBRyxvQkFBb0I7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7Ozs7Ozs7Ozs7OztBQ2pCQztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0EseUJBQXlCLDBCQUEwQixHQUFHO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixPQUFPLFVBQVUsUUFBUSxTQUFTLFdBQVc7QUFDM0U7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsZ0RBQWdEO0FBQ3BFLGlDQUFpQyw0QkFBNEI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxPQUFPO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7O1VDeEhiO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxRQUFRLHFCQUFxQixFQUFFLG1CQUFPLENBQUMsMkJBQU87QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9ib2FyZHYyLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3RlcCA9IGV4cG9ydHMuZ2V0TmV4dFBpZWNlID0gdm9pZCAwO1xuY29uc3QgYm9hcmR2Ml8xID0gcmVxdWlyZShcIi4vYm9hcmR2MlwiKTtcbmNvbnN0IGJvYXJkID0gbmV3IGJvYXJkdjJfMS5Cb2FyZCgpO1xuZnVuY3Rpb24gZ2V0UmFuZG9tSW5SYW5nZShtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG59XG5mdW5jdGlvbiBnZXROZXh0UGllY2UoKSB7XG4gICAgcmV0dXJuIGJvYXJkLmdldE5leHRQaWVjZSgpO1xufVxuZXhwb3J0cy5nZXROZXh0UGllY2UgPSBnZXROZXh0UGllY2U7XG5mdW5jdGlvbiBzdGVwKG5leHRQaWVjZSkge1xuICAgIGJvYXJkLmRyb3BQaWVjZShuZXh0UGllY2UsIDAsIGdldFJhbmRvbUluUmFuZ2UoMCwgOSkpO1xuICAgIC8vYm9hcmQucHJpbnRCb2FyZCgpO1xuICAgIHJldHVybiBib2FyZC5nZXRCb2FyZCgpO1xufVxuZXhwb3J0cy5zdGVwID0gc3RlcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Cb2FyZCA9IHZvaWQgMDtcbmNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fYm9hcmQgPSBBcnJheSgyMCkuZmlsbCgwKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5waWVjZUxldHRlcnMgPSBbXCJJXCIsIFwiSlwiLCBcIkxcIiwgXCJPXCIsIFwiU1wiLCBcIlRcIiwgXCJaXCJdO1xuICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJKXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjAxXCIsIDIpLCBwYXJzZUludChcIjExXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMVwiLCAyKSwgcGFyc2VJbnQoXCIwMDFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTAwXCIsIDIpLCBwYXJzZUludChcIjExMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIkxcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExXCIsIDIpLCBwYXJzZUludChcIjEwMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMDFcIiwgMiksIHBhcnNlSW50KFwiMTExXCIsIDIpXSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuX3RldHJpbWlub3Muc2V0KFwiSVwiLCBbXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxXCIsIDIpLCBwYXJzZUludChcIjFcIiwgMiksIHBhcnNlSW50KFwiMVwiLCAyKSwgcGFyc2VJbnQoXCIxXCIsIDIpXSxcbiAgICAgICAgICAgIFtwYXJzZUludChcIjExMTFcIiwgMildLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJPXCIsIFtbcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKV1dKTtcbiAgICAgICAgdGhpcy5fdGV0cmltaW5vcy5zZXQoXCJUXCIsIFtcbiAgICAgICAgICAgIFtwYXJzZUludChcIjAxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMTFcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTBcIiwgMiksIHBhcnNlSW50KFwiMTFcIiwgMiksIHBhcnNlSW50KFwiMTBcIiwgMildLFxuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTExXCIsIDIpLCBwYXJzZUludChcIjAxMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIlNcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMDExXCIsIDIpLCBwYXJzZUludChcIjExMFwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIxMFwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIwMVwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLl90ZXRyaW1pbm9zLnNldChcIlpcIiwgW1xuICAgICAgICAgICAgW3BhcnNlSW50KFwiMTEwXCIsIDIpLCBwYXJzZUludChcIjAxMVwiLCAyKV0sXG4gICAgICAgICAgICBbcGFyc2VJbnQoXCIwMVwiLCAyKSwgcGFyc2VJbnQoXCIxMVwiLCAyKSwgcGFyc2VJbnQoXCIxMFwiLCAyKV0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnByaW50Qm9hcmQoKTtcbiAgICB9XG4gICAgdG9CaW4ocykge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQocywgMik7XG4gICAgfVxuICAgIHByaW50Qm9hcmQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9ib2FyZFtpXTtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBgJHtpLnRvU3RyaW5nKCkucGFkU3RhcnQoMil9IHwke3ZhbHVlXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAgICAgLnBhZFN0YXJ0KDEwLCBcIjBcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvMC9nLCBcIiAgXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzEvZywgXCIgT1wiKX1gO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiICAgfCAwIDEgMiAzIDQgNSA2IDcgOCA5XCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuX2JvYXJkKTtcbiAgICB9XG4gICAgZ2V0Qm9hcmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2FyZDtcbiAgICB9XG4gICAgZHJvcFBpZWNlKHBpZWNlLCByb3RhdGlvbiwgY29sdW1uKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgcGllY2VTaGFwZXMgPSAoX2EgPSB0aGlzLl90ZXRyaW1pbm9zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0KHBpZWNlKTtcbiAgICAgICAgaWYgKCFwaWVjZVNoYXBlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkIHBpZWNlIHR5cGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGllY2VTaGFwZSA9IHBpZWNlU2hhcGVzW3JvdGF0aW9uXTtcbiAgICAgICAgY29uc29sZS5sb2cocGllY2VTaGFwZSk7XG4gICAgICAgIC8vIFNoaWZ0IHBpZWNlIHRvIGNvcnJlY3QgY29sdW1uLlxuICAgICAgICBjb25zdCBwaWVjZVdpZHRoID0gTWF0aC5mbG9vcihNYXRoLmxvZzIocGllY2VTaGFwZS5yZWR1Y2UoKG9yLCB4KSA9PiBvciB8IHgsIDApKSkgKyAxO1xuICAgICAgICBsZXQgc2hpZnRlZFBpZWNlID0gWy4uLnBpZWNlU2hhcGVdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpZWNlU2hhcGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIHNoaWZ0ZWRQaWVjZVtpXSA9IChwaWVjZVNoYXBlW2ldIDw8IDEwKSA+PiBNYXRoLm1pbihwaWVjZVdpZHRoICsgY29sdW1uLCAxMCk7XG4gICAgICAgICAgICBzaGlmdGVkUGllY2VbaV0gPSBwaWVjZVNoYXBlW2ldIDw8IE1hdGgubWF4KDEwIC0gKHBpZWNlV2lkdGggKyBjb2x1bW4pLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgcGllY2U6ICR7cGllY2V9IGNvbHVtbjogJHtjb2x1bW59IHdpZHRoOiAke3BpZWNlV2lkdGh9YCk7XG4gICAgICAgIHNoaWZ0ZWRQaWVjZS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh4LnRvU3RyaW5nKDIpLnBhZFN0YXJ0KDEwLCBcIjBcIikucmVwbGFjZSgvMC9nLCBcIi5cIikucmVwbGFjZSgvMS9nLCBcIuKWoFwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBGaW5kIHJvdyBiZWZvcmUgd2hlcmUgcGllY2Ugb3ZlcmxhcHMgd2l0aCBleGlzdGluZyBwaWVjZXMuXG4gICAgICAgIGxldCB5ID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coXCJnbyB0bzogXCIsIHRoaXMuX2JvYXJkLmxlbmd0aCAtIHBpZWNlU2hhcGUubGVuZ3RoKTtcbiAgICAgICAgb3V0OiBmb3IgKDsgeSA8IHRoaXMuX2JvYXJkLmxlbmd0aCAtIHBpZWNlU2hhcGUubGVuZ3RoICsgMTsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwaWVjZVkgPSAwOyBwaWVjZVkgPCBwaWVjZVNoYXBlLmxlbmd0aDsgcGllY2VZKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbeSArIHBpZWNlWV0gJiBzaGlmdGVkUGllY2VbcGllY2VZXSkge1xuICAgICAgICAgICAgICAgICAgICB5LS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeSA9IE1hdGgubWluKHRoaXMuX2JvYXJkLmxlbmd0aCAtIHBpZWNlU2hhcGUubGVuZ3RoLCB5KTtcbiAgICAgICAgLy8gQWRkIG5ldyBwaWVjZSB0byB0aGUgYm9hcmQuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpZnRlZFBpZWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFt5ICsgaV0gfD0gc2hpZnRlZFBpZWNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNodWZmbGVQaWVjZXMoKSB7XG4gICAgICAgIHRoaXMuc2h1ZmZsZWRQaWVjZXMgPSBbLi4udGhpcy5waWVjZUxldHRlcnNdO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zaHVmZmxlZFBpZWNlcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW3RoaXMuc2h1ZmZsZWRQaWVjZXNbaV0sIHRoaXMuc2h1ZmZsZWRQaWVjZXNbcmFuZG9tSW5kZXhdXSA9IFtcbiAgICAgICAgICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzW3JhbmRvbUluZGV4XSxcbiAgICAgICAgICAgICAgICB0aGlzLnNodWZmbGVkUGllY2VzW2ldLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgfVxuICAgIGdldE5leHRQaWVjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID49IHRoaXMuc2h1ZmZsZWRQaWVjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNodWZmbGVQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0UGllY2UgPSB0aGlzLnNodWZmbGVkUGllY2VzW3RoaXMuY3VycmVudEluZGV4XTtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXgrKztcbiAgICAgICAgcmV0dXJuIG5leHRQaWVjZTtcbiAgICB9XG59XG5leHBvcnRzLkJvYXJkID0gQm9hcmQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgeyBzdGVwLCBnZXROZXh0UGllY2UgfSA9IHJlcXVpcmUoXCIuL2FwcFwiKTtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmlzLWJvYXJkXCIpO1xyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuY29uc3QgYmxvY2tXaWR0aCA9IGNhbnZhcy53aWR0aCAvIDEwO1xyXG5jb25zdCBibG9ja0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgLyAyMDtcclxuXHJcbmNvbnN0IGNvbG9yTWFwID0ge1xyXG4gICAgSTogXCJDeWFuXCIsXHJcbiAgICBPOiBcIlllbGxvd1wiLFxyXG4gICAgVDogXCJNYWdlbnRhXCIsXHJcbiAgICBKOiBcIkJsdWVcIixcclxuICAgIEw6IFwiT3JhbmdlXCIsXHJcbiAgICBTOiBcIlNwcmluZ0dyZWVuXCIsXHJcbiAgICBaOiBcIlJlZFwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9hcmRNYXRyaXggPSBBcnJheSgyMClcclxuICAgIC5maWxsKFwiXCIpXHJcbiAgICAubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKFwiXCIpKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGFzeW5jICgpID0+IHtcclxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAvLyAgICAgY29uc3QgbmV4dFBpZWNlID0gZ2V0TmV4dFBpZWNlKCk7XHJcbiAgICAvLyAgICAgZHJhd01hdHJpeChzdGVwKG5leHRQaWVjZSksIG5leHRQaWVjZSk7XHJcbiAgICAvLyAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMTAwMCkpO1xyXG4gICAgLy8gfVxyXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkcm9wLXBpZWNlLWJ1dHRvblwiKTtcclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5leHRQaWVjZSA9IGdldE5leHRQaWVjZSgpO1xyXG4gICAgICAgIGRyYXdNYXRyaXgoc3RlcChuZXh0UGllY2UpLCBuZXh0UGllY2UpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhd1N0ZXAoKSB7XHJcbiAgICBkcmF3TWF0cml4KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdCbG9jayh4LCB5LCBjb2xvcikge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd01hdHJpeChtYXRyaXgsIHBpZWNlKSB7XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAyMDsgcm93KyspIHtcclxuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYml0ID0gKG1hdHJpeFtyb3ddID4+ICg5IC0gY29sKSkgJiAxO1xyXG4gICAgICAgICAgICBpZiAoYml0ICE9PSAwICYmIGJvYXJkTWF0cml4W3Jvd11bY29sXSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYm9hcmRNYXRyaXhbcm93XVtjb2xdID0gcGllY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBjb2xvck1hcFtib2FyZE1hdHJpeFtyb3ddW2NvbF1dO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGJsb2NrID8gYmxvY2sgOiBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIGRyYXdCbG9jayhjb2wgKiBibG9ja1dpZHRoLCByb3cgKiBibG9ja0hlaWdodCwgY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=