
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const nextPassword = generate(lines[i].split('').map(x => x.charCodeAt(0) - 'a'.charCodeAt(0)));
    console.log(`The next password after ${lines[i]} is ${nextPassword}`);
}


function generate(c: number[]): string {
    let next = increment(c);

    while (true) {
        if (hasStraight(next) && !hasIOL(next) && hasTwoPairs(next)) {
            return String.fromCharCode(...(next.map(x => x + 'a'.charCodeAt(0))));
        }

        next = increment(next);
    }
}

function increment(c: number[]): number[] {
    for (let i = c.length - 1; i >= 0; i--) {
        c[i] += 1;
        if (c[i] >= 26) {
            c[i] = 0;
        } else {
            break;
        }
    }
    return c;
}

function hasStraight(c: number[]): boolean {
    for (let i = 0; i < c.length - 3; i++) {
        if (c[i] === (c[i+1] - 1) && c[i] === (c[i+2] - 2)) {
            return true;
        }
    }

    return false;
}

function hasIOL(c: number[]): boolean {
    return c.includes(8) || c.includes(11) || c.includes(14);
}

function hasTwoPairs(c: number[]): boolean {
    let numPairs = 0;

    let i = 0;
    while (i < c.length - 1) {
        if (c[i] === c[i+1]) {
            numPairs++;
            i++;
        }

        i++;
    }

    return numPairs === 2;
}
