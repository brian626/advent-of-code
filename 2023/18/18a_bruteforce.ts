
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

const directions: string[] = [];
const distances: number[] = [];
const colors: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const [direction, distance, color] = lines[i].split(' ');
    directions.push(direction);
    distances.push(parseInt(distance));
    colors.push(color);
}

// Determine grid boundaries
let xPos = 0;
let yPos = 0;
let maxWidth = 0;
let minWidth = 0;
let maxHeight = 0;
let minHeight = 0;
for (let i = 0; i < directions.length; i++) {
    if (directions[i] === 'R') { xPos += distances[i]; }
    else if (directions[i] === 'L') { xPos -= distances[i]; }
    else if (directions[i] === 'U') { yPos -= distances[i]; }
    else if (directions[i] === 'D') { yPos += distances[i]; }

    maxWidth = Math.max(maxWidth, xPos);
    maxHeight = Math.max(maxHeight, yPos);
    minWidth = Math.min(minWidth, xPos);
    minHeight = Math.min(minHeight, yPos);
}

let gridWidth = Math.abs(minWidth) + maxWidth + 3;
let gridHeight = Math.abs(minHeight) + maxHeight + 3;
console.log(gridWidth, gridHeight);
const grid: string[][] = [];
for (let r = 0; r < gridHeight; r++) {
    grid[r] = [];
    for (let c = 0; c < gridWidth; c++) {
        grid[r][c] = '.';
    }
}

console.log('before dig');
printGrid(grid);

// Draw outline
xPos = Math.abs(minWidth) + 1;
yPos = Math.abs(minHeight) + 1;
grid[yPos][xPos] = '#';
for (let i = 0; i < directions.length; i++) {
    if (directions[i] === 'R') {
        for (let j = 0; j < distances[i]; j++) {
            xPos += 1;
            grid[yPos][xPos] = '#';
        }
    } else if (directions[i] === 'L') {
        for (let j = 0; j < distances[i]; j++) {
            xPos -= 1;
            grid[yPos][xPos] = '#';
        }
    } else if (directions[i] === 'U') {
        for (let j = 0; j < distances[i]; j++) {
            yPos -= 1;
            grid[yPos][xPos] = '#';
        }
    } else if (directions[i] === 'D') {
        for (let j = 0; j < distances[i]; j++) {
            yPos += 1;
            grid[yPos][xPos] = '#';
        }
    }
}

console.log(`after dig`);
printGrid(grid);

// Fill in exterior
const exteriorSpaces: number[][] = [[0,0]];
while (exteriorSpaces.length > 0) {
    // console.log(`there are ${exteriorSpaces.length} exterior space candidates`);
    // console.log(`exterior space candidates: [${exteriorSpaces.join(', ')}]`);
    const space = exteriorSpaces.shift();
    let [spaceR, spaceC] = [space[0], space[1]];
    if (grid[spaceR][spaceC] === '.') {
        // console.log(`grid[${spaceR}, ${spaceC}] is outside`);
        grid[spaceR][spaceC] = 'X';
    } else if (grid[spaceR][spaceC] === 'X') { continue; }

    if (spaceR > 0 && grid[spaceR-1][spaceC] === '.') { exteriorSpaces.push([spaceR-1, spaceC]); }
    if (spaceR < grid.length - 1 && grid[spaceR+1][spaceC] === '.') { exteriorSpaces.push([spaceR+1, spaceC]); }
    if (spaceC > 0 && grid[spaceR][spaceC-1] === '.') { exteriorSpaces.push([spaceR, spaceC-1]); }
    if (spaceC < grid[0].length - 1 && grid[spaceR][spaceC+1] === '.') { exteriorSpaces.push([spaceR, spaceC+1]); }
}

printGrid(grid);

// Fill in lagoon
for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === '.') { grid[r][c] = '#'; }
    }
}

printGrid(grid);

// Count lagoon capacity
let count = 0;
for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === '#') { count += 1; }
    }
}

console.log(count);



function printGrid(g: string[][]) {
    for (let r = 0; r < g.length; r++) {
        console.log(g[r].join(''));
    }
    console.log();
}
