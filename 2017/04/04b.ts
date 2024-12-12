
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./04.input', 'utf-8');

const lines = file.split('\n');

const passwords: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    passwords.push(lines[i]);
}

let count = 0;

for (const p of passwords) {
    if (isValid(p)) {
        count++;
    }
}

console.log(count);


function isValid(p: string): boolean {
    const words: Set<string> = new Set<string>();

    for (const w of p.split(' ')) {
        const ww = w.split('').sort((a, b) => a.localeCompare(b)).join('');
        if (words.has(ww)) {
            return false;
        }

        words.add(ww);
    }

    return true;
}
