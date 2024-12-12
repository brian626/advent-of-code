
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
    let password = '';

    let index = 0;
    while (password.length < 8) {
        const h = md5(s + index.toString());
        if (h.startsWith('00000')) {
            password += h[5];
            console.log(s + index.toString(), password);
        }

        index++;
    }


    return password;
}
