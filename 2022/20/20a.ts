// --- Day 20: Grove Positioning System ---

// It's finally time to meet back up with the Elves. When you try to contact them, however, you get no reply. Perhaps you're out of range?

// You know they're headed to the grove where the star fruit grows, so if you can figure out where that is, you should be able to meet back
// up with them.

// Fortunately, your handheld device has a file (your puzzle input) that contains the grove's coordinates! Unfortunately, the file is
// encrypted - just in case the device were to fall into the wrong hands.

// Maybe you can decrypt it?

// When you were still back at the camp, you overheard some Elves talking about coordinate file encryption. The main operation involved in
// decrypting the file is called mixing.

// The encrypted file is a list of numbers. To mix the file, move each number forward or backward in the file a number of positions equal
// to the value of the number being moved. The list is circular, so moving a number off one end of the list wraps back around to the other
// end as if the ends were connected.

// For example, to move the 1 in a sequence like 4, 5, 6, 1, 7, 8, 9, the 1 moves one position forward: 4, 5, 6, 7, 1, 8, 9.
// To move the -2 in a sequence like 4, -2, 5, 6, 7, 8, 9, the -2 moves two positions backward, wrapping around: 4, 5, 6, 7, 8, -2, 9.

// The numbers should be moved in the order they originally appear in the encrypted file. Numbers moving around during the mixing process
// do not change the order in which the numbers are moved.

// Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0,
// wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and
// the 3000th is 2; adding these together produces 3.

// Mix your encrypted file exactly once. What is the sum of the three numbers that form the grove coordinates?

import { readFileSync } from 'fs';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

class Node {
    value: number;
    index: number;
    mixed: boolean;

    constructor(v: number, i: number) {
        this.value = v;
        this.index = i;
        this.mixed = false;
    }
}

const numbers: Node[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    numbers.push(new Node(Number(lines[i].trim()), i));
}

// console.log(`Initial arrangement`);
// console.log(numbers.sort((x,y) => x.index - y.index).map(x => x.value).join(', '));
// console.log(numbers.sort((x,y) => x.index - y.index).map(x => `${x.value} @ ${x.index}`).join(', '));
// console.log(``);

while (true) {
    let numberToMove: Node = numbers.sort((x,y) => x.index - y.index).filter(x => !x.mixed)[0];
    if (!numberToMove) { break; }

    if (numberToMove.value === 0) { numberToMove.mixed = true; continue; }

    let i = numberToMove.index;
    let newIndex = numberToMove.index + numberToMove.value;

    // Handle < 0 or > length
    while (newIndex <= 0) {
        newIndex += (numbers.length - 1);
    }

    while (newIndex >= numbers.length) {
        newIndex -= (numbers.length - 1);
    }

    let stepsToMove = newIndex - numberToMove.index;

    console.log(`Moving ${numberToMove.value} by ${stepsToMove} steps:`);

    if (stepsToMove > 0) {
        numbers[i].mixed = true;
        for (let j = 1; j <= stepsToMove; j++) {
            // console.log(`  Swapping indexes of ${numbers[i].value} and ${numbers[i+j].value}.`);
            const t = numbers[i].index;
            numbers[i].index = numbers[i + j].index;
            numbers[i + j].index = t;
        }
    } else {
        numbers[i].mixed = true;
        for (let j = -1; j >= stepsToMove; j--) {
            // console.log(`  Swapping indexes of ${numbers[i].value} and ${numbers[i+j].value}.`);
            const t = numbers[i].index;
            numbers[i].index = numbers[i + j].index;
            numbers[i + j].index = t;
        }
    }

    // console.log(numbers.sort((x,y) => x.index - y.index).map(x => x.value).join(', '));
    // console.log(``);
}


console.log(`Final arrangement`);
console.log(numbers.sort((x,y) => x.index - y.index).map(x => x.value).join(', '));

let zeroIndex = 0;
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i].value === 0) {
        zeroIndex = i;
        break;
    }
}

console.log(numbers[(1000 + zeroIndex) % numbers.length].value);
console.log(numbers[(2000 + zeroIndex) % numbers.length].value);
console.log(numbers[(3000 + zeroIndex) % numbers.length].value);
console.log(numbers[(1000 + zeroIndex) % numbers.length].value + numbers[(2000 + zeroIndex) % numbers.length].value + numbers[(3000 + zeroIndex) % numbers.length].value);

// 8495 is too high
// -9887 is wrong
