
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

let total = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (isNice(lines[i])) { total += 1; }
}

console.log(total);

function isNice(s: string): boolean {
    if (s.includes('ab') || s.includes('cd') || s.includes('pq') || s.includes('xy')) { return false; }

    const c = s.split('');

    let numVowels = 0;
    let hasDouble = false;

    for (let i = 0; i < c.length; i++) {
        if (c[i] === 'a' || c[i] === 'e' || c[i] === 'i' || c[i] === 'o' || c[i] === 'u') { numVowels += 1; }

        if (!hasDouble && i < c.length - 1 && c[i] === c[i+1]) { hasDouble = true; }
    }

    if (numVowels < 3 || !hasDouble) { return false; }

    return true;
}
