export class Board {
    private _board: number[] = Array(20).fill(0);
    public _tetriminos: Map<string, number[][]> = new Map();

    private pieceLetters: string[] = ["I", "J", "L", "O", "S", "T", "Z"];
    private shuffledPieces: string[] = [];
    private currentIndex: number = 0;

    constructor() {
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

    public toBin(s: string): number {
        return parseInt(s, 2);
    }

    public printBoard(): void {
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

    public getBoard(): number[] {
        return this._board;
    }

    public dropPiece(piece: string, rotation: number, column: number): void {
        const pieceShapes = this._tetriminos?.get(piece);
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
