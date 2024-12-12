
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

let totalChars = 0;
let stringChars = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    totalChars += lines[i].length;
    stringChars += eval(lines[i]).length;
}

console.log(totalChars - stringChars);
