
import { readFileSync } from 'fs';
import { exit } from 'process';
import { powerset } from '../../common/powerset';

const file = readFileSync('./24.test', 'utf-8');

const lines = file.split('\n');

const packages: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    packages.push(parseInt(lines[i]));
}

packages.sort((a, b) => b - a);
// console.log(packages);

const sum = packages.reduce((a, b) => a + b, 0);
const targetGroupSum = sum / 3;

// Find all groups that sum to targetGroupSum
const ps = powerset(packages);

const equalGroups: number[][] = [];
for (const s of ps) {
    if (s.reduce((a, b) => a + b, 0) === targetGroupSum) {
        // console.log(s);
        equalGroups.push(s);
    }
}


// Now look for non-intersecting triplets
const triplets: number[][][] = []
for (let i = 0; i < equalGroups.length; i++) {
    for (let j = 0; j < equalGroups.length; j++) {
        if (i === j) { continue; }

        for (let k = 0; k < equalGroups.length; k++) {
            if ((i === k) || (j === k)) { continue; }

            if (!intersects(equalGroups[i], equalGroups[j]) &&
                !intersects(equalGroups[i], equalGroups[k]) &&
                !intersects(equalGroups[j], equalGroups[k])) {
                triplets.push([equalGroups[i], equalGroups[j], equalGroups[k]]);
            }
        }
    }
}

triplets.sort((a, b) => a[0].length - b[0].length);
let minGroup1Size = Infinity;
for (const t of triplets) {
    minGroup1Size = Math.min(minGroup1Size, t[0].length);
}

// console.log(triplets);

let minQE = Infinity;
for (const t of triplets) {
    if (t[0].length !== minGroup1Size) { continue; }
    const t0 = t[0];
    // const product = t0.reduce((a, b) => a * b, 1);
    // if (product < minQE) {
    //     minQE = product;
    //     console.log(t0);
    // }
    minQE = Math.min(minQE, t0.reduce((a, b) => a * b, 1));
}

console.log(minQE);

function intersects(a: number[], b: number[]): boolean {
    for (const x of a) {
        if (b.includes(x)) { return true; }
    }

    return false;
}


// powerset doesn't work for full input
// putting sorted list into sheets enabled me to do it by hand, lol
