
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

let numElves = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    numElves = parseInt(lines[i]);
}


// Determine which power of three applies
let powerOfThree = 0;
for (let x = 2; x < 100; x++) {
    const lowRange = Math.pow(3, x);
    const highRange = Math.pow(3, x + 1)
    if (numElves > lowRange && numElves <= highRange) {
        console.log(`${numElves} is between ${lowRange} (3^${x}) and ${highRange} (3^${x + 1})`);
        powerOfThree = x;
        break;
    }
}

// Determine if we want the lower half or the upper half
const lowRange = Math.pow(3, powerOfThree);
const highRange = Math.pow(3, powerOfThree + 1);
const midRange = (lowRange + highRange) / 2;

if (numElves <= midRange) {
    console.log(`winner is ${numElves - lowRange}`);
} else {
    console.log(`winner is ${highRange - 2 * (highRange - numElves)}`);
}
