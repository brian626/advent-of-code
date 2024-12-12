// --- Day 13: Distress Signal ---

// You climb the hill and again try contacting the Elves. However, you instead receive a signal you weren't expecting: a distress signal.

// Your handheld device must still not be working properly; the packets from the distress signal got decoded out of order.
// You'll need to re-order the list of received packets (your puzzle input) to decode the message.

// Your list consists of pairs of packets; pairs are separated by a blank line. You need to identify how many pairs of packets are in the right order.

// Packet data consists of lists and integers. Each list starts with [, ends with ], and contains zero or more comma-separated values
// (either integers or other lists). Each packet is always a list and appears on its own line.

// When comparing two values, the first value is called left and the second value is called right. Then:

// If both values are integers, the lower integer should come first. If the left integer is lower than the right integer,
// the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order.
// Otherwise, the inputs are the same integer; continue checking the next part of the input.

// If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of
// items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order.
// If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.

// If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison.
// For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead
// comparing [0,0,0] and [2].

// Using these rules, you can determine which of the pairs in the example are in the right order:

// What are the indices of the pairs that are already in the right order? (The first pair has index 1, the second pair has
// index 2, and so on.) In the above example, the pairs in the right order are 1, 2, 4, and 6; the sum of these indices is 13.

// Determine which pairs of packets are already in the right order. What is the sum of the indices of those pairs?

import { readFileSync } from 'fs';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

let sumOfIndices = 0;
let currentPairNum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const packet1 = lines[i];
    const packet2 = lines[i+1];
    currentPairNum++;

    console.log(`== Pair ${currentPairNum} ==`);
    if (isInRightOrder(eval(packet1), eval(packet2)) === `true`) {
        sumOfIndices += currentPairNum;
    }
    console.log(``);

    i += 2;
}

console.log(sumOfIndices);


// If both values are integers, the lower integer should come first. If the left integer is lower than the right integer,
// the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order.
// Otherwise, the inputs are the same integer; continue checking the next part of the input.

// If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of
// items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order.
// If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.

// If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison.
// For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead
// comparing [0,0,0] and [2].

function isInRightOrder(packet1: any[], packet2: any[]): string {
    console.log(`- Compare`);
    console.log(packet1);
    console.log(` and `);
    console.log(packet2);

    while (packet1.length > 0 && packet2.length > 0) {
        const left = packet1.shift();
        const right = packet2.shift();

        if (typeof(left) === 'number' && typeof(right) === 'number') {
            const leftInt = Number(left);
            const rightInt = Number(right);
            console.log(`  - a Compare ${leftInt} vs ${rightInt}`);
            if (leftInt < rightInt) { console.log(`    - Left side is smaller, so inputs are in the right order`); return `true`; }
            else if (leftInt > rightInt) { console.log(`    - Right side is smaller, so inputs are not in the right order`); return `false`; }
        }
        else if (typeof(left) === 'object' && typeof(right) === 'object') {
            console.log(`b`);
            // console.log(`  - b Compare [${left}] vs [${right}]`);
            // return isInRightOrder(`[${left}]`, `[${right}]`);
            const subValue = isInRightOrder(left, right);
            if (subValue === `true` || subValue === `false`) { return subValue; }
        }
        else if (typeof(left) === 'object' && typeof(right) === 'number') {
            console.log(`c`);
            // console.log(`  - c Compare [${left}] vs [${right}]`);
            // return isInRightOrder(`[${left}]`, `[${right}]`);
            const subValue = isInRightOrder(left, [right]);
            if (subValue === `true` || subValue === `false`) { return subValue; }
        }
        else if (typeof(left) === 'number' && typeof(right) === 'object') {
            console.log(`d`);
            // console.log(`  - d Compare [${left}] vs [${right}]`);
            // return isInRightOrder(`[${left}]`, `[${right}]`);
            const subValue = isInRightOrder([left], right);
            if (subValue === `true` || subValue === `false`) { return subValue; }
        } else {
            console.log(`wtf`);
        }
    }

    if (packet1.length === 0 && packet2.length > 0) { console.log(`  - Left side ran out of items, so inputs are in the right order`); return `true`; }
    else if (packet1.length > 0 && packet2.length === 0) { console.log(`  - Right side ran out of items, so inputs are not in the right order`); return `false`; }
    else { console.log(`arg`); return `neither`; }
}
