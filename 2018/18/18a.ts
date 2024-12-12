
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

let grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

const width = grid[0].length;
const height = grid.length;

const TIME = 10;

// printGrid(0);

for (let i = 0; i < TIME; i++) {
    const newGrid: string[][] = [];

    for (let r = 0; r < height; r++) {
        newGrid[r] = [];

        for (let c = 0; c < width; c++) {
            const [neighborTrees, neighborLumbers] = countNeighbors(r, c);
            newGrid[r][c] = grid[r][c];

            switch (grid[r][c]) {
                case '.':
                    if (neighborTrees >= 3) { newGrid[r][c] = '|'; }
                    break;

                case '|':
                    if (neighborLumbers >= 3) { newGrid[r][c] = '#'; }
                    break;

                case '#':
                    if (neighborTrees === 0 || neighborLumbers === 0) { newGrid[r][c] = '.'; }
                    break;

                default:
                    break;
            }
        }
    }

    grid = newGrid;

    // printGrid(i+1);
}

let trees = 0, lumber = 0;
for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
        if (grid[r][c] === '|') { trees++; }
        else if (grid[r][c] === '#') { lumber++; }
    }
}

console.log(trees * lumber);

function printGrid(t: number): void {
    console.log(`After ${t} minutes:`);
    for (let r = 0; r < height; r++) {
        console.log(grid[r].join(''));
    }
    console.log();
}


function countNeighbors(r: number, c: number): [number, number] {
    let numOpen = 0, numTrees = 0, numLumber = 0;

    if (r > 0) {
        if (c > 0) {
            if (grid[r - 1][c - 1] === '|') { numTrees++; }
            else if (grid[r - 1][c - 1] === '#') { numLumber++; }
            else { numOpen++; }
        }
        if (grid[r - 1][c] === '|') { numTrees++; }
        else if (grid[r - 1][c] === '#') { numLumber++; }
        else { numOpen++; }
        if (c < width - 1) {
            if (grid[r - 1][c + 1] === '|') { numTrees++; }
            else if (grid[r - 1][c + 1] === '#') { numLumber++; }
            else { numOpen++; }
        }
    }

    if (c > 0) {
        if (grid[r][c - 1] === '|') { numTrees++; }
        else if (grid[r][c - 1] === '#') { numLumber++; }
        else { numOpen++; }
    }
    if (c < width - 1) {
        if (grid[r][c + 1] === '|') { numTrees++; }
        else if (grid[r][c + 1] === '#') { numLumber++; }
        else { numOpen++; }
    }

    if (r < height - 1) {
        if (c > 0) {
            if (grid[r + 1][c - 1] === '|') { numTrees++; }
            else if (grid[r + 1][c - 1] === '#') { numLumber++; }
            else { numOpen++; }
        }
        if (grid[r + 1][c] === '|') { numTrees++; }
        else if (grid[r + 1][c] === '#') { numLumber++; }
        else { numOpen++; }
        if (c < width - 1) {
            if (grid[r + 1][c + 1] === '|') { numTrees++; }
            else if (grid[r + 1][c + 1] === '#') { numLumber++; }
            else { numOpen++; }
        }
    }

    return [numTrees, numLumber];
}
