
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./25.test', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

}
