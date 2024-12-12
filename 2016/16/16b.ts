
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

let initialState: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    initialState = lines[i].split('');
}

const LENGTH = 35651584;

while (initialState.length <= LENGTH) {
    const a = Array.from(initialState);
    const b = Array.from(a);
    b.reverse();

    for (let i = 0; i < b.length; i++) {
        b[i] = (b[i] === '1') ? '0' : '1';
    }

    // console.log(`a: ${a}, b: ${b}`);
    initialState = a.concat(['0']).concat(b);
    // console.log(initialState);
}


const data = initialState.slice(0, LENGTH);

// console.log(data.join(''));

let checksum: string[] = calculateChecksum(data);

console.log(checksum.join(''));


function calculateChecksum(d: string[]): string[] {
    let i = 0;
    let c: string[] = [];

    while (i < d.length - 1) {
        if (d[i] === d[i+1]) { c.push('1'); }
        else { c.push('0'); }
        i += 2;
    }

    while (c.length % 2 === 0) {
        c  = calculateChecksum(c);
    }

    return c;
}
