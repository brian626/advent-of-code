
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./01.input', 'utf-8');

const lines = file.split('\n');

let digits: string = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    digits = lines[i];
}

let sum = 0;

for (let i = 0; i < digits.length; i++) {
    let nextDigit = i + (digits.length / 2);
    while (nextDigit >= digits.length) {
        nextDigit -= digits.length;
    }

    if (digits[i] === digits[nextDigit]) {
        // console.log(`B: ${digits[i]} === ${digits[i+1]}`);
        sum += parseInt(digits[i]);
    }
}

console.log(sum);
