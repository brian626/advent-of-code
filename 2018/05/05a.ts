
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

let polymer = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    polymer = lines[i];
}


while (true) {
    // console.log(polymer);
    let removedUnit = false;

    for (let i = 0; i < polymer.length - 1; i++) {
        if (Math.abs(polymer[i].codePointAt(0) - polymer[i+1].codePointAt(0)) === 32) {
            polymer = polymer.slice(0, i) + polymer.slice(i + 2);
            removedUnit = true;
            break;
        }
    }

    if (!removedUnit) { break; }
}

console.log(polymer.length);
