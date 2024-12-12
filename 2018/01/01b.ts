
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./01.input', 'utf-8');

const lines = file.split('\n');

const changes: number[] = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    changes.push(parseInt(lines[i]));
}

let freq = 0;
const freqSet: Set<number> = new Set<number>();
let i = 0;

while (true) {
    // console.log(`Current frequency ${freq}, change of ${changes[i]}; resulting frequency ${freq + changes[i]}.`);

    freq += changes[i];
    i++;
    if (i >= changes.length) { i = 0; }

    if (freqSet.has(freq)) { break; }
    else { freqSet.add(freq); }
}


console.log(freq);
