
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./01.input', 'utf-8');

const lines = file.split('\n');

let freq = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    freq += parseInt(lines[i]);
}

console.log(freq);
