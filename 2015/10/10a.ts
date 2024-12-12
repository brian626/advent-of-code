
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

let input = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    input = lines[i];
}

let result = input;

const ITERATIONS = 40;

for (let i = 0; i < ITERATIONS; i++) {
    result = lookAndSay(result);
}

// console.log(result);
console.log(result.length);


function lookAndSay(s: string): string {
    const chars = s.split('');
    let ret = '';

    while (chars.length) {
        let char = chars[0];
        let charCount = 0;

        while (chars[0] === char ) {
            chars.shift();
            charCount++;
        }

        ret += `${charCount}${char}`;
    }

    return ret;
}
