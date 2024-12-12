// --- Part Two ---
// As soon as people start to arrive, you realize your mistake. People don't just care about adjacent
// seats - they care about the first seat they can see in each of those eight directions!

// Now, instead of considering just the eight immediately adjacent seats, consider the first seat in
// each of those eight directions. For example, the empty seat below would see eight occupied seats:

// .......#.
// ...#.....
// .#.......
// .........
// ..#L....#
// ....#....
// .........
// #........
// ...#.....

// The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

// .............
// .L.L.#.#.#.#.
// .............

// The empty seat below would see no occupied seats:

// .##.##.
// #.#.#.#
// ##...##
// ...L...
// ##...##
// #.#.#.#
// .##.##.

// Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied
// seats for an occupied seat to become empty (rather than four or more from the previous rules). The
// other rules still apply: empty seats that see no occupied seats become occupied, seats matching no
// rule don't change, and floor never changes.

// Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL

// #.##.##.##
// #######.##
// #.#.#..#..
// ####.##.##
// #.##.##.##
// #.#####.##
// ..#.#.....
// ##########
// #.######.#
// #.#####.##

// #.LL.LL.L#
// #LLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLLL.L
// #.LLLLL.L#

// #.L#.##.L#
// #L#####.LL
// L.#.#..#..
// ##L#.##.##
// #.##.#L.##
// #.#####.#L
// ..#.#.....
// LLL####LL#
// #.L#####.L
// #.L####.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##LL.LL.L#
// L.LL.LL.L#
// #.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLL#.L
// #.L#LL#.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.#L.L#
// #.L####.LL
// ..#.#.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.LL.L#
// #.LLLL#.LL
// ..#.L.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#

// Again, at this point, people stop shifting around and the seating area reaches equilibrium.
// Once this occurs, you count 26 occupied seats.

// Given the new visibility method and the rule change for occupied seats becoming empty, once
// equilibrium is reached, how many seats end up occupied?

// 1994 is too high - should be 1978 (off by 16???)

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

let seatingArea: string[][] = new Array();
let numRows = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    seatingArea[numRows] = new Array();

    for (let j = 0; j < lines[i].length; j++) {
        seatingArea[numRows][j] = lines[i][j];
    }

    numRows++;
}

let prevOccupiedSeats = -1;
let numOccupiedSeats = countOccupiedSeats();
while (prevOccupiedSeats !== numOccupiedSeats) {
    prevOccupiedSeats = numOccupiedSeats;
    seatPeople();
    numOccupiedSeats = countOccupiedSeats();

    // if (numOccupiedSeats != prevOccupiedSeats) {
    //     printSeatingArea();
    //     console.log('');
    // }
}

console.log(numOccupiedSeats);
// printSeatingArea();

function printSeatingArea() {
    for (let i = 0; i < seatingArea.length; i++) {
        console.log(seatingArea[i].join(''));
    }
}

function countOccupiedSeats(): number {
    let numSeats = 0;

    for (let r = 0; r < seatingArea.length; r++) {
        for (let c = 0; c < seatingArea[0].length; c++) {
            if (seatingArea[r][c] === '#') {
                numSeats += 1;
            }
        }
    }

    return numSeats;
}

function seatPeople() {
    const newSeatingArea: string[][] = new Array();

    for (let r = 0; r < seatingArea.length; r++) {
        newSeatingArea[r] = new Array();

        for (let c = 0; c < seatingArea[0].length; c++) {
            newSeatingArea[r][c] = seatingArea[r][c];

            if (newSeatingArea[r][c] === '.') { continue; }

            const neighbors: string[] = new Array();

            // NW
            let seatsAway = 1;
            while (r - seatsAway >= 0 && c - seatsAway >= 0) {
                if (seatingArea[r - seatsAway][c - seatsAway] !== '.') {
                    neighbors.push(seatingArea[r - seatsAway][c - seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // N
            seatsAway = 1;
            while (r - seatsAway >= 0) {
                if (seatingArea[r - seatsAway][c] !== '.') {
                    neighbors.push(seatingArea[r - seatsAway][c]);
                    break;
                }
                seatsAway += 1;
            }

            // NE
            seatsAway = 1;
            while (r - seatsAway >= 0 && c + seatsAway < seatingArea[0].length) {
                if (seatingArea[r - seatsAway][c + seatsAway] !== '.') {
                    neighbors.push(seatingArea[r - seatsAway][c + seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // W
            seatsAway = 1;
            while (c - seatsAway >= 0) {
                if (seatingArea[r][c - seatsAway] !== '.') {
                    neighbors.push(seatingArea[r][c - seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // E
            seatsAway = 1;
            while (c + seatsAway < seatingArea[0].length) {
                if (seatingArea[r][c + seatsAway] !== '.') {
                    neighbors.push(seatingArea[r][c + seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // SW
            seatsAway = 1;
            while (r + seatsAway < seatingArea.length && c - seatsAway >= 0) {
                if (seatingArea[r + seatsAway][c - seatsAway] !== '.') {
                    neighbors.push(seatingArea[r + seatsAway][c - seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // S
            seatsAway = 1;
            while (r + seatsAway < seatingArea.length) {
                if (seatingArea[r + seatsAway][c] !== '.') {
                    neighbors.push(seatingArea[r + seatsAway][c]);
                    break;
                }
                seatsAway += 1;
            }

            // SE
            seatsAway = 1;
            while (r + seatsAway < seatingArea.length && c + seatsAway < seatingArea[0].length) {
                if (seatingArea[r + seatsAway][c + seatsAway] !== '.') {
                    neighbors.push(seatingArea[r + seatsAway][c + seatsAway]);
                    break;
                }
                seatsAway += 1;
            }

            // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
            if (seatingArea[r][c] === 'L') {
                if (!neighbors.includes('#')) {
                    newSeatingArea[r][c] = '#';
                }
            }

            // If a seat is occupied (#) and five or more seats adjacent to it are also occupied, the seat becomes empty.
            else if (seatingArea[r][c] === '#') {
                if (neighbors.filter(x => x === '#').length >= 5) {
                    newSeatingArea[r][c] = 'L';
                }
            }
        }
    }

    seatingArea = newSeatingArea;
}
