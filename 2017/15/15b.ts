
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
let pairs = 0;

while (pairs < 5000000) {
    valueA = generate(valueA, 16807, 4);
    valueB = generate(valueB, 48271, 8);

    pairs++;

    if ((valueA & 0xFFFF) === (valueB & 0xFFFF)) {
        // console.log(valueA, valueB);
        count++;
    }
}
// for (let i = 0; i < 40000000; i++) {
//     if (i % 100000 === 0) { console.log(i); }
//     valueA = (valueA * 16807) % 2147483647;
//     valueB = (valueB * 48271) % 2147483647;

//     if ((valueA & 0xFFFF) === (valueB & 0xFFFF)) {
//         count++;
//     }
// }


console.log(count);


function generate(v: number, m: number, d: number): number {
    while (true) {
        v = (v * m) % 2147483647;
        if (v % d === 0) { return v; }
    }
}
