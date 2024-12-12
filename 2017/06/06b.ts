
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./06.input', 'utf-8');

const lines = file.split('\n');

let banks: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    banks = lines[i].replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));
}


const states: Map<string, number> = new Map<string, number>();
let state = banks.join(',');
let cycles = 0;
let cycleStart = 0;

while (!states.has(state) || states.get(state) !== 2) {
    console.log(banks);

    cycles++;
    if (states.has(state)) {
        states.set(state, states.get(state) + 1);
    } else {
        states.set(state, 1);
        cycleStart = cycles;
    }

    const maxBlocks = Math.max(...banks);
    const indexOfMaxBlocks = banks.indexOf(maxBlocks);
    let blocksToDistribute = banks[indexOfMaxBlocks];
    banks[indexOfMaxBlocks] = 0;

    let i = indexOfMaxBlocks + 1;
    if (i >= banks.length) { i = 0; }
    while (blocksToDistribute > 0) {
        // console.log(`${blocksToDistribute} remaining to distribute, adding ${blocksPerBank} to bank ${i}`);
        banks[i] += 1;

        blocksToDistribute -= 1;

        i++;
        if (i >= banks.length) { i = 0; }
    }

    state = banks.join(',');
}

console.log(banks);
console.log(cycles - cycleStart);
