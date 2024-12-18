// On the other hand, it might be wise to try a different strategy: let the giant squid win.

// You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time
// counting its arms, the safe thing to do is to figure out which board will win last and choose that one.
// That way, no matter which boards it picks, it will win for sure.

// In the above example, the second board is the last to win, which happens after 13 is eventually called
// and its middle column is completely marked. If you were to keep playing until this point, the second
// board would have a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

// Figure out which board will win last. Once it wins, what would its final score be?

class Space {
    val: string;
    marked: boolean;
}

class Board {
    spaces: Space[][];
    winner: boolean;
}

const WIDTH = 5;
const HEIGHT = 5;

function isRowWinner(b: Board, r: number): boolean {
    for (let c = 0; c < WIDTH; c++) {
        if (b.spaces[r][c].marked === false) {
            return false;
        }
    }

    return true;
}

function isColumnWinner(b: Board, c: number): boolean {
    for (let r = 0; r < HEIGHT; r++) {
        if (b.spaces[r][c].marked === false) {
            return false;
        }
    }

    return true;
}

function isWinner(b: Board): boolean {
    for (let r = 0; r < HEIGHT; r++) {
        if (isRowWinner(b, r)) { return true; }
    }

    for (let c = 0; c < WIDTH; c++) {
        if (isColumnWinner(b, c)) { return true; }
    }

    return false;
}

function markSpace(b: Board, v: string): void {
    for (let r = 0; r < HEIGHT; r++) {
        for (let c = 0; c < WIDTH; c++) {
            if (b.spaces[r][c].val === v) {
                b.spaces[r][c].marked = true;
                return;
            }
        }
    }
}

function calculateUnmarkedSum(b: Board): number {
    let sum = 0;

    for (let r = 0; r < HEIGHT; r++) {
        for (let c = 0; c < WIDTH; c++) {
            if (b.spaces[r][c].marked === false) {
                sum += parseInt(b.spaces[r][c].val);
            }
        }
    }

    return sum;
}


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./4.input', 'utf-8');

const lines = file.split('\n');

// Line 0 is the list of numbers to draw.
const draw: string[] = lines[0].split(',');

const boards: Board[] = [];

// Boards start at line 2.
for (let n = 2; n < lines.length; n++) {
    let r = 0;
    let b: Board = new Board();
    b.spaces = [];
    b.winner = false;
    while (r < HEIGHT) {
        const rowValues = lines[n].split(' ').filter(x => x.length > 0);
        let row: Space[] = [];
        rowValues.forEach(v => {
            let s: Space = new Space();
            s.val = v;
            s.marked = false;
            row.push(s);
        });
        b.spaces.push(row);

        r++;
        n++;
    }

    boards.push(b);
}


let numWinners = 0;
let lastWinner: Board;
draw.forEach(d => {
    boards.forEach(b => {
        if (!b.winner) {
            markSpace(b, d);
            if (isWinner(b)) {
                b.winner = true;
                numWinners++;

                if (numWinners === boards.length) {
                    console.log(calculateUnmarkedSum(b) * parseInt(d));
                    exit();
                }
            }
        }
    });
});
