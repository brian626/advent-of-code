const DEBUG = false;

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

let inputLengths: number[];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    inputLengths = lines[i].split('').map(x => x.charCodeAt(0));
}

inputLengths = inputLengths.concat([17, 31, 73, 47, 23]);
// debug(inputLengths.toString());

let list: number[] = [];
for (let i = 0; i < 256; i++) {
    list.push(i);
}

debug(list.toString());

let currentPosition = 0;
let skipSize = 0;
for (let x = 0; x < 64; x++) {
    for (let y = 0; y < inputLengths.length; y++) {
        const length = inputLengths[y];
        debug(`reverse ${length} elements starting at position ${currentPosition}`);

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
}

// Convert list to dense hash
let denseHash: number[] = [];
for (let i = 0; i < 16; i++) {
    let dh = list[i * 16];
    for (let j = 1; j < 16; j++) {
        dh = dh ^ list[(i * 16) + j];
    }

    denseHash[i] = dh;
}

// Convert dense hash to ASCII
let output = '';
for (const d of denseHash) {
    let a = d.toString(16);
    if (a.length === 1) { a = '0' + a; }
    output += a;
}

console.log(output);

function debug(s: string) {
    if (DEBUG) { console.log(s); }
}
