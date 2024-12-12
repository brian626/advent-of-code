
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

let polymer = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    polymer = lines[i];
}


let minLength = Math.pow(2, 32);
for (let i = 'a'.codePointAt(0); i <= 'z'.codePointAt(0); i++) {
    console.log(String.fromCharCode(i));
    let newPolymer = polymer.replaceAll(String.fromCharCode(i), '').replaceAll(String.fromCharCode(i - 32), '');
    if (polymer.length === newPolymer.length) { continue; }
    // console.log(`removed ${String.fromCharCode(i)} => ${newPolymer}`);

    while (true) {
        let removedUnit = false;

        for (let i = 0; i < newPolymer.length - 1; i++) {
            if (Math.abs(newPolymer[i].codePointAt(0) - newPolymer[i+1].codePointAt(0)) === 32) {
                newPolymer = newPolymer.slice(0, i) + newPolymer.slice(i + 2);
                removedUnit = true;
                break;
            }
        }

        if (!removedUnit) { break; }
    }

    // console.log(`  reduced to ${newPolymer}, length was ${newPolymer.length}`);
    minLength = Math.min(minLength, newPolymer.length);
}


console.log(minLength);
