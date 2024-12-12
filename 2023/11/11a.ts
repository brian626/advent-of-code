
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

// Expand empty rows
const expandedRow: string[] = [];
for (let c = 0; c < universe[0].length; c++) {
    expandedRow.push('.');
}

const expandedRowsUniverse: string[][] = [];

for (let r = 0; r < universe.length; r++) {
    if (emptyRows.includes(r)) {
        expandedRowsUniverse.push(expandedRow.join('').split(''));
    }
    expandedRowsUniverse.push(universe[r].join('').split(''));
}
// printUniverse(expandedRowsUniverse);

// Expand empty columns
const expandedColumnsUniverse: string[][] = [];

for (let r = 0; r < expandedRowsUniverse.length; r++) {
    expandedColumnsUniverse[r] = [];
    for (let c = 0; c < expandedRowsUniverse[0].length; c++) {
        if (emptyColumns.includes(c)) {
            expandedColumnsUniverse[r].push('.');
        }
        expandedColumnsUniverse[r].push(expandedRowsUniverse[r][c]);
    }
}
// printUniverse(expandedColumnsUniverse);

// Find galaxies
const galaxies: number[][] = [];
for (let r = 0; r < expandedColumnsUniverse.length; r++) {
    for (let c = 0; c < expandedColumnsUniverse[0].length; c++) {
        if (expandedColumnsUniverse[r][c] === '#') {
            galaxies.push([r,c]);
        }
    }
}
// console.log(galaxies);

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
