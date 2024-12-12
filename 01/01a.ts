
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./01.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const floor = calculate(lines[i]);

    console.log(floor);
}


function calculate(s: string): number {
    const instructions: string[] = s.split('');
    return instructions.filter(x => x === '(').length - instructions.filter(x => x === ')').length;
}
