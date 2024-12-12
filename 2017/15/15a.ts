
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

let valueA = 0, valueB = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(' ')
    if (valueA === 0) { valueA = parseInt(parts[parts.length - 1]); }
    else if (valueB === 0) { valueB = parseInt(parts[parts.length - 1]); }
}

console.log(valueA, valueB);

let count = 0;

for (let i = 0; i < 40000000; i++) {
    if (i % 100000 === 0) { console.log(i); }
    valueA = (valueA * 16807) % 2147483647;
    valueB = (valueB * 48271) % 2147483647;

    if ((valueA & 0xFFFF) === (valueB & 0xFFFF)) {
        count++;
    }
}

console.log(count);
