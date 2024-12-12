// --- Part Two ---
// Time to check the rest of the slopes - you need to minimize the probability
// of a sudden arboreal stop, after all.

// Determine the number of trees you would encounter if, for each of the following
// slopes, you start at the top-left corner and traverse the map all the way to the bottom:

// Right 1, down 1.
// Right 3, down 1. (This is the slope you already checked.)
// Right 5, down 1.
// Right 7, down 1.
// Right 1, down 2.

// In the above example, these slopes would find 2, 7, 3, 4, and 2 tree(s) respectively;
// multiplied together, these produce the answer 336.

// What do you get if you multiply together the number of trees encountered on each of the listed slopes?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./3.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

let treeArray: number[] = new Array();

const slopes: number[][] = [
    [1,1],
    [3,1],
    [5,1],
    [7,1],
    [1,2]
];

for (let s = 0; s < slopes.length; s++) {
    let c = 0;
    let numTrees = 0;

    for (let r = slopes[s][1]; r < map.length; r += slopes[s][1]) {
        c += slopes[s][0];
        if (c >= map[0].length) {
            c -= map[0].length;
        }

        if (map[r][c] === '#') {
            numTrees += 1;
        }
    }

    treeArray.push(numTrees);
}

console.log(treeArray);

console.log(treeArray.reduce((a,b) => a * b, 1));
