
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

    // Step 2: Remove any garbage
    let workstr2 = '';
    inGarbage = false;
    pos = 0;
    while (pos < workstr.length) {
        if (workstr[pos] === '<' && !inGarbage) { inGarbage = true; }

        else if (workstr[pos] === '>' && inGarbage) { pos++; inGarbage = false; }

        if (!inGarbage) { workstr2 += workstr[pos]; }

        pos++;
    }

    console.log(workstr2);

    let depth = 0;
    let score = 0;
    let groupOpens: number[] = [];
    for (let i = 0; i < workstr2.length; i++) {
        if (workstr2[i] === '{') {
            groupOpens.push(i);
            depth += 1;
        } else if (workstr2[i] === '}') {
            console.log(`closed group starting at position ${groupOpens[groupOpens.length - 1]} '${workstr2.slice(groupOpens[groupOpens.length - 1], i + 1)}' with score ${depth}`);
            groupOpens.pop();
            score += depth;
            depth -= 1;
        }
    }

    return score;
}
