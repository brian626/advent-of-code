const DEBUG = false;

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

let inputLengths: number[];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    inputLengths = lines[i].split(',').map(x => parseInt(x));
}

let list: number[] = [];
for (let i = 0; i < 256; i++) {
    list.push(i);
}

// debug(inputLengths);
debug(list.toString());

let currentPosition = 0;
let skipSize = 0;

while (inputLengths.length > 0) {
    const length = inputLengths.shift();
    console.log(`reverse ${length} elements starting at position ${currentPosition}`);

    // Left-shift the list so that the rotation doesn't wrap
    for (let i = 0; i < currentPosition; i++) {
        list.push(list.shift());
    }

    debug(`  left-shifted: ${list}`);

    list = list.slice(0, length).reverse().concat(list.slice(length));

    debug(`  left-shifted and rotated: ${list}`);

    // Shift the list back
    for (let i = 0; i < currentPosition; i++) {
        list.unshift(list.pop());
    }

    debug(`  rotated: ${list}`);

    currentPosition += (length + skipSize);
    while (currentPosition > list.length) {
        currentPosition -= list.length;
    }
    skipSize++;

    debug(list.toString());
}

console.log(list[0] * list[1]);


function debug(s: string) {
    if (DEBUG) { console.log(s); }
}

// 21170 is too low
