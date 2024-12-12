// --- Day 5: Supply Stacks ---
// The expedition can depart as soon as the final supplies have been unloaded from the ships.
// Supplies are stored in stacks of marked crates, but because the needed supplies are buried under
// many other crates, the crates need to be rearranged.

// The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates
// get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps.
// After the crates are rearranged, the desired crates will be at the top of each stack.

// The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask
// her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

// They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

//     [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3
//
// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2

// In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom,
// and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D.
// Finally, stack 3 contains a single crate, P.

// Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved
// from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is
// moved from stack 2 to stack 1, resulting in this configuration:

// [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time,
// so the first crate to be moved (D) ends up below the second and third crates:

//         [Z]
//         [N]
//     [C] [D]
//     [M] [P]
//  1   2   3

// Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time,
// crate C ends up below crate M:

//         [Z]
//         [N]
// [M]     [D]
// [C]     [P]
//  1   2   3

// Finally, one crate is moved from stack 1 to stack 2:

//         [Z]
//         [N]
//         [D]
// [C] [M] [P]
//  1   2   3

// The Elves just need to know which crate will end up on top of each stack; in this example, the
// top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and
// give the Elves the message CMZ.

// After the rearrangement procedure completes, what crate ends up on top of each stack?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./5.input', 'utf-8');

const lines = file.split('\n');
let crateLines: string[] = [];
let labelLine = '';
let instructionLines: string[] = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('[')) {
        crateLines.push(line);
    } else if (line.includes('move')) {
        instructionLines.push(line);
    } else if (line.length > 0) {
        labelLine = line;
    }
}

// console.log(crateLines);
// console.log(labelLine);
// console.log(instructionLines);

const numStacks = parseInt(labelLine.trim().split(' ').slice(-1)[0]);
// console.log(numStacks);

const stacks: string[][] = [];
for (let i = 0; i < numStacks; i++) {
    stacks[i] = [];
}

for (let i = 0; i < crateLines.length; i++) {
    const crateLine = crateLines[i];
    let linePos = 1;
    for (let j = 0; j < numStacks; j++) {
        if (crateLine[linePos] && crateLine[linePos].trim().length > 0) {
            stacks[j].push(crateLine[linePos].trim());
        }

        linePos += 4;
    }
}

// console.log(stacks);

const reg = new RegExp('move (\\d+) from (\\d+) to (\\d+)');
for (let i = 0; i < instructionLines.length; i++) {
    const instructionLine = instructionLines[i];
    // console.log(instructionLine);

    const results = reg.exec(instructionLine);
    // console.log(results);

    const numCratesToMove = parseInt(results[1]);
    const fromStack = parseInt(results[2]);
    const toStack = parseInt(results[3]);

    for (let j = 0; j < numCratesToMove; j++) {
        const crateToMove = stacks[fromStack - 1].shift();
        stacks[toStack - 1].unshift(crateToMove);
    }
}

// console.log(stacks);

let output = '';
for (let i = 0; i < numStacks; i++) {
    output += stacks[i][0];
}

console.log(output);
