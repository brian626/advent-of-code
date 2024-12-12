
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

let grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

const layouts: Set<string> = new Set<string>();
layouts.add(condenseGrid());

const MINUTES = 100;

console.log(`Initial state:`);
printGrid();

for (let i = 0; i < MINUTES; i++) {
    const newGrid: string[][] = [];

    for (let r = 0; r < grid.length; r++) {
        newGrid[r] = [];

        for (let c = 0; c < grid[0].length; c++) {
            const numAdjacentBugs = countAdjacentBugs(r, c);
            if (grid[r][c] === '#') {
                if (numAdjacentBugs !== 1) {
                    newGrid[r][c] = '.';
                } else {
                    newGrid[r][c] = '#';
                }
            } else if (grid[r][c] === '.') {
                if (numAdjacentBugs === 1 || numAdjacentBugs === 2) {
                    newGrid[r][c] = '#';
                } else {
                    newGrid[r][c] = '.';
                }
            }
        }
    }

    grid = newGrid;

    // console.log(`After ${i+1} minutes:`);
    // printGrid();

    if (layouts.has(condenseGrid())) {
        // printGrid();
        console.log(calculateBiodiversity());
        break;
    }

    layouts.add(condenseGrid());
}


function countAdjacentBugs(r: number, c: number): number {
    let bugs = 0;

    if (r > 0) {
        if (grid[r-1][c] === '#') { bugs++; }
    }
    if (r < grid.length - 1) {
        if (grid[r+1][c] === '#') { bugs++; }
    }
    if (c > 0) {
        if (grid[r][c-1] === '#') { bugs++; }
    }
    if (c < grid[0].length - 1) {
        if (grid[r][c+1] === '#') { bugs++; }
    }

    return bugs;
}


function condenseGrid(): string {
    let s = '';
    for (let i = 0; i < grid.length; i++) {
        s += grid[i].join('');
    }

    return s;
}


function printGrid(): void {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(''));
    }

    console.log();
}


function calculateBiodiversity(): number {
    let b = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '#') {
                b += Math.pow(2, (r * grid[0].length) + c);
            }
        }
    }

    return b;
}
