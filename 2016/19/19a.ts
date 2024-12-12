
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

let numElves = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    numElves = parseInt(lines[i]);
}

const elves: number[] = [];

for (let i = 0; i < numElves; i++) { elves[i] = 1; }

let done = false;
while (!done) {
    // console.log(elves);

    for (let i = 0; i < numElves; i++) {
        if (elves[i] === 0) { continue; }
        if (elves[i] === numElves) {
            console.log(i+1);
            done = true;
            break;
        }

        let nextElf = i+1;
        if (nextElf === numElves) { nextElf = 0; }

        while (elves[nextElf] === 0) {
            nextElf++;
            if (nextElf === numElves) { nextElf = 0; }
        }

        elves[i] += elves[nextElf];
        elves[nextElf] = 0;
    }
}
