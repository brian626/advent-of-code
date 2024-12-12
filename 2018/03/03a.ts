
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

class Claim {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;

    constructor(i: string, l: number, t: number, w: number, h: number) {
        this.id = i;
        this.left = l;
        this.top = t;
        this.width = w;
        this.height = h;
    }
}

const claims: Claim[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [id, _1, lt, wh] = lines[i].split(' ');
    const [left, right] = lt.slice(0, -1).split(',');
    const [width, height] = wh.split('x');

    claims.push(new Claim(id.slice(1), parseInt(left), parseInt(right), parseInt(width), parseInt(height)));
}

// console.log(claims);

const grid: string[][] = [];

for (const claim of claims) {
    for (let r = claim.top; r < claim.top + claim.height; r++) {
        if (grid[r] === undefined) { grid[r] = []; }
        for (let c = claim.left; c < claim.left + claim.width; c++) {
            if (grid[r][c] === undefined) {
                grid[r][c] = claim.id;
            } else {
                grid[r][c] = 'X';
            }
        }
    }
}

// console.log(grid);

let count = 0;

for (let r = 0; r < grid.length; r++) {
    if (!grid[r]) { continue; }

    for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 'X') {
            count++;
        }
    }
}

console.log(count);
