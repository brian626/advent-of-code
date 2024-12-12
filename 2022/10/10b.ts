// --- Part Two ---

// It seems like the X register controls the horizontal position of a sprite. Specifically, the sprite is 3 pixels wide,
// and the X register sets the horizontal position of the middle of that sprite. (In this system, there is no such thing as
// "vertical position": if the sprite's horizontal position puts its pixels where the CRT is currently drawing, then those pixels will be drawn.)

// You count the pixels on the CRT: 40 wide and 6 high. This CRT screen draws the top row of pixels left-to-right, then the row below that,
// and so on. The left-most pixel in each row is in position 0, and the right-most pixel in each row is in position 39.

// Like the CPU, the CRT is tied closely to the clock circuit: the CRT draws a single pixel during each cycle. Representing each
// pixel of the screen as a #, here are the cycles during which the first and last pixel in each row are drawn:

// Cycle   1 -> ######################################## <- Cycle  40
// Cycle  41 -> ######################################## <- Cycle  80
// Cycle  81 -> ######################################## <- Cycle 120
// Cycle 121 -> ######################################## <- Cycle 160
// Cycle 161 -> ######################################## <- Cycle 200
// Cycle 201 -> ######################################## <- Cycle 240

// So, by carefully timing the CPU instructions and the CRT drawing operations, you should be able to determine whether
// the sprite is visible the instant each pixel is drawn. If the sprite is positioned such that one of its three pixels
// is the pixel currently being drawn, the screen produces a lit pixel (#); otherwise, the screen leaves the pixel dark (.).


// Allowing the program to run to completion causes the CRT to produce the following image:

// ##..##..##..##..##..##..##..##..##..##..
// ###...###...###...###...###...###...###.
// ####....####....####....####....####....
// #####.....#####.....#####.....#####.....
// ######......######......######......####
// #######.......#######.......#######.....

// Render the image given by your program. What eight capital letters appear on your CRT?

import { readFileSync } from 'fs';

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

const crt: string[][] = [];
for (let i = 0; i < 6; i++) {
    crt[i] = [];
}

let currentRow = 0;
let currentCol = 0;

while (operations.length) {
    console.log(`Sprite position: (${X-1},${X},${X+1})`);

    currentCycle++;

    const addend = operations.shift();
    console.log(`Start cycle ${currentCycle}: begin executing addx`);

    console.log(`During cycle ${currentCycle}: CRT draws pixel in position (${currentRow},${currentCol})`);
    if (Math.abs(currentCol - X) <= 1) {
        crt[currentRow][currentCol] = '#';
    } else {
        crt[currentRow][currentCol] = '.';
    }
    console.log(`Current CRT row: ${crt[currentRow].join('')}`);
    console.log(``);

    X += addend;

    currentCol++;
    if (currentCol >= 40) {
        currentCol = 0;
        currentRow++;
    }
    if (currentRow >= 6) {
        break;
    }
}

// console.log(crt);
for (let i = 0; i < 6; i++) {
    console.log(crt[i].join(''));
}
