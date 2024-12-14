
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let steps = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps = parseInt(lines[i]);
}

let currentPos = 0;
let valueAfter0 = -1


for (let i = 1; i <= 50_000_000; i++) {
    if (i % 250000 === 0) {
        console.log(`after ${i} iterations, the value after 0 is ${valueAfter0}`);
    }

    // Step forward
    currentPos = (currentPos + steps) % i + 1;

    if (currentPos === 1) {
        valueAfter0 = i;
    }
}

console.log(`the value after 0 is ${valueAfter0}`);

// 15977985 is too low
