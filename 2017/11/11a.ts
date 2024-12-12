
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(countSteps(lines[i]));
}


function countSteps(p: string): number {
    const path: string[] = p.split(',');

    let x = 0, y = 0, z = 0;

    for (const p of path) {
        switch (p) {
            case 'n':  y += 1; z -= 1; break;
            case 's':  y -= 1; z += 1; break;
            case 'ne': x += 1; z -= 1; break;
            case 'nw': y += 1; x -= 1; break;
            case 'se': y -= 1; x += 1; break;
            case 'sw': x -= 1; z += 1; break;
            default: break;
        }
    }

    return (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;
}
