
import { readFileSync } from 'fs';
import { exit } from 'process';

class Coordinate {
    name: string;
    x: number;
    y: number;

    constructor(name: string, x: number, y: number) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

const file = readFileSync('./06.input', 'utf-8');

const lines = file.split('\n');

const coordinates: Coordinate[] = [];

let maxX = 0, maxY = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [x, y] = lines[i].split(', ').map(x => parseInt(x));
    // const coord = new Coordinate(String.fromCharCode('A'.charCodeAt(0) + i), x, y);
    const coord = new Coordinate(i.toString(), x, y);
    coordinates.push(coord);

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
}

// console.log(coordinates);

const grid: string[][] = [];
const gridSize = Math.max(maxX, maxY);

for (let y = 0; y <= gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x <= gridSize; x++) {
        grid[y][x] = '.';
    }
}

for (const c of coordinates) {
    grid[c.y][c.x] = c.name;
}

// printGrid();

for (let y = 0; y <= gridSize; y++) {
    for (let x = 0; x <= gridSize; x++) {
        let debug = (y === 5 && x === 6);

        let minDistance = Infinity;
        let closestCoordinate = '';

        for (const c of coordinates) {
            const distance = manhattan(x, y, c);
            // if (debug) { console.log(`Distance from coordinate ${c.name} to [${y},${x}] is ${distance}`); }
            if (distance < minDistance) {
                minDistance = distance;
                closestCoordinate = c.name.toLowerCase();
            } else if (distance === minDistance) {
                closestCoordinate = '.';
                // break;
            }
        }

        // if (debug) { console.log(`Closest coordinate to [${x},${y}] is ${closestCoordinate}`); }

        if (grid[y][x] === '.') {
            grid[y][x] = closestCoordinate;
        }
    }
}

console.log();
printGrid();


let maxArea = 0;
let maxCoord = '';
for (const c of coordinates) {
    if (getArea(c) > maxArea) { maxCoord = c.name; }
    maxArea = Math.max(maxArea, getArea(c));
}
console.log(maxArea);
console.log(maxCoord);


function getArea(c: Coordinate): number {
    const label = c.name.toLowerCase();
    let isInfinite = false;
    let area = 0;

    for (let y = 0; y <= gridSize; y++) {
        if (isInfinite) {
            break;
        }

        for (let x = 0; x <= gridSize; x++) {
            if (grid[y][x].toLowerCase() === label) {
                if (x === 0 || y === 0 || x === gridSize || y === gridSize) {
                    isInfinite = true;
                    break;
                }

                area++;
            }
        }
    }

    // console.log(`area of ${c.name} is ${isInfinite ? -1 : area}`);
    return isInfinite ? -1 : area;
}


function manhattan(x: number, y: number, c: Coordinate): number {
    return Math.abs(c.y - y) + Math.abs(c.x - x);
}


function printGrid() {
    for (let y = 0; y <= gridSize; y++) {
        console.log(grid[y].join(''));
    }

    console.log();
}

// 4557 is too high
