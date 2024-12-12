
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

let serialNumber = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    serialNumber = parseInt(lines[i]);
}

let largestPowerLevel = -1 * Math.pow(2, 32);
let largestX = -1, largestY = -1;

// const pl = getPowerLevel(101, 153);
for (let x = 1; x < 299; x++) {
    for (let y = 1; y < 299; y++) {
        const pl = getPowerLevel(x, y) +
                   getPowerLevel(x + 1, y) +
                   getPowerLevel(x + 2, y) +
                   getPowerLevel(x, y + 1) +
                   getPowerLevel(x + 1, y + 1) +
                   getPowerLevel(x + 2, y + 1) +
                   getPowerLevel(x, y + 2) +
                   getPowerLevel(x + 1, y + 2) +
                   getPowerLevel(x + 2, y + 2);
        if (pl > largestPowerLevel) {
            largestPowerLevel = pl;
            largestX = x;
            largestY = y;
        }
    }
}

console.log(largestPowerLevel);
console.log(`${largestX},${largestY}`);


function getPowerLevel(x: number, y: number): number {
    // Find the fuel cell's rack ID, which is its X coordinate plus 10.
    const rackID = x + 10;

    // Begin with a power level of the rack ID times the Y coordinate.
    let powerLevel = rackID * y;

    // Increase the power level by the value of the grid serial number (your puzzle input).
    powerLevel += serialNumber;

    // Set the power level to itself multiplied by the rack ID.
    powerLevel *= rackID;

    // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
    if (powerLevel < 100) {
        powerLevel = 0;
    } else {
        powerLevel = Math.floor(powerLevel / 100) % 10;
    }

    // Subtract 5 from the power level.
    powerLevel -= 5;

    return powerLevel;
}
