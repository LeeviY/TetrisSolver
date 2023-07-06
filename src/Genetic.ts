import { dropPiece, clearLines, printBoard } from "./Board";
import { PieceGenerator } from "./PieceGenerator";
import { calcScoreOnParams, findBestMove } from "./StockBird";
import { isEqual } from "lodash";

class Individual {
    genes: number[];
    fitness: {
        cleared: number;
        scoreTotal: number;
        lost: boolean;
    };

    constructor(genes: number[]) {
        this.genes = genes;
        this.fitness = {
            cleared: 0,
            scoreTotal: 0,
            lost: false,
        };
    }

    compare(other: Individual): number {
        if (!this.fitness.lost && other.fitness.lost) {
            return -1;
        } else if (this.fitness.lost === other.fitness.lost) {
            if (this.fitness.cleared > other.fitness.cleared) {
                return -1;
            } else if (this.fitness.cleared === other.fitness.cleared) {
                if (this.fitness.scoreTotal > other.fitness.scoreTotal) {
                    return -1;
                } else if (this.fitness.scoreTotal === other.fitness.scoreTotal) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    normalize() {
        const norm = Math.sqrt(this.genes.reduce((acc, curr) => acc + curr * curr, 0));
        this.genes = this.genes.map((x) => x / norm);
    }

    mutate() {
        const quantity = Math.random() * 0.4 - 0.2;
        const index = Math.floor(Math.random() * 4);
        this.genes[index] += quantity;
    }

    calculateFitness(seed: number): [number, number, boolean] {
        let counterSum = 0;
        let scoreTotalSum = 0;
        let lostSum = 0;

        const pieceGenerator = new PieceGenerator(seed);
        for (let i = 0; i < 3; i++) {
            let board: number[] = Array(20).fill(0);
            const lookahead: string[] = Array.from({ length: 5 }, () =>
                pieceGenerator.getNextPiece()
            );

            const scoreFunc = (board: number[]): number => {
                return calcScoreOnParams(board, this.genes);
            };

            let counter = 0;
            let scoreTotal = 0;
            let lost = false;
            while (!lost && counter < 1000) {
                lookahead.push(pieceGenerator.getNextPiece());
                const nextPieceType = lookahead.shift()!;

                const [column, rotation, score] = findBestMove(board, nextPieceType, scoreFunc);
                scoreTotal += score;

                [board, lost] = dropPiece([...board], nextPieceType, rotation, column);
                board = clearLines(board);

                counter++;
            }

            counterSum += counter;
            scoreTotalSum = scoreTotal;
            lostSum += lost ? 1 : 0;
        }

        return [counterSum / 3, scoreTotalSum / 3, lostSum > 0 ? true : false];
    }
}

export class GeneticAlgorithm {
    population: Individual[];
    populationSize: number;
    generation: number = 0;
    survivalChance: number = 0.1;

    constructor(populationSize: number) {
        this.populationSize = populationSize;
        this.population = [];
    }

    compare(some: Individual, other: Individual): number {
        if (some.fitness.lost !== other.fitness.lost) {
            return some.fitness.lost ? 1 : -1;
        }

        if (some.fitness.cleared !== other.fitness.cleared) {
            return other.fitness.cleared - some.fitness.cleared;
        }

        if (some.fitness.scoreTotal !== other.fitness.scoreTotal) {
            return other.fitness.scoreTotal - some.fitness.scoreTotal;
        }

        return 0;
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const individual = new Individual(Array.from({ length: 4 }, () => Math.random()));
            this.population.push(individual);
        }
    }

    evaluateFitness(population: Individual[]) {
        for (let individual of population) {
            const [counter, scoreTotal, lost] = individual.calculateFitness(Math.random());
            individual.fitness = {
                cleared: counter,
                scoreTotal: scoreTotal,
                lost: lost,
            };
        }
    }

    selection(): [Individual, Individual] {
        const randomCandidates = new Set<Individual>();
        for (let i = 0; i < this.population.length / 10; i++) {
            randomCandidates.add(
                this.population[Math.floor(Math.random() * this.population.length)]
            );
        }

        const sorted = Array.from(randomCandidates).sort(this.compare);
        return [sorted[0], sorted[1]];
    }

    // crossover(parent1: Individual, parent2: Individual): Individual {
    //     const genes = Array.from({ length: 4 }).map(
    //         (_, i) =>
    //             parent1.fitness.cleared * parent1.genes[i] +
    //             parent2.fitness.cleared * parent2.genes[i]
    //     );
    //     const child = new Individual(genes);
    //     child.normalize();
    //     return child;
    // }

    crossover(parent1: Individual, parent2: Individual): Individual {
        const diff = parent1.fitness.cleared / parent2.fitness.cleared;
        const genes = Array.from({ length: 4 }).map((_, i) =>
            Math.random() * diff > 0.5 ? parent1.genes[i] : parent2.genes[i]
        );
        const child = new Individual(genes);
        //child.normalize();
        return child;
    }

    deleteNLastReplacement(newCandidates: Individual[]) {
        this.population.splice(-newCandidates.length);
        this.population.push(...newCandidates);
        this.evaluateFitness(this.population);
        this.population.sort(this.compare);
    }

    run() {
        this.initializePopulation();
        this.evaluateFitness(this.population);
        this.population.sort(this.compare);

        let count = 0;
        while (count < 50) {
            console.log(`Generation ${count}`);
            const newCandidates = Array(Math.floor(this.population.length / 3));
            for (var i = 0; i < this.population.length / 3; i++) {
                const pair = this.selection();
                const candidate = this.crossover(pair[0], pair[1]);
                if (Math.random() < 0.05) {
                    candidate.mutate();
                }
                candidate.normalize();
                newCandidates[i] = candidate;
            }
            this.deleteNLastReplacement(newCandidates);

            console.log(
                `Average cleared: ${
                    this.population.reduce((acc, curr) => curr.fitness.cleared + acc, 0) /
                    this.population.length
                }`
            );
            console.log(
                `Average score: ${
                    this.population.reduce((acc, curr) => curr.fitness.scoreTotal + acc, 0) /
                    this.population.length
                }`
            );
            console.log("Fittest candidate = " + JSON.stringify(this.population[0]));
            count++;
        }
    }

    getBestIndividual(): Individual {
        return this.population.reduce((max, obj) => (obj.fitness > max.fitness ? obj : max));
    }
}
