
import { readFileSync } from 'fs';
import { exit } from 'process';
import { dijkstra } from '../../common/dijkstra';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

const bytePositions: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    bytePositions.push(lines[i].split(',').map(x => parseInt(x)));
}

const space: string[][] = [];

const SIZE = 71;

for (let r = 0; r < SIZE; r++) {
    space[r] = [];
    for (let c = 0; c < SIZE; c++) {
        space[r][c] = '.';
    }
}


const ITERATIONS = 1024;

for (let i = 0; i < ITERATIONS; i++) {
    const [c, r] = bytePositions[i];
    space[r][c] = '#';
}

printSpace();


const graph = {};
for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
        const neighbors = {};
        if (r > 0 && space[r-1][c] === '.') { neighbors[`${r-1},${c}`] = 1; }
        if (r < SIZE - 1 && space[r+1][c] === '.') { neighbors[`${r+1},${c}`] = 1; }
        if (c > 0 && space[r][c-1] === '.') { neighbors[`${r},${c-1}`] = 1; }
        if (c < SIZE - 1 && space[r][c+1] === '.') { neighbors[`${r},${c+1}`] = 1; }

        graph[`${r},${c}`] = neighbors;
    }
}

const distances = dijkstra(graph, `0,0`);
console.log(distances[`${SIZE-1},${SIZE-1}`]);



function printSpace() {
    for (let r = 0; r < space.length; r++) {
        console.log(space[r].join(''));
    }
    console.log();
}
