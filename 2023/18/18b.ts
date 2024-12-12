
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.test', 'utf-8');

const lines = file.split('\n');

const directions: string[] = [];
const distances: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const [_direction, _distance, color] = lines[i].split(' ');
    const distance = parseInt(color.slice(2,7), 16);
    distances.push(distance);
    const directionNum = color.slice(7,8);
    if (directionNum === '0') { directions.push('R'); }
    else if (directionNum === '1') { directions.push('D'); }
    else if (directionNum === '2') { directions.push('L'); }
    else if (directionNum === '3') { directions.push('U'); }
}

console.log(directions);
console.log(distances);

// Calculate vertices
const vertices: number[][] = [];
let row = 0;
let col = 0;
vertices.push([row, col]);
for (let i = 0; i < directions.length; i++) {
    if (directions[i] === 'R') { col += distances[i]; }
    else if (directions[i] === 'L') { col -= distances[i]; }
    else if (directions[i] === 'U') { row -= distances[i]; }
    else if (directions[i] === 'D') { row += distances[i]; }

    vertices.push([row, col]);
}

console.log(vertices);

// Calculate area
let A = 0;
for (let i = 0; i < vertices.length - 1; i++) {
    const [row1, col1] = vertices[i];
    const [row2, col2] = (i === vertices.length - 2) ? vertices[0] : vertices[i+1];
    A += (row1*col2 - row2*col1);
}
A = Math.abs(A * 0.5);

console.log(A);



function printGrid(g: string[][]) {
    for (let r = 0; r < g.length; r++) {
        console.log(g[r].join(''));
    }
    console.log();
}
