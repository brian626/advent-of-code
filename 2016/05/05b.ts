
import { readFileSync } from 'fs';
import { exit } from 'process';
import * as crypto from 'crypto';
export const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest("hex");

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(hash(lines[i]));
}

function hash(s: string): string {
    const password: string[] = [];

    let index = 0;
    while (password.join('').length < 8) {
        const h = md5(s + index.toString());
        if (h.startsWith('00000') && parseInt(h[5]) >= 0 && parseInt(h[5]) < 8 && password[parseInt(h[5])] === undefined) {
            password[parseInt(h[5])] = h[6];
            console.log(s + index.toString(), password.join(''));
        }

        index++;
    }


    return password.join('');
}
