// --- Day 9: Rope Bridge ---
// This rope bridge creaks as you walk along it. You aren't sure how old it is, or whether it can even support your weight.

// It seems to support the Elves just fine, though. The bridge spans a gorge which was carved out by the massive river far below you.

// You step carefully; as you do, the ropes stretch and twist. You decide to distract yourself by modeling rope physics;
// maybe you can even figure out where not to step.

// Consider a rope with a knot at each end; these knots mark the head and the tail of the rope. If the head moves far
// enough away from the tail, the tail is pulled toward the head.

// Due to nebulous reasoning involving Planck lengths, you should be able to model the positions of the knots on a
// two-dimensional grid. Then, by following a hypothetical series of motions (your puzzle input) for the head, you
// can determine how the tail will move.

// Due to the aforementioned Planck lengths, the rope must be quite short; in fact, the head (H) and tail (T) must always be touching
// (diagonally adjacent and even overlapping both count as touching):

// ....
// .TH.
// ....

// ....
// .H..
// ..T.
// ....

// ...
// .H. (H covers T)
// ...

// If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step
// in that direction so it remains close enough:

// .....    .....    .....
// .TH.. -> .T.H. -> ..TH.
// .....    .....    .....

// ...    ...    ...
// .T.    .T.    ...
// .H. -> ... -> .T.
// ...    .H.    .H.
// ...    ...    ...

// Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:

// .....    .....    .....
// .....    ..H..    ..H..
// ..H.. -> ..... -> ..T..
// .T...    .T...    .....
// .....    .....    .....

// .....    .....    .....
// .....    .....    .....
// ..H.. -> ...H. -> ..TH.
// .T...    .T...    .....
// .....    .....    .....

// You just need to work out where the tail goes as the head follows a series of motions. Assume the head and the tail both start
// at the same position, overlapping.

// For example:

// R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2

// This series of motions moves the head right four steps, then up four steps, then left three steps, then down one step, and so on.
// After each step, you'll need to update the position of the tail if the step means the head is no longer adjacent to the tail.
// Visually, these motions occur as follows (s marks the starting position as a reference point):

// == Initial State ==

// ......
// ......
// ......
// ......
// H.....  (H covers T, s)

// == R 4 ==

// ......
// ......
// ......
// ......
// TH....  (T covers s)

// ......
// ......
// ......
// ......
// sTH...

// ......
// ......
// ......
// ......
// s.TH..

// ......
// ......
// ......
// ......
// s..TH.

// == U 4 ==

// ......
// ......
// ......
// ....H.
// s..T..

// ......
// ......
// ....H.
// ....T.
// s.....

// ......
// ....H.
// ....T.
// ......
// s.....

// ....H.
// ....T.
// ......
// ......
// s.....

// == L 3 ==

// ...H..
// ....T.
// ......
// ......
// s.....

// ..HT..
// ......
// ......
// ......
// s.....

// .HT...
// ......
// ......
// ......
// s.....

// == D 1 ==

// ..T...
// .H....
// ......
// ......
// s.....

// == R 4 ==

// ..T...
// ..H...
// ......
// ......
// s.....

// ..T...
// ...H..
// ......
// ......
// s.....

// ......
// ...TH.
// ......
// ......
// s.....

// ......
// ....TH
// ......
// ......
// s.....

// == D 1 ==

// ......
// ....T.
// .....H
// ......
// s.....

// == L 5 ==

// ......
// ....T.
// ....H.
// ......
// s.....

// ......
// ....T.
// ...H..
// ......
// s.....

// ......
// ......
// ..HT..
// ......
// s.....

// ......
// ......
// .HT...
// ......
// s.....

// ......
// ......
// HT....
// ......
// s.....

// == R 2 ==

// ......
// ......
// .H....  (H covers T)
// ......
// s.....

// ......
// ......
// .TH...
// ......
// s.....

// After simulating the rope, you can count up all of the positions the tail visited at least once. In this diagram,
// s again marks the starting position (which the tail also visited) and # marks other positions the tail visited:

// ..##..
// ...##.
// .####.
// ....#.
// s###..

// So, there are 13 positions the tail visited at least once.

// Simulate your complete hypothetical series of motions. How many positions does the tail of the rope visit at least once?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const GRID_SIZE = 10000;

const positionsVisitedByTail: number[][] = [];
for (let i = 0; i < GRID_SIZE; i++) {
    positionsVisitedByTail[i] = [];
}

// for (let i = 0; i < GRID_SIZE; i++) {
//     for (let j = 0; j < GRID_SIZE; j++) {
//         positionsVisitedByTail[j][i] = 0;
//     }
// }

let headRow = GRID_SIZE / 2;
let headCol = GRID_SIZE / 2;
let tailRow = GRID_SIZE / 2;
let tailCol = GRID_SIZE / 2;

visitPosition();

// printGrid();

for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' ');
    // console.log(parts);
    const direction = parts[0];
    const distance = Number(parts[1]);

    for (let j = 0; j < distance; j++) {
        if (direction === 'R') {
            headCol++;
        } else if (direction === 'L') {
            headCol--;
        } else if (direction === 'U') {
            headRow++;
        } else if (direction === 'D') {
            headRow--;
        }

        updateTail();
    }

    // printGrid();
}

let visitedCount = 0;
for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        if (positionsVisitedByTail[j][i] === 1) {
            visitedCount++;
        }
    }
}

console.log(visitedCount);


function printGrid() {
    console.log(`head is at (${headRow},${headCol}) and tail is at (${tailRow},${tailCol})`);
    for (let i = GRID_SIZE - 1; i >= 0; i--) {
        console.log(positionsVisitedByTail[i].join(''));
    }
    console.log('');
}

function visitPosition() {
    positionsVisitedByTail[tailRow][tailCol] = 1;
}

function areHeadAndTailTouching(): boolean {
    if (headCol === tailCol && headRow === tailRow) { return true; }

    if (headCol === tailCol && Math.abs(headRow - tailRow) === 1) { return true; }

    if (headRow === tailRow && Math.abs(headCol - tailCol) === 1) { return true; }

    if (Math.abs(headRow - tailRow) === 1 && Math.abs(headCol - tailCol) === 1) { return true; }

    return false;
}

// If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step
// in that direction so it remains close enough:
//
// Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:
//
function updateTail() {
    // console.log(`  updating tail now that head is at (${headRow},${headCol}) [tail is currently at (${tailRow},${tailCol})]`);

    if (areHeadAndTailTouching()) { return; }

    const originalTailRow = tailRow;
    const originalTailCol = tailCol;

    if (headRow === tailRow) {
        if (headCol === tailCol - 2) {
            tailCol--;
        } else if (headCol === tailCol + 2) {
            tailCol++;
        }
    } else if (headCol === tailCol) {
        if (headRow === tailRow - 2) {
            tailRow--;
        } else if (headRow === tailRow + 2) {
            tailRow++;
        }
    } else {
        if (headRow === tailRow - 2) {
            tailRow = headRow + 1;
            tailCol = headCol;
        } else if (headRow === tailRow + 2) {
            tailRow = headRow - 1;
            tailCol = headCol;
        } else if (headCol === tailCol - 2) {
            tailRow = headRow;
            tailCol = headCol + 1;
        } else if (headCol === tailCol + 2) {
            tailRow = headRow;
            tailCol = headCol - 1;
        }
    }

    if (tailRow !== originalTailRow || tailCol !== originalTailCol) {
        visitPosition();
    }

    // console.log(`  updated tail; now head is at (${headRow},${headCol}) and tail is at (${tailRow},${tailCol})`);
}
