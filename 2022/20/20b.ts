// --- Part Two ---

// The grove coordinate values seem nonsensical. While you ponder the mysteries of Elf encryption, you suddenly remember the
// rest of the decryption routine you overheard back at camp.

// First, you need to apply the decryption key, 811589153. Multiply each number by the decryption key before you begin; this
// will produce the actual list of numbers to mix.

// Second, you need to mix the list of numbers ten times. The order in which the numbers are mixed does not change during
// mixing; the numbers are still moved in the order they appeared in the original, pre-mixed list. (So, if -3 appears fourth
// in the original list of numbers to mix, -3 will be the fourth number to move during each round of mixing.)

// The grove coordinates can still be found in the same way. Here, the 1000th number after 0 is 811589153, the 2000th is
// 2434767459, and the 3000th is -1623178306; adding these together produces 1623178306.

// Apply the decryption key and mix your encrypted file ten times. What is the sum of the three numbers that form the grove coordinates?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.test', 'utf-8');

const lines = file.split('\n');

class Node {
    value: number;
    index: number;
    mixed: boolean;
    mixOrder: number;

    constructor(v: number, i: number) {
        this.value = v;
        this.index = i;
        this.mixed = false;
        this.mixOrder = i;
    }
}

const numbers: Node[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    numbers.push(new Node(Number(lines[i].trim()), i));
}

for (let i = 0; i < numbers.length; i++) {
    numbers[i].value *= 811589153;
}

console.log(`Initial arrangement`);
console.log(numbers.sort((x,y) => x.index - y.index).map(x => x.value).join(', '));
// console.log(numbers.sort((x,y) => x.index - y.index).map(x => `${x.value} @ ${x.index}`).join(', '));
console.log(``);


for (let n = 0; n < 2; n++) {
    for (let k = 0; k < numbers.length; k++) { numbers[k].mixed = false; }

    // while (true) {
    for (let m = 0; m < numbers.length; m++) {
        // let numberToMove: Node = numbers.sort((x,y) => x.index - y.index).filter(x => !x.mixed)[0];
        // if (!numberToMove) { break; }
        const numberToMove = numbers.find(x => (x.mixOrder === m));
        console.log(`  Moving number ${numberToMove.value} at index ${m}`);

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

        // console.log(`Moving ${numberToMove.value} by ${stepsToMove} steps:`);

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
    }

    console.log(`After ${n+1} round(s) of mixing:`);
    console.log(numbers.sort((x,y) => x.index - y.index).map(x => x.value).join(', '));
    console.log(``);
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
