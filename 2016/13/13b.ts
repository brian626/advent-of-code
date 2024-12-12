
import { readFileSync } from 'fs';
import { exit } from 'process';
import { dijkstra } from '../../common/dijkstra';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

let favorite = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    favorite = parseInt(lines[i]);
}

const grid: string[][] = [];

const SIZE = 40;

for (let r = 0; r < SIZE; r++) {
    grid[r] = [];

    for (let c = 0; c < SIZE; c++) {
        let code = (c * c) + (3 * c) + (2 * r * c) + r + (r * r) + favorite;
        const numOnes = code.toString(2).split('').filter(x => x === '1').length;
        if (numOnes % 2 === 0) { grid[r][c] = '.'; }
        else { grid[r][c] = '#'; }
    }
}

const graph = {};
for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === '#') { continue; }

        const name = `${r},${c}`;
        const neighbors = {};

        if (r > 0 && grid[r - 1][c] === '.') {
            neighbors[`${r - 1},${c}`] = 1;
        }
        if (r < SIZE - 1 && grid[r + 1][c] === '.') {
            neighbors[`${r + 1},${c}`] = 1;
        }
        if (c > 0 && grid[r][c - 1] === '.') {
            neighbors[`${r},${c - 1}`] = 1;
        }
        if (c < SIZE - 1 && grid[r][c + 1] === '.') {
            neighbors[`${r},${c + 1}`] = 1;
        }

        graph[name] = neighbors;
    }
}

// console.log(graph)

const distances = dijkstra(graph, '1,1');
let count = 0;
for (const d in distances) {
    if (distances[d] <= 50) { count++; }
}
console.log(count);

function printGrid() {
    let row = '   ';
    for (let i = 0; i < SIZE; i++) {
        row += i;
    }
    console.log(row);

    for (let i = 0; i < SIZE; i++) {
        row = `${i} `;
        for (let j = 0; j < SIZE; j++) {
            row += grid[i][j];
        }
        console.log(row);
    }
}
