import { Tetriminos, PieceLetters } from "./Tetriminos";

export function printBoard(board: number[]): void {
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

export function dropPiece(
    board: number[],
    piece: string,
    rotation: number,
    column: number
): [number[], boolean] {
    const pieceShapes = Tetriminos.get(piece)!;
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

export function clearLines(board: number[]): number[] {
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
