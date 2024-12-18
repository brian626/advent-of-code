// Unfortunately, considering only horizontal and vertical lines doesn't give you the full
// picture; you need to also consider diagonal lines.

// Because of the limits of the hydrothermal vent mapping system, the lines in your list
// will only ever be horizontal, vertical, or a diagonal line at exactly 45 degrees. In other words:

// An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
// An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.

// Considering all lines from the above example would now produce the following diagram:

// 1.1....11.
// .111...2..
// ..2.1.111.
// ...1.2.2..
// .112313211
// ...1.2....
// ..1...1...
// .1.....1..
// 1.......1.
// 222111....

// You still need to determine the number of points where at least two lines overlap.
// In the above example, this is still anywhere in the diagram with a 2 or larger - now a total of 12 points.

// Consider all of the lines. At how many points do at least two lines overlap?

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
        const x1 = parseInt(firstCoordinates[0]);
        const x2 = parseInt(secondCoordinates[0]);
        const y1 = parseInt(firstCoordinates[1]);
        const y2 = parseInt(secondCoordinates[1]);

        if (x1 === x2) { // vertical line
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                points[y][x1] += 1;
            }
        }
        else if (y1 === y2) { // horizontal line
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                points[y1][x] += 1;
            }
        }
        else { // diagonal line
            let xDirection = 0;
            let yDirection = 0;

            if (x1 < x2 && y1 < y2)      { xDirection = 1; yDirection = 1; }
            else if (x1 < x2 && y1 > y2) { xDirection = 1; yDirection = -1; }
            else if (x1 > x2 && y1 < y2) { xDirection = -1; yDirection = 1; }
            else if (x1 > x2 && y1 > y2) { xDirection = -1; yDirection = -1; }

            let x = x1;
            let y = y1;

            while (x != x2) {
                points[y][x] += 1;
                x += xDirection;
                y += yDirection;
            }
            points[y][x] += 1;
        }
    }
});

// console.log(points);

let numOverlaps = 0;
for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
        if (points[y][x] > 1) {
            numOverlaps++;
        }
    }
}
console.log(numOverlaps);
