
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./1.input', 'utf-8');

const lines = file.split('\n');

function isDigit(c: string): boolean {
    return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
}

function stringToNum(s: string): number {
    if (s === 'one') { return 1; }
    if (s === 'two') { return 2; }
    if (s === 'three') { return 3; }
    if (s === 'four') { return 4; }
    if (s === 'five') { return 5; }
    if (s === 'six') { return 6; }
    if (s === 'seven') { return 7; }
    if (s === 'eight') { return 8; }
    if (s === 'nine') { return 9; }

    return 0;

}

function findFirstDigit(s: string): number {
    for (let j = 0; j < s.length; j++) {
        if (isDigit(s[j])) { return parseInt(s[j]); }

        for (let k = 0; k < j; k++) {
            const n = stringToNum(s.slice(k, j + 1));
            if (n > 0) { return n; }
        }
    }

    return 0;
}

function findLastDigit(s: string): number {
    for (let j = s.length - 1; j >= 0; j--) {
        if (isDigit(s[j])) { return parseInt(s[j]); }

        for (let k = j + 1; k < s.length; k++) {
            const n = stringToNum(s.slice(j, k + 1));
            if (n > 0) { return n; }
        }
    }
}

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.length === 0) { continue; }

    let digitOne = findFirstDigit(line);
    let digitTwo = findLastDigit(line);

    sum += digitOne * 10 + digitTwo;
}

console.log(sum);
