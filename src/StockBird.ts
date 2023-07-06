import { Tetriminos } from "./Tetriminos";
import { dropPiece } from "./Board";

export function findBestMove(
    board: number[],
    pieceType: string,
    scoreFunc: (arg: number[]) => number
): [number, number, number] {
    const pieceShapes = Tetriminos.get(pieceType)!;

    const bestMove = {
        column: 0,
        rotation: 0,
        score: -1234,
    };

    for (let col = 0; col < 10; col++) {
        for (let r = 0; r < pieceShapes.length; r++) {
            const [newBoard, lost] = dropPiece([...board], pieceType, r, col);
            if (lost) continue;

            const score = scoreFunc(newBoard);

            if (score > bestMove.score) {
                bestMove.column = col;
                bestMove.rotation = r;
                bestMove.score = score;
            }
        }
    }

    return [bestMove.column, bestMove.rotation, bestMove.score];
}

export function calcScoreOnParams(matrix: number[], weights: number[]): number {
    const heights = clacHeights(matrix);

    const score =
        -weights[0] * clacTotalHeight(heights) +
        weights[1] * countCompleteLines(matrix) +
        -weights[2] * countHoles(matrix) +
        -weights[3] * calcBumpiness(heights);

    return score;
}

export function calcScore(matrix: number[]): number {
    const heights = clacHeights(matrix);
    // const score =
    //     -0.5 * clacTotalHeight(heights) +
    //     0.8 * countCompleteLines(matrix) +
    //     -1 * countHoles(matrix) +
    //     -0.2 * calcBumpiness(heights);

    const score =
        -0.01923576804514789 * clacTotalHeight(heights) +
        0.6242115366444645 * countCompleteLines(matrix) +
        -0.7805047117058082 * countHoles(matrix) +
        -0.02832556712058955 * calcBumpiness(heights);

    return score;
}

function clacHeights(matrix: number[]): number[] {
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

function clacTotalHeight(heights: number[]): number {
    return heights.reduce((sum, x) => sum + x, 0);
}

function countCompleteLines(matrix: number[]): number {
    let count = 0;
    matrix.forEach((row) => {
        if (row === 1023) count++;
    });
    return count;
}

function countHoles(matrix: number[]): number {
    let count = 0;
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 10; x++) {
            if ((matrix[y] >> x) & 1 && !((matrix[y + 1] >> x) & 1)) count++;
        }
    }
    return count;
}

function calcBumpiness(heights: number[]): number {
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
        bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    return bumpiness;
}
