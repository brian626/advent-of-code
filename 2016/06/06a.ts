
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./06.input', 'utf-8');

const lines = file.split('\n');

const messages: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    messages.push(lines[i]);
}

let message = '';

for (let i = 0; i < messages[0].length; i++) {
    const letterMap: Map<string, number> = new Map<string, number>();
    for (let j = 0; j < messages.length; j++) {
        letterMap.set(messages[j][i], letterMap.get(messages[j][i]) + 1 || 0);
    }

    const maxCount = Math.max(...Array.from(letterMap.values()));
    for (const [k, v] of letterMap) {
        if (v === maxCount) {
            message += k;
        }
    }
}

console.log(message);
