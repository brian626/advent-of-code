
import { readFileSync } from 'fs';
import { exit } from 'process';
import * as crypto from 'crypto';
export const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest("hex");

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

let salt = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    salt = lines[i];
}

let index = 0;

let keys: string[] = [];

while (keys.length < 64) {
    const key = findNextKey();
    keys.push(key);
}

// console.log(keys);
console.log(index - 1);


function findNextKey(): string {
    let key = '';

    while (true) {
        // console.log(`hashing ${salt + index.toString()}`);
        const hash = md5(salt + index.toString());
        const triple = getTriplet(hash);
        if (triple !== '') {
            // console.log(`  index ${index} produced ${triple}${triple}${triple}`);
            if (hasQuintet(triple)) {
                // console.log(`  found ${triple + triple + triple + triple + triple}`);
                console.log(`${index}: ${hash}`);
                key = hash;
                index++;
                break;
            }
        }

        index++;
    }

    return key;
}


function getTriplet(s: string): string {
    for (let i = 0; i < s.length - 2; i++) {
        if (s[i] === s[i+1] && s[i] === s[i+2]) {
            return s[i];
        }
    }

    return '';
}


function hasQuintet(s: string): boolean {
    for (let i = index + 1; i < index + 1000; i++) {
        const hash = md5(salt + i.toString());
        if (hash.includes(s + s + s + s + s)) {
            return true;
        }
    }

    return false;
}
