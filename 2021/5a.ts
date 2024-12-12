// You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce
// large, opaque clouds, so it would be best to avoid them if possible.

// They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents
// (your puzzle input) for you to review. For example:

// 0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2

// Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 where x1,y1 are the
// coordinates of one end the line segment and x2,y2 are the coordinates of the other end. These
// line segments include the points at both ends. In other words:

// An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
// An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
// For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

// So, the horizontal and vertical lines from the above list would produce the following diagram:

// .......1..
// ..1....1..
// ..1....1..
// .......1..
// .112111211
// ..........
// ..........
// ..........
// ..........
// 222111....

// In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position
// is shown as the number of lines which cover that point or . if no line covers that point. The
// top-left pair of 1s, for example, comes from 2,2 -> 2,1; the very bottom row is formed by the
// overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.

// To avoid the most dangerous areas, you need to determine the number of points where at least
// two lines overlap. In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.

// Consider only horizontal and vertical lines. At how many points do at least two lines overlap?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./5.input', 'utf-8');

const lines = file.split('\n');

const points: number[][] = new Array();

const SIZE = 1000;

for (let r = 0; r < SIZE; r++) {
    points[r] = new Array();

    for (let c = 0; c < SIZE; c++) {
        points[r][c] = 0;
    }
}

lines.forEach(line => {
    // Each line will be in the form x1,y1 -> x2,y2
    const parts: string[] = line.split(' ');
    // console.log(parts);
    if (parts.length === 3) {
        const firstCoordinates: string[] = parts[0].split(',');
        const secondCoordinates: string[] = parts[2].split(',');
        const x1 = Math.min(parseInt(firstCoordinates[0]), parseInt(secondCoordinates[0]));
        const x2 = Math.max(parseInt(firstCoordinates[0]), parseInt(secondCoordinates[0]));
        const y1 = Math.min(parseInt(firstCoordinates[1]), parseInt(secondCoordinates[1]));
        const y2 = Math.max(parseInt(firstCoordinates[1]), parseInt(secondCoordinates[1]));

        if ((x1 === x2) || (y1 === y2)) {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    points[y][x] += 1;
                }
            }
        }
    }
});

let numOverlaps = 0;
for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
        if (points[y][x] > 1) {
            numOverlaps++;
        }
    }
}
console.log(numOverlaps);
