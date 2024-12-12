
import { readFileSync } from 'fs';
import { exit, off } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

const offsets: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    offsets.push(parseInt(lines[i]));
}

let currentOffset = 0;
let steps = 0;

while (currentOffset < offsets.length) {
    // console.log(offsets, currentOffset);
    const prevOffset = currentOffset;
    currentOffset += offsets[prevOffset];
    offsets[prevOffset] += 1;

    steps++;

    // if (steps > 10) { break; }
}

// console.log(offsets, currentOffset);
console.log(steps);
