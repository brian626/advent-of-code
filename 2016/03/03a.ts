
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

let count = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (isValidTriangle(lines[i])) { count++; }
}

console.log(count);


function isValidTriangle(s: string): boolean {
    const sides = s.replace(/^\s*/, '').replace(/\s+/g, ' ').split(' ').map(x => parseInt(x)).sort((a, b) => a - b);
    console.log(`is ${sides[0]} + ${sides[1]} === ${sides[0] + sides[1]} > ${sides[2]}?`);
    return (sides[0] + sides[1]) > sides[2];
}
