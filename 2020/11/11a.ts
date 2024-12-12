// --- Day 11: Seating System ---
// Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that
// goes directly to the tropical island where you can finally start your vacation. As you reach
// the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

// By modeling the process people use to choose (or abandon) their seat in the waiting area, you're
// pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

// The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or
// an occupied seat (#). For example, the initial seat layout might look like this:

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

// Now, you just need to model the people who will be arriving shortly. Fortunately, people are
// entirely predictable and always follow a simple set of rules. All decisions are based on the
// number of occupied seats adjacent to a given seat (one of the eight positions immediately up,
// down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
// Floor (.) never changes; seats don't move, and nobody sits on the floor.

// After one round of these rules, every seat in the example layout becomes occupied:

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

// After a second round, the seats with four or more occupied adjacent seats become empty again:

// #.LL.L#.##
// #LLLLLL.L#
// L.L.L..L..
// #LLL.LL.L#
// #.LL.LL.LL
// #.LLLL#.##
// ..L.L.....
// #LLLLLLLL#
// #.LLLLLL.L
// #.#LLLL.##

// This process continues for three more rounds:

// #.##.L#.##
// #L###LL.L#
// L.#.#..#..
// #L##.##.L#
// #.##.LL.LL
// #.###L#.##
// ..#.#.....
// #L######L#
// #.LL###L.L
// #.#L###.##

// #.#L.L#.##
// #LLL#LL.L#
// L.L.L..#..
// #LLL.##.L#
// #.LL.LL.LL
// #.LL#L#.##
// ..L.L.....
// #L#LLLL#L#
// #.LLLLLL.L
// #.#L#L#.##

// #.#L.L#.##
// #LLL#LL.L#
// L.#.L..#..
// #L##.##.L#
// #.#L.LL.LL
// #.#L#L#.##
// ..L.L.....
// #L#L##L#L#
// #.LLLLLL.L
// #.#L#L#.##

// At this point, something interesting happens: the chaos stabilizes and further applications
// of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

// Simulate your seating area by applying the seating rules repeatedly until no seats change state.
// How many seats end up occupied?

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
    // console.log(seatingArea);
    // printSeatingArea();
    // console.log(numOccupiedSeats);
    // console.log('');
    prevOccupiedSeats = numOccupiedSeats;
    seatPeople();
    numOccupiedSeats = countOccupiedSeats();
}

console.log(numOccupiedSeats);


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

            const neighbors: string[] = new Array();

            if (r > 0) {
                if (c > 0) { neighbors.push(seatingArea[r-1][c-1]); }
                neighbors.push(seatingArea[r-1][c]);
                if (c < seatingArea[0].length - 1) { neighbors.push(seatingArea[r-1][c+1]); }
            }

            if (c > 0) { neighbors.push(seatingArea[r][c-1]); }
            // neighbors.push(seatingArea[r][c]);
            if (c < seatingArea[0].length - 1) { neighbors.push(seatingArea[r][c+1]); }

            if (r < seatingArea.length - 1) {
                if (c > 0) { neighbors.push(seatingArea[r+1][c-1]); }
                neighbors.push(seatingArea[r+1][c]);
                if (c < seatingArea[0].length - 1) { neighbors.push(seatingArea[r+1][c+1]); }
            }

            // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
            if (seatingArea[r][c] === 'L') {
                if (!neighbors.includes('#')) { newSeatingArea[r][c] = '#'; }
            }

            // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
            else if (seatingArea[r][c] === '#') {
                // console.log(`seat[${r},${c}] is occupied, neighbors are ${neighbors.join('')}`)
                if (neighbors.filter(x => x === '#').length >= 4) { /*console.log(`  seat becomes empty`);*/ newSeatingArea[r][c] = 'L'; }
            }
        }
    }

    seatingArea = newSeatingArea;
}
