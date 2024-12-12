
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

// ULL
// RRDDD
// LURDL
// UUUUD

const keypad: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
]

let rPos = 1;
let cPos = 1;
let code = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    move(lines[i]);
    code += keypad[rPos][cPos];
}

console.log(code);


function move(s: string): void {
    for (const c of s) {
        switch (c) {
            case 'U': rPos--; break;
            case 'D': rPos++; break;
            case 'L': cPos--; break;
            case 'R': cPos++; break;
        }

        if (rPos < 0) { rPos = 0; }
        else if (rPos > 2) { rPos = 2; }

        if (cPos < 0) { cPos = 0; }
        else if (cPos > 2) { cPos = 2; }
    }
}
