
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

const ITERATIONS = 50;

for (let i = 0; i < ITERATIONS; i++) {
    console.log(i);
    result = lookAndSay(result);
}

// console.log(result);
console.log(result.length);


function lookAndSay(s: string): string {
    let pos = 0;
    let ret = '';

    while (pos < s.length) {
        let char = s[pos];
        let n = 0;
        let charCount = 0;

        while (s[pos + n] === char ) {
            charCount++;
            n++;
        }

        ret += `${charCount}${char}`;
        pos += n;
    }

    return ret;
}
