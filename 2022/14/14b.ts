// --- Part Two ---
// You realize you misread the scan. There isn't an endless void at the bottom of the scan - there's floor, and you're standing on it!

// You don't have time to scan the floor, so assume the floor is an infinite horizontal line with a y coordinate equal to two plus the
// highest y coordinate of any point in your scan.

// In the example above, the highest y coordinate of any point is 9, and so the floor is at y=11. (This is as if your scan contained
// one extra rock path like -infinity,11 -> infinity,11.) With the added floor, the example above now looks like this:

// To find somewhere safe to stand, you'll need to simulate falling sand until a unit of sand comes to rest at 500,0, blocking the
// source entirely and stopping the flow of sand into the cave. In the example above, the situation finally looks like this after
// 93 units of sand come to rest:

// Using your scan, simulate the falling sand until the source of the sand becomes blocked. How many units of sand come to rest?

import { readFileSync } from 'fs';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

const HEIGHT = 1000;
const WIDTH = 1000;
let grid: string[][] = [];
for (let i = 0; i < HEIGHT; i++) {
    grid[i] = [];
    for (let j = 0; j < WIDTH; j++) {
        grid[i][j] = '·';
    }
}

let deepestSegment = 0;

for (let i = 0; i < lines.length; i++) {
    const segments = lines[i].split(' -> ');
    for (let j = 0; j < segments.length - 1; j++) {
        drawSegment(segments[j], segments[j+1]);
    }
}

grid[0][500] = '+';

// Add floor
drawSegment(`0,${deepestSegment + 2}`,`${WIDTH - 1},${deepestSegment + 2}`);

// printGrid();

let sand = 0;
while (true) {
    if (!sandCanFlow()) {
        break;
    }
    sand++;
}

// printGrid();

console.log(sand);


function drawSegment(p1: string, p2: string) {
    // console.log(`drawing segment from ${p1} to ${p2}`);
    const x1 = Number(p1.split(',')[0]);
    const y1 = Number(p1.split(',')[1]);
    const x2 = Number(p2.split(',')[0]);
    const y2 = Number(p2.split(',')[1]);
    deepestSegment = Math.max(deepestSegment, y1, y2);

    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            grid[y][x] = '#';
        }
    }
}

function printGrid() {
    for (let y = 0; y < HEIGHT; y++) {
        console.log(grid[y].join(''));
    }
    console.log(``);
}

function sandCanFlow() {
    let sandX = 500;
    let sandY = 0;

    while (true) {
        if (grid[sandY + 1][sandX] === '·') {
            sandY++;
        } else if (grid[sandY + 1][sandX - 1] === '·') {
            sandY++;
            sandX--;
        } else if (grid[sandY + 1][sandX + 1] === '·') {
            sandY++;
            sandX++;
        // } else if (sandY === 0 && {
        //     break;
        } else {
            if (grid[sandY][sandX] !== 'o') {
                grid[sandY][sandX] = 'o';
                return true;
            } else {
                break;
            }
        }
    }

    return false;
}
