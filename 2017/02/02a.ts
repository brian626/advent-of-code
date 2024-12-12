
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

let checksum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // console.log()
    const values: number[] = lines[i].replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));
    values.sort((a, b) => b - a);
    console.log(values);
    checksum += (values[0] - values[values.length - 1]);
}

console.log(checksum);

// 16020 is too low
