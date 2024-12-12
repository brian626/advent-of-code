
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

let total = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [length, width, height] = lines[i].split('x').map(x => parseInt(x));

    const ribbon = 2 * Math.min(length + width, width + height, height + length) + (length * width * height);
    total += ribbon;
}

console.log(total);
