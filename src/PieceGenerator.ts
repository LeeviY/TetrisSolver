import { PieceLetters } from "./Tetriminos";
import seedrandom from "seedrandom";

export class PieceGenerator {
    private _shuffledPieces: string[] = [];
    private _currentIndex: number = 0;
    private rng;

    constructor(seed: number) {
        this.rng = seedrandom(seed.toString());
    }

    private shufflePieces(): void {
        this._shuffledPieces = [...PieceLetters];
        for (let i = this._shuffledPieces.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(this.rng() * (i + 1));
            [this._shuffledPieces[i], this._shuffledPieces[randomIndex]] = [
                this._shuffledPieces[randomIndex],
                this._shuffledPieces[i],
            ];
        }
        this._currentIndex = 0;
    }

    public getNextPiece(): string {
        if (this._currentIndex >= this._shuffledPieces.length) {
            this.shufflePieces();
        }
        const nextPiece = this._shuffledPieces[this._currentIndex];
        this._currentIndex++;
        return nextPiece;
    }
}
