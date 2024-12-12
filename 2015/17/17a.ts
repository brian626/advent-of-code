
import { readFileSync } from 'fs';
import { exit } from 'process';
import { powerset } from '../../common/powerset';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

const containers: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    containers.push(parseInt(lines[i]));
}

// console.log(containers);

const pset: number[][] = powerset(containers);

// console.log(pset);

let count = 0;

for (const st of pset) {
    if (st.reduce((x, y) => x + y, 0) === 150) {
        count += 1;
    }
}

console.log(count);
