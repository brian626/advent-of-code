// --- Part Two ---
// The final step in breaking the XMAS encryption relies on the invalid number you just found: you
// must find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1.

// Again consider the above example:

// 35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576

// In this list, adding up all of the numbers from 15 through 40 produces the invalid number from
// step 1, 127. (Of course, the contiguous set of numbers in your actual list might be much longer.)

// To find the encryption weakness, add together the smallest and largest number in this contiguous
// range; in this example, these are 15 and 47, producing 62.

// What is the encryption weakness in your XMAS-encrypted list of numbers?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const numbers: number[] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    numbers.push(parseInt(lines[i]));
}

let windowStart = 0;
let windowEnd = 24;
let numPtr = 25;

while (true) {
    if (!sumOfTwo(windowStart, windowEnd, numbers[numPtr])) {
        break;
    }

    numPtr += 1;
    windowStart += 1;
    windowEnd += 1;
}

console.log(numbers[numPtr]);
const invalidNumber = numbers[numPtr];

let contigStart = 0;
let contigEnd = 1;

while (true) {
    const contigSet = numbers.slice(contigStart, contigEnd + 1);
    const contigSum = contigSet.reduce((a,b) => a + b, 0);
    // console.log(`<${contigStart} though ${contigEnd}> [${contigSet}] sums to ${contigSum}`);

    if (contigSum === invalidNumber) {
        break;
    }

    contigEnd += 1;
    if (contigEnd === numbers.length || contigSum > invalidNumber) {
        contigStart += 1;
        contigEnd = contigStart + 1;
    }
}

const contigSet = numbers.slice(contigStart, contigEnd + 1);
console.log(Math.min(...contigSet) + Math.max(...contigSet));


function sumOfTwo(start: number, end: number, target: number): boolean {
    const candidates = numbers.slice(start, end + 1);
    for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
            if (candidates[i] + candidates[j] === target) {
                return true;
            }
        }
    }

    return false;
}
