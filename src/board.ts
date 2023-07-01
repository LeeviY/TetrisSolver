export class Board {
    private _board: string[][] = Array(20)
        .fill("")
        .map(() => Array(10).fill(""));
    public _tetriminos: Map<string, number[][][]> = new Map();

    private pieceLetters: string[] = ["I", "J", "L", "O", "S", "T", "Z"];
    private shuffledPieces: string[] = [];
    private currentIndex: number = 0;

    constructor() {
        this._tetriminos.set("J", [
            [
                [0, 1],
                [0, 1],
                [1, 1],
            ],
            [
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [1, 1],
                [1, 0],
                [1, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
            ],
        ]);
        this._tetriminos.set("L", [
            [
                [1, 0],
                [1, 0],
                [1, 1],
            ],
            [
                [1, 1, 1],
                [1, 0, 0],
            ],
            [
                [1, 1],
                [0, 1],
                [0, 1],
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
            ],
        ]);
        this._tetriminos.set("I", [[[1], [1], [1], [1]], [[1, 1, 1, 1]]]);
        this._tetriminos.set("O", [
            [
                [1, 1],
                [1, 1],
            ],
        ]);
        this._tetriminos.set("T", [
            [
                [0, 1, 0],
                [1, 1, 1],
            ],
            [
                [1, 0],
                [1, 1],
                [1, 0],
            ],
            [
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1],
                [1, 1],
                [0, 1],
            ],
        ]);
        this._tetriminos.set("S", [
            [
                [0, 1, 1],
                [1, 1, 0],
            ],
            [
                [1, 0],
                [1, 1],
                [0, 1],
            ],
        ]);
        this._tetriminos.set("Z", [
            [
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1],
                [1, 1],
                [1, 0],
            ],
        ]);

        this.printBoard();
    }

    public printBoard(): void {
        for (let i = 0; i < 20; i++) {
            let s = i.toString().padStart(2) + " |";
            for (let j = 0; j < 10; j++) {
                const value = this._board[i][j];
                s += ` ${value ? value : " "}`;
            }
            console.log(s);
        }
        console.log("------------------------");
        console.log("   | 0 1 2 3 4 5 6 7 8 9");
        //console.log(this._board);
    }

    public getBoard(): string[][] {
        return this._board;
    }

    public dropPiece(piece: string, rotation: number, column: number): void {
        const pieceShapes = this._tetriminos.get(piece);
        if (!pieceShapes) {
            console.log("Invalid piece type");
            return;
        }
        const pieceShape = pieceShapes[rotation];
        const pieceWidth = pieceShape[0].length;

        column = Math.max(0, column - pieceWidth);

        let row = -pieceShape.length;
        let pieceRow = pieceShape.length - 1;
        for (let y = 0; y < this._board.length; y++, row++) {
            const currentRow = this._board[y];
            if (pieceRow < 0) {
                row--;
                break;
            }
            for (let x = 0; x < pieceWidth; x++) {
                if (pieceShape[pieceRow][x] && currentRow[x + column]) {
                    y--;
                    pieceRow--;
                    row--;
                    break;
                }
            }
        }

        console.log(row);

        for (let y = 0; y < pieceShape.length; y++) {
            for (let x = 0; x < pieceShape[y].length; x++) {
                if (pieceShape[y][x]) this._board[row + y][column + x] = piece;
            }
        }
    }

    private shufflePieces(): void {
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

    public getNextPiece(): string {
        if (this.currentIndex >= this.shuffledPieces.length) {
            this.shufflePieces();
        }
        const nextPiece = this.shuffledPieces[this.currentIndex];
        this.currentIndex++;
        return nextPiece;
    }
}
