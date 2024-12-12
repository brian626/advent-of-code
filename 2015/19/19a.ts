
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

const replacements: Map<string, string[]> = new Map<string, string[]>();
let input = '';

let parsingReplacements = true;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingReplacements = false; continue; }

    if (parsingReplacements) {
        const [before, _, after] = lines[i].split(' ');
        if (replacements.has(before)) {
            const r = replacements.get(before);
            r.push(after);
            replacements.set(before, r);
        } else {
            replacements.set(before, [after]);
        }
    } else {
        input = lines[i];
    }
}

// console.log(input);
// console.log(replacements);

const molecules: Set<string> = new Set<string>();

for (const [pattern, reps] of replacements) {
    if (input.includes(pattern)) {
        let pos = input.indexOf(pattern);
        while (pos !== -1) {
            for (const rep of reps) {
                let m = input.slice(0, pos);
                m += rep;
                m += input.slice(pos + pattern.length);
                molecules.add(m);
            }
            pos = input.indexOf(pattern, pos + pattern.length);
        }
    }
}


// console.log(molecules);
console.log(molecules.size);
