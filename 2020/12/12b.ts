// --- Part Two ---
// Before you can give the destination to the captain, you realize that the actual action meanings were
// printed on the back of the instructions the whole time.

// Almost all of the actions indicate how to move a waypoint which is relative to the ship's position:

// Action N means to move the waypoint north by the given value.
// Action S means to move the waypoint south by the given value.
// Action E means to move the waypoint east by the given value.
// Action W means to move the waypoint west by the given value.
// Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
// Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
// Action F means to move forward to the waypoint a number of times equal to the given value.

// The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to
// the ship; that is, if the ship moves, the waypoint moves with it.

// For example, using the same instructions as above:

// F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north),
//   leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
// N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains
//   at east 100, north 10.
// F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the
//   ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
// R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units
//   south of the ship. The ship remains at east 170, north 38.
// F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving
//   the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.

// After these operations, the ship's Manhattan distance from its starting position is 214 + 72 = 286.

// Figure out where the navigation instructions actually lead. What is the Manhattan distance between
// that location and the ship's starting position?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

let shipXPos = 0;
let shipYPos = 0;
let waypointXPos = 10;
let waypointYPos = 1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const action = lines[i].slice(0,1);
    const value = parseInt(lines[i].slice(1));

    console.log(action, value);

    switch (action) {
        case 'N': waypointYPos += value; break;
        case 'S': waypointYPos -= value; break;
        case 'E': waypointXPos += value; break;
        case 'W': waypointXPos -= value; break;
        case 'L': rotateWaypoint(value * -1); break;
        case 'R': rotateWaypoint(value); break;
        case 'F': moveForward(value); break;
    }

    console.log(`  new ship position is ${shipXPos}, ${shipYPos} // waypoint position is ${waypointXPos}, ${waypointYPos}`);
}

console.log(Math.abs(shipXPos) + Math.abs(shipYPos));


function rotateWaypoint(value: number) {
    let temp = 0;

    switch (value) {
        case -90:
        case 270:
            if (waypointXPos >= 0 && waypointYPos >= 0) { waypointYPos *= -1; }
            else if (waypointXPos <= 0 && waypointYPos >= 0) { waypointYPos *= -1; }
            else if (waypointXPos <= 0 && waypointYPos <= 0) { waypointYPos *= -1; }
            else if (waypointXPos >= 0 && waypointYPos <= 0) { waypointYPos *= -1; }

            temp = waypointXPos;
            waypointXPos = waypointYPos;
            waypointYPos = temp;
            break;

        case 180:
        case -180:
            waypointXPos *= -1;
            waypointYPos *= -1;
            break;

        case 90:
        case -270:
            if (waypointXPos >= 0 && waypointYPos >= 0) { waypointXPos *= -1; }
            else if (waypointXPos <= 0 && waypointYPos >= 0) { waypointXPos *= -1; }
            else if (waypointXPos <= 0 && waypointYPos <= 0) { waypointXPos *= -1; }
            else if (waypointXPos >= 0 && waypointYPos <= 0) { waypointXPos *= -1; }

            temp = waypointXPos;
            waypointXPos = waypointYPos;
            waypointYPos = temp;
            break;
    }
}


function moveForward(value: number) {
    shipXPos += (value * waypointXPos);
    shipYPos += (value * waypointYPos);
}
