
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

const universe: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    universe[i] = lines[i].split('');
}

// printUniverse(universe);

// Find empty rows
const emptyRows: number[] = [];
for (let r = 0; r < universe.length; r++) {
    if (universe[r].filter(x => x === '#').length === 0) {
        emptyRows.push(r);
    }
}
// console.log(emptyRows);
// console.log();

// Find empty columns
const emptyColumns: number[] = [];
for (let c = 0; c < universe[0].length; c++) {
    const column: string[] = [];
    for (let r = 0; r < universe.length; r++) {
        column.push(universe[r][c]);
    }
    if (column.filter(x => x === '#').length === 0) {
        emptyColumns.push(c);
    }
}
// console.log(emptyColumns);
// console.log();

// Find (expanded) galaxies
const EXPANSION = 1000000 - 1;
const galaxies: number[][] = [];
for (let r = 0; r < universe.length; r++) {
    for (let c = 0; c < universe[0].length; c++) {
        if (universe[r][c] === '#') {
            let rowExpansion = 0;
            for (const er of emptyRows) { if (r > er) { rowExpansion += EXPANSION;} }
            let colExpansion = 0;
            for (const ec of emptyColumns) { if (c > ec) { colExpansion += EXPANSION;} }

            galaxies.push([r+rowExpansion, c+colExpansion]);
        }
    }
}
console.log(galaxies);

// Calculate distances of pairs
const distances: number[] = [];
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        // console.log(`${galaxies[i]} -> ${galaxies[j]}`);
        distances.push(calculateDistance(galaxies[i], galaxies[j]));
    }
}
// console.log(distances);

// Print sum
console.log(distances.reduce((x, y) => x + y));


function printUniverse(g: string[][]) {
    for (let r = 0; r < g.length; r++) {
        console.log(g[r].join(''));
    }
    console.log();
}

function calculateDistance(g1: number[], g2: number[]): number {
    return Math.abs(g2[0] - g1[0]) + Math.abs(g2[1] - g1[1]);
}

// 82000210 is too low
// 82000292 is too low
