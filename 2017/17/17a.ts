
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let steps = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps = parseInt(lines[i]);
}

let buffer: number[] = [0];
let bufferLength = 1;
let currentPos = 0;

for (let i = 1; i <= 2017; i++) {
    // printBuffer();

    // Step forward
    for (let j = 0; j < steps; j++) {
        currentPos++;
        if (currentPos >= bufferLength) { currentPos = 0; }
    }

    // Insert
    buffer = buffer.slice(0, currentPos + 1).concat([i]).concat(buffer.slice(currentPos + 1));
    bufferLength += 1;

    // Update current position
    currentPos = currentPos + 1;
    if (currentPos >= bufferLength) { currentPos = 0; }
}

// printBuffer();
const p = buffer.indexOf(2017);
console.log(buffer[p+1]);


function printBuffer(): void {
    let s = '';
    for (let i = 0; i < bufferLength; i++) {
        if (i === currentPos) { s += `(${buffer[i]}) `; }
        else { s += `${buffer[i]} `; }
    }
    console.log(s);
}
