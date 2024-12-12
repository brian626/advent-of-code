
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

let input = '';
let replacementLines: string[] = [];

let parsingReplacements = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingReplacements = false; continue; }

    if (parsingReplacements) {
        replacementLines.push(lines[i]);
    } else {
        input = lines[i];
    }
}

const replacements: Map<string, string[]> = new Map<string, string[]>();
for (let i = 0; i < replacementLines.length; i++) {
    const [before, _, after] = replacementLines[i].split(' ');
    if (replacements.has(before)) {
        const r = replacements.get(before);
        r.push(after);
        replacements.set(before, r);
    } else {
        replacements.set(before, [after]);
    }
}

// console.log(replacements);

let steps = 0;

while (true) {
    let match = '';
    let replaceToken = '';

    let start = 0;
    let end = input.length;
    while (true) {
        replaceToken = input.slice(start, end);
        for (const [k, v] of replacements) {
            // if (k === 'e' && input.length !== k.length) { continue; }

            // console.log(`does [${v}] include '${replaceToken}'?`);

            if (v.includes(replaceToken)) {
                match = k;
                break;
            }
        }

        if (match.length > 0) { break; }

        if (end < 1) {
            break;
        }

        start++;
        if (start === end) {
            start = 0;
            end--;
        }
    }

    if (replaceToken.length > 0) {
        // console.log(`matched '${match} => ${replaceToken}', start = ${start}, end = ${end}`);
        // console.log(`string will be '${input.slice(0, start)}' + '${match}' + '${input.slice(end, input.length)}'`);
        input = input.slice(0, start) + match + input.slice(end, input.length);
        // console.log(`string is now '${input}'`);
        // console.log();
        steps++;
    } else {
        // console.log(`failed to find a match for '${replaceToken}'`);
        break;
    }

    if (input === 'e') {
        break;
    }
}

console.log(steps);
