// --- Part Two ---
// By the time you calculate the answer to the Elves' question, they've already realized that the Elf
// carrying the most Calories of food might eventually run out of snacks.

// To avoid this unacceptable situation, the Elves would instead like to know the total Calories carried
// by the top three Elves carrying the most Calories. That way, even if one of those Elves runs out of
// snacks, they still have two backups.

// In the example above, the top three Elves are the fourth Elf (with 24000 Calories), then the third Elf
// (with 11000 Calories), then the fifth Elf (with 10000 Calories). The sum of the Calories carried by
// these three elves is 45000.

// Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./1.input', 'utf-8');

const lines = file.split('\n');

const elves: number[] = [];
let currentElfCalories = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        // if (elves.length === 0) {
        //     console.log(`1`);
        //     continue;
        // } else {
            // console.log(`2`);
            elves.push(currentElfCalories);
            currentElfCalories = 0;
        // }
    } else {
        // console.log(`3: ${lines[i]}`);
        currentElfCalories += parseInt(lines[i]);
    }
}

// console.log(Math.max(...elves));

console.log(elves.sort((a,b) => b - a).slice(0,3).reduce((sum, current) => sum + current, 0));
