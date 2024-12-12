
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.test', 'utf-8');

const lines = file.split('\n');

const directions: string[] = [];
const distances: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const [direction, distance, _color] = lines[i].split(' ');
    directions.push(direction);
    distances.push(parseInt(distance));
}

console.log(directions);
console.log(distances);

// Calculate vertices
const vertices: number[][] = [];
let row = 0;
let col = 0;
vertices.push([row, col]);
let lastDirection = directions[0];
for (let i = 0; i < directions.length; i++) {
    if (directions[i] === 'R') {
        col += distances[i];
    }
    else if (directions[i] === 'L') {
        col -= distances[i];
    }
    else if (directions[i] === 'U') {
        row -= distances[i];
    }
    else if (directions[i] === 'D') {
        row += distances[i];
    }

    lastDirection = directions[i];
    vertices.push([row, col]);
}

// vertices.push([0,7]);
// vertices.push([6,7]);
// vertices.push([6,5]);
// vertices.push([7,5]);
// vertices.push([7,7]);
// vertices.push([10,7]);
// vertices.push([10,1]);
// vertices.push([8,1]);
// vertices.push([8,0]);
// vertices.push([5,0]);
// vertices.push([5,2]);
// vertices.push([3,2]);
// vertices.push([3,0]);

console.log(vertices);

// Calculate area
let A = 0;
for (let i = 0; i < vertices.length; i++) {
    const [row1, col1] = vertices[i];
    const [row2, col2] = (i === vertices.length - 1) ? vertices[0] : vertices[i+1];

    console.log(`adding ${row1*col2} - ${row2*col1} = ${row1*col2 - row2*col1}`);
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
