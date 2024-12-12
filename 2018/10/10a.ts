
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

class Point {
    posX: number;
    posY: number;
    velX: number;
    velY: number;

    constructor(px: number, py: number, vx: number, vy: number) {
        this.posX = px;
        this.posY = py;
        this.velX = vx;
        this.velY = vy;
    }

    move(): void {
        this.posX += this.velX;
        this.posY += this.velY;
    }
}

const points: Point[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /^position=<\s*([\d-]+),\s*([\d-]+)> velocity=<\s*([\d-]+),\s*([\d-]+)>$/.exec(lines[i]);

    const p = new Point(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4]));
    points.push(p);
}


const width = 65; // Math.abs(minX) + Math.abs(maxX) + 1;
const height = 20; // Math.abs(minY) + Math.abs(maxY) + 1;

// console.log(points);

// printGrid();
let time = 0;
let success = false;

for (let i = 0; i < 1000000; i++) {
    let minX = Math.pow(2, 32), maxX = -1 * Math.pow(2, 32);
    let minY = minX, maxY = maxX;
    for (const p of points) {
        minX = Math.min(p.posX, minX);
        maxX = Math.max(p.posX, maxX);
        minY = Math.min(p.posY, minY);
        maxY = Math.max(p.posY, maxY);
    }
    // if ((Math.abs(minX) + Math.abs(maxX) < 400) && (Math.abs(minY) + Math.abs(maxY) < 400)) {
    if ((maxX - minX < width) && (maxY - maxY < height)) {
        console.log(minX, maxX, minY, maxY);
        printGrid();
        // success = true;
        // break;
    }

    for (const p of points) {
        p.move();
    }
    time++;
}

if (success) {
    printGrid();
} else {
    console.log(`didn't find a solution`);
}


function printGrid(): void {
    let minX = Math.pow(2, 32), maxX = -1 * Math.pow(2, 32);
    let minY = minX, maxY = maxX;

    for (const p of points) {
        minX = Math.min(p.posX, minX);
        maxX = Math.max(p.posX, maxX);
        minY = Math.min(p.posY, minY);
        maxY = Math.max(p.posY, maxY);
    }
    const widthOffset = -1 * minX;
    const heightOffset = -1 * minY;

    const grid: string[][] = [];

    for (let y = 0; y < height; y++) {
        grid[y] = [];
        for (let x = 0; x < width; x++) {
            grid[y][x] = '.';
        }
    }

    for (const p of points) {
        grid[p.posY + heightOffset][p.posX + widthOffset] = '#'
        // console.log(p.posY, p.posX);
    }

    console.log(`After ${time} seconds:`);
    for (let y = 0; y < height; y++) {
        console.log(grid[y].join(''));
    }
    console.log();
}
