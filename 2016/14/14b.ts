
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

const hashes: Map<number, string> = new Map<number, string>();

// Fill up the hashes array
for (let i = 0; i < 30000; i++) {
    if (i % 250 === 0) { console.log(i); }
    const hash = stretchHash(salt + i.toString());
    const triplet = getTriplet(hash);
    if (triplet !== '') {
        hashes.set(i, hash);
    }
}

// console.log(hashes);

// Search for keys
let keyIndices: number[] = [];

for (const [index, hash] of hashes) {
    const triplet = getTriplet(hash);
    for (let i = index + 1; i < index + 1000; i++) {
        const quintet = hashes.has(i) ? getQuintet(hashes.get(i)) : '';
        if (quintet === triplet) {
            // console.log(`found quintet at index ${i}`);
            console.log(`found key at index ${index} (matching quintet at index ${i})`);
            keyIndices.push(index);
            break;
        }
    }
}

console.log(keyIndices[63]);

// let index = 0;

// let keys: string[] = [];

// while (keys.length < 64) {
//     const key = findNextKey();
//     keys.push(key);
// }

// // console.log(keys);
// console.log(index - 1);


// function findNextKey(): string {
//     let key = '';

//     while (true) {
//         if (index % 100 === 0) { console.log(index); }

//         // console.log(`hashing ${salt + index.toString()}`);
//         const hash = stretchHash(salt + index.toString());
//         const triple = getTriplet(hash);

//         if (triple !== '') {
//             if (hasQuintet(triple)) {
//                 console.log(`${index}: ${hash}`);
//                 key = hash;
//                 index++;
//                 break;
//             }
//         }

//         index++;
//     }

//     return key;
// }


function getTriplet(s: string): string {
    for (let i = 0; i < s.length - 2; i++) {
        if (s[i] === s[i + 1] && s[i] === s[i + 2]) {
            // console.log(`  triplet search: index ${index} found ${s[i]}${s[i+1]}${s[i+2]} in ${s}`);
            return s[i];
        }
    }

    return '';
}


function getQuintet(s: string): string {
    for (let i = 0; i < s.length - 2; i++) {
        if (s[i] === s[i + 1] && s[i] === s[i + 2] && s[i] === s[i + 3] && s[i] === s[i + 4]) {
            // console.log(`  quintet search: index ${index} found ${s[i]}${s[i]}${s[i]}${s[i]}${s[i]} in ${s}`);
            return s[i];
        }
    }

    return '';
}


// function hasQuintet(s: string): boolean {
//     for (let i = index + 1; i < index + 1000; i++) {
//         const hash = stretchHash(salt + i.toString());
//         if (hash.includes(s + s + s + s + s)) {
//             // console.log(`  quintet search: index ${i} found ${s}${s}${s}${s}${s} in ${hash}`);
//             return true;
//         }
//     }

//     return false;
// }


function stretchHash(s: string): string {
    let hash = md5(s);

    for (let i = 0; i < 2016; i++) {
        hash = md5(hash);
    }

    return hash;
}
