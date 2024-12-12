// --- Part Two ---
// As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

// Some mud was covering the writing on the side of the crane, and you quickly wipe it away.
// The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

// The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder,
// and the ability to pick up and move multiple crates at once.

// Again considering the example above, the crates begin in the same configuration:

//     [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// Moving a single crate from stack 2 to stack 1 behaves the same as before:

// [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay
// in the same order, resulting in this new configuration:

//         [D]
//         [N]
//     [C] [Z]
//     [M] [P]
//  1   2   3

// Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

//         [D]
//         [N]
// [C]     [Z]
// [M]     [P]
//  1   2   3

// Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

//         [D]
//         [N]
//         [Z]
// [M] [C] [P]
//  1   2   3

// In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

// Before the rearrangement process finishes, update your simulation so that the Elves know where they
// should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?

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

    let cratesToMove = [];
    for (let j = 0; j < numCratesToMove; j++) {
        cratesToMove.push(stacks[fromStack - 1].shift());
    }
    for (let j = 0; j < numCratesToMove; j++) {
        stacks[toStack - 1].unshift(cratesToMove.pop());
    }

    // console.log(stacks);
}

// console.log(stacks);

let output = '';
for (let i = 0; i < numStacks; i++) {
    output += stacks[i][0];
}

console.log(output);
