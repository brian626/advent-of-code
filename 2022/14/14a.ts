// --- Day 14: Regolith Reservoir ---

// The distress signal leads you to a giant waterfall! Actually, hang on - the signal seems like it's coming from the waterfall itself,
// and that doesn't make any sense. However, you do notice a little path that leads behind the waterfall.

// Correction: the distress signal leads you behind a giant waterfall! There seems to be a large cave system here, and the signal
// definitely leads further inside.

// As you begin to make your way deeper underground, you feel the ground rumble for a moment. Sand begins pouring into the cave!
// If you don't quickly figure out where the sand is going, you could quickly become trapped!

// Fortunately, your familiarity with analyzing the path of falling material will come in handy here. You scan a two-dimensional
// vertical slice of the cave above you (your puzzle input) and discover that it is mostly air with structures made of rock.

// Your scan traces the path of each solid rock structure and reports the x,y coordinates that form the shape of the path,
// where x represents distance to the right and y represents distance down. Each path appears as a single line of text in your scan.
// After the first point of each path, each point indicates the end of a straight horizontal or vertical line to be drawn from the
// previous point.

// Using your scan, simulate the falling sand. How many units of sand come to rest before sand starts flowing into the abyss below?

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
// printGrid();

let sand = 0;
while (true) {
    if (!sandComesToRest()) {
        break;
    }
    sand++;
}

// printGrid();

console.log(sand);


function drawSegment(p1: string, p2: string) {
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

function sandComesToRest() {
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
        } else {
            grid[sandY][sandX] = 'o';
            return true;
        }

        if (sandY > deepestSegment) {
            break;
        }
    }

    return false;
}
