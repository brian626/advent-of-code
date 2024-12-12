// --- Part Two ---

// A rope snaps! Suddenly, the river is getting a lot closer than you remember. The bridge is still there,
// but some of the ropes that broke are now whipping toward you as you fall through the air!

// The ropes are moving too quickly to grab; you only have a few seconds to choose how to arch your body to avoid being hit.
// Fortunately, your simulation can be extended to support longer ropes.

// Rather than two knots, you now must simulate a rope consisting of ten knots. One knot is still the head of the rope and
// moves according to the series of motions. Each knot further down the rope follows the knot in front of it using the same rules as before.


// Now, you need to keep track of the positions the new tail, 9, visits. In this example, the tail never moves, and so it
// only visits 1 position. However, be careful: more types of motion are possible than before, so you might want to visually
// compare your simulated rope to the one above.


// Simulate your complete series of motions on a larger rope with ten knots. How many positions does the tail of the rope visit at least once?

import { readFileSync } from 'fs';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const GRID_SIZE = 10000;

const positionsVisitedByTail: string[][] = [];
for (let i = 0; i < GRID_SIZE; i++) {
    positionsVisitedByTail[i] = [];
}

for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        positionsVisitedByTail[j][i] = '·';
    }
}

class KnotPosition {
    id: string;
    row: number;
    col: number;

    constructor(i: string, r: number, c: number) {
        this.id = i;
        this.row = r;
        this.col = c;
    }
}

const STARTING_ROW = GRID_SIZE / 2;
const STARTING_COL = GRID_SIZE / 2;

const knots: KnotPosition[] = []

knots.push(new KnotPosition('H', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('1', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('2', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('3', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('4', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('5', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('6', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('7', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('8', STARTING_ROW, STARTING_COL));
knots.push(new KnotPosition('9', STARTING_ROW, STARTING_COL));

visitPosition();

// printGrid();

for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' ');
    // console.log(parts);
    const direction = parts[0];
    const distance = Number(parts[1]);

    const head = knots[0];

    for (let j = 0; j < distance; j++) {
        if (direction === 'R') {
            head.col++;
        } else if (direction === 'L') {
            head.col--;
        } else if (direction === 'U') {
            head.row++;
        } else if (direction === 'D') {
            head.row--;
        }

        updateKnots();
        // printGrid();
    }

    // printGrid();
}

// printGrid();

let visitedCount = 0;
for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        if (positionsVisitedByTail[j][i] === '#') {
            visitedCount++;
        }
    }
}

console.log(visitedCount);

// Head has moved, so now check all the other knots to see if they need to move.
//
// If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step
// in that direction so it remains close enough:
//
// Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:
//
function updateKnots() {
    const head = knots[0];
    const tail = knots[9];

    for (let i = 1; i < knots.length; i++) {
        const knot1 = knots[i-1];
        const knot2 = knots[i];

        if (areKnotsTouching(knot1, knot2)) { continue; }

        const originalTailRow = tail.row;
        const originalTailCol = tail.col;

        if (knot1.row === knot2.row) {
            if      (knot1.col === knot2.col - 2) { knot2.col--; }
            else if (knot1.col === knot2.col + 2) { knot2.col++; }
        }
        else if (knot1.col === knot2.col) {
            if      (knot1.row === knot2.row - 2) { knot2.row--; }
            else if (knot1.row === knot2.row + 2) { knot2.row++; }
        }
        else if ((knot1.row === knot2.row - 2) && (knot1.col === knot2.col - 2)) { knot2.row--; knot2.col--; }
        else if ((knot1.row === knot2.row - 2) && (knot1.col === knot2.col + 2)) { knot2.row--; knot2.col++; }
        else if ((knot1.row === knot2.row + 2) && (knot1.col === knot2.col - 2)) { knot2.row++; knot2.col--; }
        else if ((knot1.row === knot2.row + 2) && (knot1.col === knot2.col + 2)) { knot2.row++; knot2.col++; }
        else {
            if (knot1.row === knot2.row - 2) {
                knot2.row = knot1.row + 1;
                knot2.col = knot1.col;
            } else if (knot1.row === knot2.row + 2) {
                knot2.row = knot1.row - 1;
                knot2.col = knot1.col;
            } else if (knot1.col === knot2.col - 2) {
                knot2.row = knot1.row;
                knot2.col = knot1.col + 1;
            } else if (knot1.col === knot2.col + 2) {
                knot2.row = knot1.row;
                knot2.col = knot1.col - 1;
            }
        }

        if (tail.row !== originalTailRow || tail.col !== originalTailCol) {
            visitPosition();
        }
    }
}

function areKnotsTouching(knot1: KnotPosition, knot2: KnotPosition): boolean {
    // Overlapping
    if (knot1.col === knot2.col && knot1.row === knot2.row) { return true; }

    // Same column, adjacent row
    if (knot1.col === knot2.col && Math.abs(knot1.row - knot2.row) === 1) { return true; }

    // Same row, adjacent column
    if (knot1.row === knot2.row && Math.abs(knot1.col - knot2.col) === 1) { return true; }

    // Diagonally adjacent
    if (Math.abs(knot1.row - knot2.row) === 1 && Math.abs(knot1.col - knot2.col) === 1) { return true; }

    return false;
}

function printGrid() {
    for (let i = GRID_SIZE - 1; i >= 0; i--) {
        // console.log(positionsVisitedByTail[i].join(''));
        let row = positionsVisitedByTail[i].join('').split('');
        for (let j = knots.length - 1; j >= 0; j--) {
            if (knots[j].row === i) {
                row[knots[j].col] = knots[j].id;
            }
        }

        console.log(row.join(''));
    }
    console.log('');
}

function visitPosition() {
    const tail = knots[9];
    positionsVisitedByTail[tail.row][tail.col] = '#';
}
