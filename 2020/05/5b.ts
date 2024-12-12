// --- Part Two ---
// Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

// It's a completely full flight, so your seat should be the only missing boarding pass
// in your list. However, there's a catch: some of the seats at the very front and back of
// the plane don't exist on this aircraft, so they'll be missing from your list as well.

// Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from
// yours will be in your list.

// What is the ID of your seat?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./5.input', 'utf-8');

const lines = file.split('\n');

const seatIds: number[] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // The first 7 characters will either be F or B; these specify exactly one of the 128
    // rows on the plane (numbered 0 through 127). Each letter tells you which half of a region
    // the given seat is in. Start with the whole list of rows; the first letter indicates whether
    // the seat is in the front (0 through 63) or the back (64 through 127). The next letter
    // indicates which half of that region the seat is in, and so on until you're left with exactly one row.
    const rowStr = lines[i].slice(0,7);
    let lowerRow = 0;
    let upperRow = 127;
    for (let i = 0; i < rowStr.length; i++) {
        const numRows = upperRow - lowerRow;
        if (rowStr[i] === 'F') {
            upperRow -= Math.floor(numRows / 2);
        } else {
            lowerRow += Math.ceil(numRows / 2);
        }
    }

    // The last three characters will be either L or R; these specify exactly one of
    // the 8 columns of seats on the plane (numbered 0 through 7). The same process as
    // above proceeds again, this time with only three steps. L means to keep the lower
    // half, while R means to keep the upper half.
    const seatStr = lines[i].slice(7);
    let lowerSeat = 0;
    let upperSeat = 7;
    for (let i = 0; i < seatStr.length; i++) {
        const numSeats = upperSeat - lowerSeat;
        if (seatStr[i] === 'L') {
            upperSeat -= Math.floor(numSeats / 2);
        } else {
            lowerSeat += Math.ceil(numSeats / 2);
        }
    }

    // Every seat also has a unique seat ID: multiply the row by 8, then add the column.
    const seatId = lowerRow * 8 + lowerSeat;
    seatIds.push(seatId);
}

seatIds.sort((a,b) => a - b);
for (let i = 1; i < seatIds.length - 1; i++) {
    if (seatIds[i-1] === seatIds[i] - 2) { console.log(seatIds[i-1] + 1); }
}
