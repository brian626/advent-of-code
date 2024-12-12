
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

let threshold = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    threshold = parseInt(lines[i]);
}

let elf = 1;
const houses: number[] = [0];
let LIMIT = 1000000;

while (elf < LIMIT) {
    for (let i = elf; i <= elf * 50; i += elf) {
        if (houses[i] === undefined) {
            houses[i] = 0;
        }

        // console.log(`elf ${elf} adding ${elf * 11} presents to house ${i}`);
        houses[i] += elf * 11;
        // if (houses[i] >= threshold) {
        //     crossedThreshold = true;
        //     // break;
        // }
    }

    elf += 1;
    // if (houses.filter(x => x >= threshold).length > 0) {
    //     break;
    // }
    // if (elf > LIMIT) {
    //     LIMIT *= 2;
    // }
}

// console.log(houses);
for (let i = 0; i < houses.length; i++) {
    if (houses[i] >= threshold) {
        console.log(i);
        break;
    }
}
console.log(`done`);
// console.log(`done, max was ${Math.max(...houses)}`);
