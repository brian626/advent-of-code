
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

const platform: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    platform[i] = lines[i].split('');
}

// printPlatform(platform, 'original');

const FULL_CYCLES = 1000000000;
const CYCLES = 1000;
const loads: number[] = [calculateLoad(platform)];

for (let i = 0; i < CYCLES; i++) {
    // if (i % 1000000 === 0) { console.log(`${i/1000000}`); }
    for (let r = 1; r < platform.length; r++) {
        for (let c = 0; c < platform[0].length; c++) {
            if (platform[r][c] === 'O') {
                moveRockNorth(platform, r, c);
            }
        }
    }

    // printPlatform(platform, 'after tilting north');

    for (let r = 0; r < platform.length; r++) {
        for (let c = 1; c < platform[0].length; c++) {
            if (platform[r][c] === 'O') {
                moveRockWest(platform, r, c);
            }
        }
    }

    // printPlatform(platform, 'after tilting west');

    for (let r = platform.length - 1; r >= 0; r--) {
        for (let c = 0; c < platform[0].length; c++) {
            if (platform[r][c] === 'O') {
                moveRockSouth(platform, r, c);
            }
        }
    }

    // printPlatform(platform, 'after tilting south');

    for (let r = 0; r < platform.length; r++) {
        for (let c = platform[0].length - 1; c >= 0; c--) {
            if (platform[r][c] === 'O') {
                moveRockEast(platform, r, c);
            }
        }
    }

    // printPlatform(platform, 'after tilting east');

    // printPlatform(platform, `after ${i+1} cycles`);

    loads[i+1] = calculateLoad(platform);
}

// console.log();
// printPlatform(platform, 'final');

// console.log(loads);


// Find the repeating pattern in the loads
let startOfPattern = 0;
let lengthOfPattern = 2;
let foundPattern = false;

while (!foundPattern) {
    for (let j = 0; j < loads.length - lengthOfPattern; j++) {
        startOfPattern = j;
        const initialPattern = loads.slice(startOfPattern, startOfPattern + lengthOfPattern + 1).join(',');
        for (let i = startOfPattern + lengthOfPattern + 1; i < loads.length - lengthOfPattern; i += lengthOfPattern) {
            if (loads.slice(i, i + lengthOfPattern + 1).join(',') === initialPattern) {
                // console.log(`pattern found! loads from ${startOfPattern} to ${startOfPattern + lengthOfPattern} match ${i} to ${i + lengthOfPattern}`);
                // console.log(initialPattern);
                foundPattern = true;
            }
            break;
        }

        if (foundPattern) { break; }
    }

    lengthOfPattern += 1;
}

console.log(loads[startOfPattern + ((FULL_CYCLES - startOfPattern) % lengthOfPattern)]);



function calculateLoad(p: string[][]): number {
    let load = 0;

    for (let r = 0; r < p.length; r++) {
        for (let c = 0; c < p[0].length; c++) {
            if (p[r][c] === 'O') {
                load += (p.length - r);
            }
        }
    }

    return load;
}

function moveRockNorth(p: string[][], r: number, c: number) {
    let sourceRow = r;
    let destinationRow = r-1;

    while (destinationRow >= 0 && p[destinationRow][c] === '.') {
        p[destinationRow][c] = p[sourceRow][c];
        p[sourceRow][c] = '.';
        sourceRow -= 1;
        destinationRow -= 1;
    }
}

function moveRockSouth(p: string[][], r: number, c: number) {
    let sourceRow = r;
    let destinationRow = r+1;

    while (destinationRow < p.length && p[destinationRow][c] === '.') {
        p[destinationRow][c] = p[sourceRow][c];
        p[sourceRow][c] = '.';
        sourceRow += 1;
        destinationRow += 1;
    }
}

function moveRockWest(p: string[][], r: number, c: number) {
    let sourceCol = c;
    let destinationCol = c-1;

    while (destinationCol >= 0 && p[r][destinationCol] === '.') {
        p[r][destinationCol] = p[r][sourceCol];
        p[r][sourceCol] = '.';
        sourceCol -= 1;
        destinationCol -= 1;
    }
}

function moveRockEast(p: string[][], r: number, c: number) {
    let sourceCol = c;
    let destinationCol = c+1;

    while (destinationCol < p[0].length && p[r][destinationCol] === '.') {
        p[r][destinationCol] = p[r][sourceCol];
        p[r][sourceCol] = '.';
        sourceCol += 1;
        destinationCol += 1;
    }
}


function printPlatform(p: string[][], l: string) {
    console.log(l);

    for (let r = 0; r < p.length; r++) {
        console.log(p[r].join(''));
    }

    console.log();
}
