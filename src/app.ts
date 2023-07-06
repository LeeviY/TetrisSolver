import { calcScore, findBestMove } from "./StockBird";
import { dropPiece, clearLines } from "./Board";
import { Tetriminos, PieceLetters } from "./Tetriminos";
import { PieceGenerator } from "./PieceGenerator";

const pieceGenerator = new PieceGenerator(123);
let board = Array(20).fill(0);

type NewBoard = {
    board: number[][];
    piece: string;
    isLost: boolean;
    lookahead: string[];
};

const lookahead: string[] = Array.from({ length: 5 }, () => pieceGenerator.getNextPiece());
console.log(lookahead);

export function step(): NewBoard {
    // Cycle a new piece to piece LIFO.
    lookahead.push(pieceGenerator.getNextPiece());
    const nextPieceType = lookahead.shift()!;

    const [column, rotation, score] = findBestMove(board, nextPieceType, calcScore);

    let lost;
    [board, lost] = dropPiece([...board], nextPieceType, rotation, column);
    board = clearLines(board);

    return {
        board: board,
        piece: nextPieceType,
        isLost: lost,
        lookahead: lookahead,
    };
}

export function resetBoard(): void {
    board = Array(20).fill(0);
}
