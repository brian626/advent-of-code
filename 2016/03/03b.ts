
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

let count = 0;

let specs: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    specs.push(lines[i]);
}

let i = 0;
while (i <= specs.length - 3) {
    const row1 = specs[i].replace(/^\s*/, '').replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));
    const row2 = specs[i+1].replace(/^\s*/, '').replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));
    const row3 = specs[i+2].replace(/^\s*/, '').replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));

    if (isValidTriangle(`${row1[0]} ${row2[0]} ${row3[0]}`)) { count++; }
    if (isValidTriangle(`${row1[1]} ${row2[1]} ${row3[1]}`)) { count++; }
    if (isValidTriangle(`${row1[2]} ${row2[2]} ${row3[2]}`)) { count++; }

    i += 3;
}

console.log(count);


function isValidTriangle(s: string): boolean {
    const sides = s.replace(/^\s*/, '').replace(/\s+/g, ' ').split(' ').map(x => parseInt(x)).sort((a, b) => a - b);
    console.log(`is ${sides[0]} + ${sides[1]} === ${sides[0] + sides[1]} > ${sides[2]}?`);
    return (sides[0] + sides[1]) > sides[2];
}

// 1833 is too low
// 3956 is too high
