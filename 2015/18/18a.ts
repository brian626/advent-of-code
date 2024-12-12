
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

let grid: number[][] = [];

for (let r = 0; r < lines.length; r++) {
    if (lines[r].length === 0) { continue; }

    grid[r] = lines[r].split('').map(x => x === '#' ? 1 : 0);
}

// console.log(grid);

const STEPS = 100;

for (let i = 0; i < STEPS; i++) {
    const newGrid: number[][] = [];

    for (let r = 0; r < grid.length; r++) {
        newGrid[r] = [];

        for (let c = 0; c < grid[0].length; c++) {
            let onNeighbors = 0;
            if (r > 0) {
                if (c > 0) { onNeighbors += grid[r - 1][c - 1]; }
                onNeighbors += grid[r - 1][c];
                if (c < grid[0].length - 1) { onNeighbors += grid[r - 1][c + 1]; }
            }

            if (c > 0) { onNeighbors += grid[r][c - 1]; }
            if (c < grid[0].length - 1) { onNeighbors += grid[r][c + 1]; }

            if (r < grid.length - 1) {
                if (c > 0) { onNeighbors += grid[r + 1][c - 1]; }
                onNeighbors += grid[r + 1][c];
                if (c < grid[0].length - 1) { onNeighbors += grid[r + 1][c + 1]; }
            }

            // console.log(`grid[${r}][${c}] is currently ${grid[r][c] === 1 ? 'on' : 'off'} and has ${onNeighbors} neighbors that are on`);
            if (grid[r][c] === 1) {
                if (onNeighbors === 2 || onNeighbors === 3) {
                    newGrid[r][c] = 1;
                } else {
                    newGrid[r][c] = 0;
                }
            } else {
                if (onNeighbors === 3) {
                    newGrid[r][c] = 1;
                } else {
                    newGrid[r][c] = 0;
                }
            }
        }
    }

    grid = newGrid;

    // console.log(grid);
}

let count = 0;
for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === 1) { count++; }
    }
}

console.log(count);
