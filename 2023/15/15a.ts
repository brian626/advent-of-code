
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

let steps: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps = lines[i].split(',');
}

let results = 0;

for (const step of steps) {
    let currentValue = 0;
    const chars = step.split('');

    for (const char of chars) {
        currentValue += char.charCodeAt(0);
        currentValue *= 17;
        currentValue = currentValue % 256;
    }

    results += currentValue;
}

console.log(results);
