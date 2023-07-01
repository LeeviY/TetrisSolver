import { Board } from "./boardv2";

const board = new Board();

function getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function getNextPiece(): string {
    return board.getNextPiece();
}

export function step(nextPiece: string): number[] {
    board.dropPiece(nextPiece, 0, getRandomInRange(0, 9));
    //board.printBoard();
    return board.getBoard();
}
