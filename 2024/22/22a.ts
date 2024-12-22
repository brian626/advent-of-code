
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

const COUNT = 2000;

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let secretNumber = parseInt(lines[i]);

    for (let i = 0; i < COUNT; i++) {
        secretNumber = nextSecretNumber(secretNumber);
    }
    // console.log(`${parseInt(lines[i])}: ${secretNumber}`);

    sum += secretNumber;
}

console.log(sum);


function nextSecretNumber(n: number): number {
    const b = mix(n, n * 64);
    const c = prune(b);

    const e = mix(c, Math.floor(c / 32));
    const f = prune(e);

    let h = mix(f, f * 2048);

    let i = prune(h);
    if (i < 0) {
        i += 16777216;
    }

    return i;
}


function mix(n1: number, n2: number): number {
    return n1 ^ n2;
}

function prune(n1: number): number {
    return n1 % 16777216;
}
