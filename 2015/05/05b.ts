
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

let total = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (isNice(lines[i])) { total += 1; }
}

console.log(total);

function isNice(s: string): boolean {
    // console.log(`testing ${s}`);
    const c = s.split('');

    let hasPair = false;
    for (let i = 0; i < c.length - 2; i++) {
        const pair = c[i] + c[i+1];
        if (s.slice(i + 2).includes(pair)) {
            // console.log(`${s} has a pair that repeats twice: ${pair}`);
            hasPair = true;
            break;
        }
    }

    // if (!hasPair) { return false; }

    let hasTriplet = false;
    for (let i = 0; i < c.length - 2; i++) {
        if (c[i] === c[i+2]) {
            // console.log(`${s} has a triplet: ${c[i]}${c[i+1]}${c[i+2]}`);
            hasTriplet = true;
            break;
        }
    }

    // console.log('');
    return hasPair && hasTriplet;
}
