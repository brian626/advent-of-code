// --- Part Two ---

// Now, you just need to put all of the packets in the right order. Disregard the blank lines in your list of received packets.

// The distress signal protocol also requires that you include two additional divider packets:

// [[2]]
// [[6]]

// Using the same rules as before, organize all packets - the ones in your list of received packets as well as the two divider
// packets - into the correct order.

// Afterward, locate the divider packets. To find the decoder key for this distress signal, you need to determine the indices
// of the two divider packets and multiply them together. (The first packet is at index 1, the second packet is at index 2,
// and so on.) In this example, the divider packets are 10th and 14th, and so the decoder key is 140.

// Organize all of the packets into the correct order. What is the decoder key for the distress signal?


import { readFileSync } from 'fs';

const file = readFileSync('./13.input', 'utf-8');

let lines = file.split('\n');
let packets: string[] = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    packets.push(lines[i]);
}
packets.push(`[[2]]`);
packets.push(`[[6]]`);

packets = packets.sort((x,y) => {
    const sortResult = isInRightOrder(eval(x),eval(y));
    if (sortResult === `true`) {
        return -1;
    } else if (sortResult === `false`) {
        return 1;
    } else {
        return 0;
    }
});

// console.log(packets);

const divider1Index = packets.findIndex(x => x === '[[2]]');
const divider2Index = packets.findIndex(x => x === '[[6]]');

console.log((Number(divider1Index) + 1) * (Number(divider2Index) + 1));



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
