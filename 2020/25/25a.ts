
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

let cardKey = 0;
let doorKey = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (cardKey === 0) { cardKey = parseInt(lines[i]); }
    else { doorKey = parseInt(lines[i]); }
}

// Determine card's loop size
let cardLoop = 1;
let cardTransform = transform2(7, cardLoop, 1);
while (cardTransform != cardKey) {
    cardLoop++;
    cardTransform = transform2(7, cardLoop, cardTransform);
}
console.log(`card loop size is ${cardLoop}`);

// Determine door's loop size
let doorLoop = 1;
let doorTransform = transform2(7, doorLoop, 1);
while (doorTransform != doorKey) {
    doorLoop++;
    doorTransform = transform2(7, doorLoop, doorTransform);
}
console.log(`door loop size is ${doorLoop}`);

const encryptionKey = transform1(doorKey, cardLoop);

console.log(encryptionKey);

function transform1(sn: number, loop: number): number {
    let result = 1;

    for (let i = 0; i < loop; i++) {
        result *= sn;
        result %= 20201227;
    }

    console.log(`transform1(${sn}, ${loop}) === ${result}`);
    return result;
}

function transform2(sn: number, loop: number, lastTransform: number): number {
    let result = lastTransform;

    result *= sn;
    result %= 20201227;

    if (loop % 1000 === 0) {
        console.log(`transform2(${sn}, ${loop}) === ${result}`);
    }

    return result;
}
