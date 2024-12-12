
import { readFileSync } from 'fs';
import { exit } from 'process';

enum DIRECTION { 'Up', 'Right', 'Down', 'Left' }

class Beam {
    row: number;
    col: number;
    direction: DIRECTION;
    name: string;

    constructor(r: number, c: number, d: number) {
        this.row = r;
        this.col = c;
        this.direction = d;
        this.name = '';
    }
}

function printGrid(g: string[][]) {
    for (let r = 0; r < g.length; r++) {
        console.log(g[r].join(''));
    }

    console.log();
}

function countEnergizedTiles(g: string[][]): number {
    let count = 0;
    for (let r = 0; r < g.length; r++) {
        for (let c = 0; c < g[0].length; c++) {
            if (g[r][c] === '#') { count += 1; }
        }
    }

    return count;
}

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

const gridWidth = grid[0].length;
const gridHeight = grid.length;

// printGrid(grid);

let beam0 = new Beam(0, -1, DIRECTION.Right);
const beams: Beam[] = [beam0];

const energizedGrid: string[][] = [];

for (let r = 0; r < gridHeight; r++) {
    energizedGrid[r] = [];
    for (let c = 0; c < gridWidth; c++) {
        energizedGrid[r][c] = '.';
    }
}
// energizedGrid[0][0] = '#';

let energizedTiles = countEnergizedTiles(energizedGrid);

while (beams.length > 0) {
    // console.log(`There are ${beams.length} beams`);
    const beam = beams.shift();
    // console.log(`${beam.name} starts at [${beam.row}, ${beam.col}] with direction ${beam.direction}`);

    if (beam.direction === DIRECTION.Up) { beam.row -= 1; }
    else if (beam.direction === DIRECTION.Down) { beam.row += 1; }
    else if (beam.direction === DIRECTION.Left) { beam.col -= 1; }
    else if (beam.direction === DIRECTION.Right) { beam.col += 1; }

    // console.log(`  ${beam.name} moves to [${beam.row}, ${beam.col}]`);

    if (beam.row < 0 || beam.col < 0 || beam.row >= gridHeight || beam.col >= gridWidth) {
        // console.log(`  ${beam.name} fades out\n`);
        continue;
    }

    energizedGrid[beam.row][beam.col] = '#';

    const space = grid[beam.row][beam.col];

    if (space === '/') {
        if (beam.direction === DIRECTION.Up) { beam.direction = DIRECTION.Right; }
        else if (beam.direction === DIRECTION.Down) { beam.direction = DIRECTION.Left; }
        else if (beam.direction === DIRECTION.Left) { beam.direction = DIRECTION.Down; }
        else if (beam.direction === DIRECTION.Right) { beam.direction = DIRECTION.Up; }

        // console.log(`  ${beam.name} turns to direction ${beam.direction}`);
    } else if (space === '\\') {
        if (beam.direction === DIRECTION.Up) { beam.direction = DIRECTION.Left; }
        else if (beam.direction === DIRECTION.Down) { beam.direction = DIRECTION.Right; }
        else if (beam.direction === DIRECTION.Left) { beam.direction = DIRECTION.Up; }
        else if (beam.direction === DIRECTION.Right) { beam.direction = DIRECTION.Down; }

        // console.log(`  ${beam.name} turns to direction ${beam.direction}`);
    } else if (space === '-') {
        if (beam.direction === DIRECTION.Up || beam.direction === DIRECTION.Down) {
            const newBeam = new Beam(beam.row, beam.col, DIRECTION.Left);
            beams.push(newBeam);
            beam.direction = DIRECTION.Right;
            grid[beam.row][beam.col] = '=';
            // console.log(`  ${beam.name} splits into two`);
        }
    } else if (space === '=') {
        if (beam.direction === DIRECTION.Up || beam.direction === DIRECTION.Down) {
            continue;
        }
    } else if (space === '|') {
        if (beam.direction === DIRECTION.Left || beam.direction === DIRECTION.Right) {
            const newBeam = new Beam(beam.row, beam.col, DIRECTION.Up);
            beams.push(newBeam);
            beam.direction = DIRECTION.Down;
            grid[beam.row][beam.col] = ':';
            // console.log(`  ${beam.name} splits into two`);
        }
    } else if (space === ':') {
        if (beam.direction === DIRECTION.Left || beam.direction === DIRECTION.Right) {
            continue;
        }
    }

    beams.push(beam);

    // console.log();

    // printGrid(energizedGrid);
}

console.log(countEnergizedTiles(energizedGrid));

// 132 is too low
// 8620 is wrong
// 10579 is wrong
// 10617 is too high
// 10850 is too high
