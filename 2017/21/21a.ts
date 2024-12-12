
import { readFileSync } from 'fs';
import { exit } from 'process';

class Rule {
    // input: string[][];
    // output: string[][];

    // constructor(inp: string[][], out: string[][]) {
    //     this.input = inp;
    //     this.output = out;
    // }
    input: string;
    rotations: string[];
    output: string;
    size: number;

    constructor(i: string, o: string) {
        this.input = i;
        this.output = o;
        this.size = i.split('/')[0].length;
        this.rotations = [];

        this.calculateRotations();
    }

    calculateRotations(): void {
        const i = this.input;
        this.rotations.push(i);
        if (this.size === 2) {
            this.rotations.push(`${i[1]}${i[0]}/${i[4]}${i[3]}`);
            this.rotations.push(`${i[3]}${i[4]}/${i[0]}${i[1]}`);
            this.rotations.push(`${i[3]}${i[0]}/${i[4]}${i[1]}`);
            this.rotations.push(`${i[4]}${i[3]}/${i[1]}${i[0]}`);
            this.rotations.push(`${i[1]}${i[4]}/${i[0]}${i[3]}`);
            this.rotations.push(`${i[0]}${i[3]}/${i[1]}${i[4]}`);
            this.rotations.push(`${i[4]}${i[1]}/${i[3]}${i[0]}`);
        } else {
            this.rotations.push(`${i[2]}${i[1]}${i[0]}/${i[5]}${i[4]}${i[3]}/${i[8]}${i[7]}${i[6]}`);
            this.rotations.push(`${i[6]}${i[7]}${i[8]}/${i[3]}${i[4]}${i[5]}/${i[0]}${i[1]}${i[2]}`);
            this.rotations.push(`${i[6]}${i[3]}${i[0]}/${i[7]}${i[4]}${i[1]}/${i[8]}${i[5]}${i[2]}`);
            this.rotations.push(`${i[8]}${i[7]}${i[6]}/${i[5]}${i[4]}${i[3]}/${i[2]}${i[1]}${i[0]}`);
            this.rotations.push(`${i[2]}${i[5]}${i[8]}/${i[1]}${i[4]}${i[7]}/${i[0]}${i[3]}${i[6]}`);
            this.rotations.push(`${i[0]}${i[3]}${i[6]}/${i[1]}${i[4]}${i[7]}/${i[2]}${i[5]}${i[8]}`);
            this.rotations.push(`${i[8]}${i[5]}${i[2]}/${i[7]}${i[4]}${i[1]}/${i[6]}${i[3]}${i[0]}`);
        }
    }
}


const file = readFileSync('./21.test', 'utf-8');

const lines = file.split('\n');

const rules: Rule[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [inp, out] = lines[i].split(' => ');
    // const a: string[][] = [];
    // for (const b of inp.split('/')) { a.push(b.split('')); }

    // const c: string[][] = [];
    // for (const d of out.split('/')) { c.push(d.split('')); }

    // rules.push(new Rule(a, c));
    rules.push(new Rule(inp, out));
}

// console.log(rules[0]);
// console.log(rules[0].input);
// console.log(rules[0].output);

let grid: string[][] = [
    ['.','#','.'],
    ['.','.','#'],
    ['#','#','#'],
];

const ITERATIONS = 1;
for (let i = 0; i < ITERATIONS; i++) {
    printGrid();

    const size = grid.length;
    let newGridStr = '';
    const subsquares: string[][][] = [];
    if (size % 2 === 0) {
        // Divide into 2x2 subsquares
    } else if (size % 3 === 0) {
        // Divide into 3x3 subsquares
    }

    if (size % 2 === 0) {

    } else if (size % 3 === 0) {
        const numSquares = size / 3;
        for (let r = 0; r < numSquares; r++) {
            // newGrid[r] = [];

            for (let c = 0; c < numSquares; c++) {
                let subsquare = grid[r][c] + grid[r][c + 1] + grid[r][c + 2] + '/' +
                    grid[r + 1][c] + grid[r + 1][c + 1] + grid[r + 1][c + 2] + '/' +
                    grid[r + 2][c] + grid[r + 2][c + 1] + grid[r + 2][c + 2];

                // newRows.push(match(grid(r][c])));
                const m = match(subsquare, 3);
                if (m.length > 0) {
                    console.log(`subsquare ${subsquare} transforms to ${m}`);
                    // newGrid[r] = newGrid[r].concat(m);
                    newGridStr = m;
                } else {
                    console.log(`no match for subsquare ${subsquare}`);
                }
            }
        }

        let newR = 0;
        const newGrid: string[][] = [];
        newGrid[0] = [];
        for (const g of newGridStr.split('')) {
            // console.log(`examining '${g}'`);
            if (g === '/') {
                newR++;
                newGrid[newR] = [];
            } else {
                newGrid[newR].push(g);
            }
        }
        // newGrid[0] = newGrid[0].slice(0, newGrid[1].length);
        grid = newGrid;
    }
}

printGrid();


function match(inp: string, size: number): string {
    const matchingRules: Rule[] = rules.filter(x => x.size === size);
    for (const r of matchingRules) {
        if (r.rotations.includes(inp)) {
            return r.output;
        }
    }

    return '';
}


function printGrid(): void {
    for (let r = 0; r < grid.length; r++) {
        console.log(grid[r].join(''));
    }
    console.log();
}
