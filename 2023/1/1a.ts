
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./1.input', 'utf-8');

const lines = file.split('\n');

function isDigit(c: string): boolean {
    return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
}

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const digits: number[] = lines[i].split('').filter(x => isDigit(x)).map(x => parseInt(x));
    // console.log(lines[i]);
    // console.log(digits);
    sum += digits[0] * 10;

    if (digits.length === 1) {
        sum += digits[0];
    } else {
        sum += digits[digits.length - 1];
    }
}

console.log(sum);
