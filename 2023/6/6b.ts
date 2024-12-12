
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./6.input', 'utf-8');

const lines = file.split('\n');

let times: number[] = [];
let distances: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(':');
    if (parts[0] === 'Time') {
        times = [parseInt(parts[1].split('').filter(x => x !== ' ').join(''))];
    } else if (parts[0] === 'Distance') {
        distances = [parseInt(parts[1].split('').filter(x => x !== ' ').join(''))];
    }
}

console.log(times);
console.log(distances);
let product = 1;

for (let i = 0; i < times.length; i++) {
    // console.log(`Race #${i}`);
    const time = times[i];
    let winners = 0;

    // j represents how long the button is held for
    for (let j = 0; j < time; j++) {
        const speed = j;
        const distance = speed * (time - j);
        if (distance > distances[i]) {
            // console.log(`Button held for ${j} milliseconds, total distance is ${distance} millimeters`);
            winners += 1;
        }
    }
    // console.log('');

    if (winners > 0) { product *= winners; }
}

console.log(product);
