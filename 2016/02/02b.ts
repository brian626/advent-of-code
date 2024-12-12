
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

const keypad: string[][] = [
    ['-', '-', '1', '-', '-'],
    ['-', '2', '3', '4', '-'],
    ['5', '6', '7', '8', '9'],
    ['-', 'A', 'B', 'C', '-'],
    ['-', '-', 'D', '-', '-'],
]

let rPos = 2;
let cPos = 0;
let code = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    move(lines[i]);
    code += keypad[rPos][cPos];
}

console.log(code);


function move(s: string): void {
    console.log(`starting at ${rPos},${cPos} and moving ${s}`);

    for (const c of s) {
        console.log(`  ${c}`);
        switch (c) {
            case 'U':
                if (rPos > 0 && keypad[rPos - 1][cPos] !== '-') { rPos--; }
                break;
            case 'D':
                if (rPos < 4 && keypad[rPos + 1][cPos] !== '-') { rPos++; }
                break;
            case 'L':
                if (cPos > 0 && keypad[rPos][cPos - 1] !== '-') { cPos--; }
                break;
            case 'R':
                if (cPos < 4 && keypad[rPos][cPos + 1] !== '-') { cPos++; }
                break;
        }
        console.log(`  ${rPos},${cPos}`);
    }

    console.log(`moved to ${rPos},${cPos}`);
    console.log();
}
