
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    grid[i] = lines[i].split('');
}

// console.log(grid);

// Find the starting position and determine what kind of pipe it is
let rowS = -1;
let colS = -1;
for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === 'S') {
            rowS = r;
            colS = c;
        }
    }
}

// console.log([rowS, colS]);

let canGoNorth = checkNorth(grid, rowS, colS);
let canGoEast = checkEast(grid, rowS, colS);
let canGoWest = checkWest(grid, rowS, colS);
let canGoSouth = checkSouth(grid, rowS, colS);

if (canGoNorth && canGoSouth) { grid[rowS][colS] = '|'; }
else if (canGoNorth && canGoEast) { grid[rowS][colS] = 'L'; }
else if (canGoNorth && canGoWest) { grid[rowS][colS] = 'J'; }
else if (canGoSouth && canGoEast) { grid[rowS][colS] = 'F'; }
else if (canGoSouth && canGoWest) { grid[rowS][colS] = '7'; }
else if (canGoEast && canGoWest) { grid[rowS][colS] = '-'; }

// console.log(grid);
// console.log(grid[rowS][colS]);

const distanceGrid: number[][] = [];
for (let r = 0; r < grid.length; r++) {
    distanceGrid[r] = [];
    for (let c = 0; c < grid[0].length; c++) {
        distanceGrid[r][c] = -1;
    }
}

distanceGrid[rowS][colS] = 0;

let r = rowS;
let c = colS;
let distance = 0;
let lastMove = '';

if (canGoNorth && canGoSouth) {
    // Move 1: North
    r -= 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'north';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: South
    r = rowS + 1;
    c = colS;
    distance = 1;
    lastMove = 'south';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

else if (canGoNorth && canGoEast) {
    // Move 1: North
    r -= 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'north';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: East
    r = rowS;
    c = colS + 1;
    distance = 1;
    lastMove = 'east';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

else if (canGoNorth && canGoWest) {
    // Move 1: North
    r -= 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'north';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: West
    r = rowS;
    c = colS - 1;
    distance = 1;
    lastMove = 'west';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

else if (canGoSouth && canGoEast) {
    // Move 1: South
    r += 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'south';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: East
    r = rowS;
    c = colS + 1;
    distance = 1;
    lastMove = 'east';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

else if (canGoSouth && canGoWest) {
    // Move 1: South
    r += 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'south';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: West
    r = rowS;
    c = colS - 1;
    distance = 1;
    lastMove = 'west';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

else if (canGoEast && canGoWest) {
    // Move 1: East
    c += 1;
    distance = 1;
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);
    lastMove = 'east';

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }

    // Move 1: West
    r = rowS;
    c = colS - 1;
    distance = 1;
    lastMove = 'west';
    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? distance : Math.min(distanceGrid[r][c], distance);

    while (true) {
        [r, c, distance, lastMove] = followPath(r, c, distance, lastMove);
        if (distance === -1) { break;}
    }
}

// console.log(distanceGrid);

let max = 0;
for (let r = 0; r < distanceGrid.length; r++) {
    for (let c = 0; c < distanceGrid[0].length; c++) {
        max = Math.max(max, distanceGrid[r][c]);
    }
}

console.log(max);


function followPath(r: number, c: number, d: number, lastMove: string): [number, number, number, string] {
    d += 1;
    let nextMove = '';

    canGoNorth = grid[r][c] === '|' || grid[r][c] === 'L' || grid[r][c] === 'J';
    canGoEast = grid[r][c] === '-' || grid[r][c] === 'L' || grid[r][c] === 'F';
    canGoWest = grid[r][c] === '-' || grid[r][c] === 'J' || grid[r][c] === '7';
    canGoSouth = grid[r][c] === '|' || grid[r][c] === 'F' || grid[r][c] === '7';

    if (lastMove != 'north' && canGoSouth) { r += 1; nextMove = 'south'; }
    else if (lastMove != 'east' && canGoWest) { c -= 1; nextMove = 'west'; }
    else if (lastMove != 'west' && canGoEast) { c += 1; nextMove = 'east'; }
    else if (lastMove != 'south' && canGoNorth) { r -= 1; nextMove = 'north'; }

    if (distanceGrid[r][c] === 0) { return [r, c, -1, '']; }

    distanceGrid[r][c] = distanceGrid[r][c] === -1 ? d : Math.min(distanceGrid[r][c], d);

    canGoNorth = grid[r][c] === '|' || grid[r][c] === 'L' || grid[r][c] === 'J';
    canGoEast = grid[r][c] === '-' || grid[r][c] === 'L' || grid[r][c] === 'F';
    canGoWest = grid[r][c] === '-' || grid[r][c] === 'J' || grid[r][c] === '7';
    canGoSouth = grid[r][c] === '|' || grid[r][c] === 'F' || grid[r][c] === '7';

    return [r, c, d, nextMove];
}

function checkNorth(grid: string[][], r: number, c: number): boolean {
    if (r === 0) { return false; }
    return grid[r-1][c] === '|' || grid[r-1][c] === '7' || grid[r-1][c] === 'F';
}

function checkEast(grid: string[][], r: number, c: number): boolean {
    if (c === grid[0].length - 1) { return false; }
    return grid[r][c+1] === '-' || grid[r][c+1] === '7' || grid[r][c+1] === 'J';
}

function checkWest(grid: string[][], r: number, c: number): boolean {
    if (c === 0) { return false; }
    return grid[r][c-1] === '-' || grid[r][c-1] === 'L' || grid[r][c-1] === 'F';
}

function checkSouth(grid: string[][], r: number, c: number): boolean {
    if (r === grid.length - 1) { return false; }
    return grid[r+1][c] === '|' || grid[r+1][c] === 'L' || grid[r+1][c] === 'J';
}

// 13771 is too high
// 13770 is too high
