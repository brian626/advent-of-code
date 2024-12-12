// --- Day 10: Cathode-Ray Tube ---

// You avoid the ropes, plunge into the river, and swim to shore.

// The Elves yell something about meeting back up with them upriver, but the river is too loud to tell exactly
// what they're saying. They finish crossing the bridge and disappear from view.

// Situations like this must be why the Elves prioritized getting the communication system on your handheld
// device working. You pull it out of your pack, but the amount of water slowly draining from a big crack in its
// screen tells you it probably won't be of much immediate use.

// Unless, that is, you can design a replacement for the device's video system! It seems to be some kind of
// cathode-ray tube screen and simple CPU that are both driven by a precise clock circuit. The clock circuit
// ticks at a constant rate; each tick is called a cycle.

// Start by figuring out the signal being sent by the CPU. The CPU has a single register, X, which starts with the
// value 1. It supports only two instructions:

// addx V takes two cycles to complete. After two cycles, the X register is increased by the value V. (V can be negative.)

// noop takes one cycle to complete. It has no other effect.

// The CPU uses these instructions in a program (your puzzle input) to, somehow, tell the screen what to draw.

// Consider the following small program:

// noop
// addx 3
// addx -5

// Execution of this program proceeds as follows:

// At the start of the first cycle, the noop instruction begins execution. During the first cycle, X is 1.
// After the first cycle, the noop instruction finishes execution, doing nothing.

// At the start of the second cycle, the addx 3 instruction begins execution. During the second cycle, X is still 1.

// During the third cycle, X is still 1. After the third cycle, the addx 3 instruction finishes execution, setting X to 4.

// At the start of the fourth cycle, the addx -5 instruction begins execution. During the fourth cycle, X is still 4.

// During the fifth cycle, X is still 4. After the fifth cycle, the addx -5 instruction finishes execution, setting X to -1.

// Maybe you can learn something by looking at the value of the X register throughout execution. For now, consider the
// signal strength (the cycle number multiplied by the value of the X register) during the 20th cycle and every 40 cycles
// after that (that is, during the 20th, 60th, 100th, 140th, 180th, and 220th cycles).

// Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles. What is the sum of these six signal strengths?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

let operations: number[] = [];

for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' ');
    const instruction = parts[0];
    const value = Number(parts[1]);

    operations.push(0);

    if (instruction === 'addx') {
        operations.push(value);
    }
}

// console.log(operations);

let X = 1;
let currentCycle = 0;
let sumOfSignalStrengths = 0;

while (operations.length) {
    currentCycle++;

    if ((currentCycle - 20) % 40 === 0) {
        sumOfSignalStrengths += (currentCycle * X);
    }

    const addend = operations.shift();
    X += addend;
}

console.log(sumOfSignalStrengths);
// console.log(X);
