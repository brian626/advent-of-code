import { readFileSync } from 'fs';
import { exit } from 'process';
import * as crypto from 'crypto';

const file = readFileSync('./04.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(solve(lines[i]));
}

function solve(s: string): number {
    let n = 1;

    while (true) {
        const hash = crypto.createHash('md5');
        hash.update(s + n.toString());

        const hashedString = hash.digest('hex');

        // console.log(n);
        // console.log(hashedString);

        if (hashedString.startsWith('00000')) {
            return n;
        }

        n += 1;
    }
}
