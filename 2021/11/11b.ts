// It seems like the individual flashes aren't bright enough to navigate. However, you
// might have a better option: the flashes seem to be synchronizing!

// In the example above, the first time all octopuses flash simultaneously is step 195:

// After step 193:
// 5877777777
// 8877777777
// 7777777777
// 7777777777
// 7777777777
// 7777777777
// 7777777777
// 7777777777
// 7777777777
// 7777777777

// After step 194:
// 6988888888
// 9988888888
// 8888888888
// 8888888888
// 8888888888
// 8888888888
// 8888888888
// 8888888888
// 8888888888
// 8888888888

// After step 195:
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000
// 0000000000

// If you can calculate the exact moments when the octopuses will all flash simultaneously,
// you should be able to navigate through the cavern. What is the first step during which
// all octopuses flash?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

class Octopus {
    energyLevel: number;
    flashed: boolean;
}

const octopuses: Octopus[][] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 0) {
        octopuses[i] = new Array();
        for (let j = 0; j < lines[i].length; j++) {
            const o: Octopus = new Octopus();
            o.energyLevel = parseInt(lines[i][j]);
            o.flashed = false;
            octopuses[i].push(o);
        }
    }
}

// console.log(`initial state`);
// console.log(octopuses);

const STEPS = 1000;
let numFlashes = 0;

for (let i = 0; i < STEPS; i++) {
    numFlashes += increment(octopuses);

    if (synchronized(octopuses)) {
        console.log(i+1);
        break;
    }
}

function synchronized(octopuses: Octopus[][]): boolean {
    for (let r = 0; r < octopuses.length; r++) {
        for (let c = 0; c < octopuses[0].length; c++) {
            if (octopuses[r][c].energyLevel > 0) {
                return false;
            }
        }
    }

    return true;
}

function increment(octopuses: Octopus[][]): number {
    // Increment every octopus' energy level.
    for (let r = 0; r < octopuses.length; r++) {
        for (let c = 0; c < octopuses[0].length; c++) {
            // console.log(`incrementing octopus ${r}, ${c}`)
            octopuses[r][c].energyLevel += 1;
        }
    }

    // console.log(`after incrementing`);
    // console.log(octopuses);

    // Check if any octopuses need to flash.
    let numFlashes = 0;
    let octopusFlashed = false;
    do {
        octopusFlashed = false;
        for (let r = 0; r < octopuses.length; r++) {
            for (let c = 0; c < octopuses[0].length; c++) {
                if (octopuses[r][c].energyLevel > 9 && octopuses[r][c].flashed === false) {
                    octopuses[r][c].flashed = true;
                    numFlashes++;
                    octopusFlashed = true;
                    flashOctopus(octopuses, r, c);
                }
            }
        }
    } while (octopusFlashed);

    // Reset any octopuses that flashed.
    for (let r = 0; r < octopuses.length; r++) {
        for (let c = 0; c < octopuses[0].length; c++) {
            if (octopuses[r][c].energyLevel > 9) {
                octopuses[r][c].energyLevel = 0;
                octopuses[r][c].flashed = false;
            }
        }
    }

    return numFlashes;
}

function flashOctopus(octopuses: Octopus[][], r: number, c: number) {
    if (r > 0 && c > 0) { octopuses[r-1][c-1].energyLevel += 1; }
    if (r > 0) { octopuses[r-1][c].energyLevel += 1; }
    if (r > 0 && c < octopuses[0].length - 1) { octopuses[r-1][c+1].energyLevel += 1; }
    if (c > 0) { octopuses[r][c-1].energyLevel += 1; }
    if (c < octopuses[0].length - 1) { octopuses[r][c+1].energyLevel += 1; }
    if (r < octopuses.length - 1 && c > 0) { octopuses[r+1][c-1].energyLevel += 1; }
    if (r < octopuses.length - 1) { octopuses[r+1][c].energyLevel += 1; }
    if (r < octopuses.length - 1 && c < octopuses[0].length - 1) { octopuses[r+1][c+1].energyLevel += 1; }
}
