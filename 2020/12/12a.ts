// --- Day 12: Rain Risk ---
// Your ferry made decent progress toward the island, but the storm came in faster than anyone expected.
// The ferry needs to take evasive actions!

// Unfortunately, the ship's navigation computer seems to be malfunctioning; rather than giving a route
// directly to safety, it produced extremely circuitous instructions. When the captain uses the PA system
// to ask if anyone can help, you quickly volunteer.

// The navigation instructions (your puzzle input) consists of a sequence of single-character actions
// paired with integer input values. After staring at them for a few minutes, you work out what they probably mean:

// Action N means to move north by the given value.
// Action S means to move south by the given value.
// Action E means to move east by the given value.
// Action W means to move west by the given value.
// Action L means to turn left the given number of degrees.
// Action R means to turn right the given number of degrees.
// Action F means to move forward by the given value in the direction the ship is currently facing.

// The ship starts by facing east. Only the L and R actions change the direction the ship is facing.
// (That is, if the ship is facing east and the next instruction is N10, the ship would move north 10
// units, but would still move east if the following action were F.)

// For example:

// F10
// N3
// F7
// R90
// F11

// These instructions would be handled as follows:

// F10 would move the ship 10 units east (because the ship starts by facing east) to east 10, north 0.
// N3 would move the ship 3 units north to east 10, north 3.
// F7 would move the ship another 7 units east (because the ship is still facing east) to east 17, north 3.
// R90 would cause the ship to turn right by 90 degrees and face south; it remains at east 17, north 3.
// F11 would move the ship 11 units south to east 17, south 8.

// At the end of these instructions, the ship's Manhattan distance (sum of the absolute values of its
// east/west position and its north/south position) from its starting position is 17 + 8 = 25.

// Figure out where the navigation instructions lead. What is the Manhattan distance between that
// location and the ship's starting position?

// 1552 is too high

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

let heading = 90;
let xPos = 0;
let yPos = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const action = lines[i].slice(0,1);
    const value = parseInt(lines[i].slice(1));

    console.log(action, value);

    switch (action) {
        case 'N': yPos += value; break;
        case 'S': yPos -= value; break;
        case 'E': xPos += value; break;
        case 'W': xPos -= value; break;
        case 'L': heading -= value; fixHeading(); break;
        case 'R': heading += value; fixHeading(); break;
        case 'F': moveForward(value); break;
    }

    console.log(`  new position is ${xPos}, ${yPos} // heading is ${heading}`);
}

console.log(Math.abs(xPos) + Math.abs(yPos));

function fixHeading() {
    if (heading < 0) { heading += 360; }
    if (heading >= 360) { heading -= 360; }
}


function moveForward(value: number) {
    switch (heading) {
        case 0: yPos += value; break;
        case 90: xPos += value; break;
        case 180: yPos -= value; break;
        case 270: xPos -= value; break;
    }
}
