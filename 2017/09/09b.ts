
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');
let total = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const score = calculateScore(lines[i]);
    console.log(score);
    total += score;
}

console.log(total);


function calculateScore(s: string): number {
    console.log(s);

    // Step 1: Remove any canceled characters within garbage.
    let workstr = '';
    let inGarbage = false;
    let pos = 0;

    while (pos < s.length) {
        let skipNextChar = false;

        if (s[pos] === '<' && !inGarbage) { inGarbage = true; }

        else if (s[pos] === '!' && inGarbage) { pos += 1; skipNextChar = true; }

        else if (s[pos] === '>' && inGarbage) { inGarbage = false; }

        if (!skipNextChar) {
            workstr += s[pos];
        }
        pos++;
    }

    console.log(workstr);

    let score = 0;
    let garbageOpens: number[] = [];
    inGarbage = false;
    for (let i = 0; i < workstr.length; i++) {
        if (!inGarbage && workstr[i] === '<') {
            garbageOpens.push(i);
            inGarbage = true;
        } else if (inGarbage && workstr[i] === '>') {
            console.log(`closed garbage starting at position ${garbageOpens[garbageOpens.length - 1]} '${workstr.slice(garbageOpens[garbageOpens.length - 1], i + 1)}' with score ${i - garbageOpens[garbageOpens.length - 1] - 1}`);
            score += i - garbageOpens[garbageOpens.length - 1] - 1;
            garbageOpens.pop();
            inGarbage = false;
        }
    }

    return score;
}
