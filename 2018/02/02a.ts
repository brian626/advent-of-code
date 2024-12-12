
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

let numPairs = 0, numTriplets = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const letterCounts = countLetters(lines[i]);
    // console.log(lines[i]);
    // console.log(letterCounts);
    // console.log();

    numPairs += letterCounts.filter(x => x === 2).length > 0 ? 1 : 0;
    numTriplets += letterCounts.filter(x => x === 3).length > 0 ? 1 : 0;
}


console.log(numPairs, numTriplets);
console.log(numPairs * numTriplets);


function countLetters(s: string): number[] {
    const countsMap: Map<string, number> = new Map<string, number>();

    for (const c of s.split('')) {
        if (countsMap.has(c)) {
            countsMap.set(c, countsMap.get(c) + 1);
        } else {
            countsMap.set(c, 1);
        }
    }

    const counts: number[] = [];
    for (const [_k, v] of countsMap.entries()) {
        counts.push(v);
    }

    return counts;
}
