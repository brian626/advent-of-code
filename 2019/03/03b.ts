
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

let grid: Map<string, string> = new Map<string, string>();
grid.set(`0:0`, 'o');

const wirePaths: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    wirePaths.push(lines[i]);
}

// const intersectionDistances: number[] = [];

class Intersection {
    distance: number;
    wire1Steps: number;
    wire2Steps: number;

    constructor(d: number) {
        this.distance = d;
        this.wire1Steps = 0;
        this.wire2Steps = 0;
    }
}

const intersections: Intersection[] = [];

let markIntersections = false;
let path1: string[] = wirePaths[0].split(',');
let path2: string[] = wirePaths[1].split(',');

console.log(`following wire 1`);
followPath(1, path1);
console.log();

markIntersections = true;
console.log(`following wire 2`);
followPath(2, path2);
console.log();

path1 = wirePaths[0].split(',');
path2 = wirePaths[1].split(',');

grid = new Map<string, string>();
grid.set(`0:0`, 'o');

markIntersections = false;
console.log(`following wire 2 again`);
followPath(2, path2);
console.log();

markIntersections = true;
console.log(`following wire 1 again`);
followPath(1, path1);
console.log();

// console.log(intersectionDistances.sort((a, b) => a - b));
// console.log(Math.min(...intersectionDistances));
console.log(intersections);
let minSteps = Math.pow(2, 32);
for (const i of intersections) {
    const pair = intersections.filter(x => x.distance === i.distance);
    const steps = pair[0].wire1Steps + pair[0].wire2Steps + pair[1].wire1Steps + pair[1].wire2Steps;
    if (steps < minSteps) {
        minSteps = steps;
    }
}
console.log(minSteps);

function followPath(wireNum: number, path: string[]): void {
    let r = 0;
    let c = 0;
    let steps = 0;

    while (path.length > 0) {
        const move = path.shift();
        const direction = move[0];
        const distance = parseInt(move.slice(1));
        // console.log(direction, distance);
        console.log(`move is ${move}`);

        if (direction === 'R') {
            for (let i = 0; i < distance - 1; i++) {
                c += 1;
                console.log(`adding step`);
                steps++;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? '>' : '-');
                } else if (curval === '|') {
                    if (markIntersections) {
                        console.log(`moving R, found |, marking [${c},${r}] as intersection with distance ${manhattan(r, c)} and ${steps} steps`);
                        grid.set(`${c}:${r}`, 'X');
                        const int = new Intersection(manhattan(r, c));
                        if (wireNum === 1) { int.wire1Steps = steps; }
                        else { int.wire2Steps = steps; }
                        intersections.push(int);
                    }
                }
            }

            c += 1;
            console.log(`adding step`);
            steps++;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '-');
        } else if (direction === 'L') {
            for (let i = 0; i < distance - 1; i++) {
                c -= 1;
                console.log(`adding step`);
                steps++;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? '>' : '-');
                } else if (curval === '|') {
                    if (markIntersections) {
                        console.log(`moving L, found |, marking [${c},${r}] as intersection with distance ${manhattan(r, c)} and ${steps} steps`);
                        grid.set(`${c}:${r}`, 'X');
                        const int = new Intersection(manhattan(r, c));
                        if (wireNum === 1) { int.wire1Steps = steps; }
                        else { int.wire2Steps = steps; }
                        intersections.push(int);
                    }
                }
            }

            c -= 1;
            console.log(`adding step`);
            steps++;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '-');
        } else if (direction === 'D') {
            for (let i = 0; i < distance - 1; i++) {
                r -= 1;
                console.log(`adding step`);
                steps++;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? 'v' : '|');
                } else if (curval === '-') {
                    if (markIntersections) {
                        console.log(`moving D, found -, marking [${c},${r}] as intersection with distance ${manhattan(r, c)} and ${steps} steps`);
                        grid.set(`${c}:${r}`, 'X');
                        const int = new Intersection(manhattan(r, c));
                        if (wireNum === 1) { int.wire1Steps = steps; }
                        else { int.wire2Steps = steps; }
                        intersections.push(int);
                    }
                }
            }

            r -= 1;
            console.log(`adding step`);
            steps++;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '|');
        } else if (direction === 'U') {
            for (let i = 0; i < distance - 1; i++) {
                r += 1;
                console.log(`adding step`);
                steps++;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? 'v' : '|');
                } else if (curval === '-') {
                    if (markIntersections) {
                        console.log(`moving U, found -, marking [${c},${r}] as intersection with distance ${manhattan(r, c)} and ${steps} steps`);
                        grid.set(`${c}:${r}`, 'X');
                        const int = new Intersection(manhattan(r, c));
                        if (wireNum === 1) { int.wire1Steps = steps; }
                        else { int.wire2Steps = steps; }
                        intersections.push(int);
                    }
                }
            }

            r += 1;
            console.log(`adding step`);
            steps++;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '|');
        }
    }
}

function printGrid(): void {
    // console.log(grid);
    let minR = 0;
    let maxR = 0;
    let minC = 0;
    let maxC = 0;

    for (const [k, v] of grid) {
        const [c, r] = k.split(':').map(x => parseInt(x));
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
    }

    minR -= 1;
    maxR += 1;
    minC -= 1;
    maxC += 1;

    // console.log(minR, maxR, minC, maxC);
    for (let r = maxR; r >= minR; r--) {
        let row = '';
        for (let c = minC; c <= maxC; c++) {
            const char = grid.get(`${c}:${r}`) || '.';
            row += char;
        }

        console.log(row);
    }

    console.log();
}


function findClosestIntersection(): number {
    // console.log(grid);
    let minR = 0;
    let maxR = 0;
    let minC = 0;
    let maxC = 0;

    for (const [k, v] of grid) {
        const [c, r] = k.split(':').map(x => parseInt(x));
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
    }

    minR -= 1;
    maxR += 1;
    minC -= 1;
    maxC += 1;

    let minDistance = Math.pow(2, 32);

    console.log(minR, maxR, minC, maxC);
    for (let r = minR; r <= maxR; r++) {
        if (r % 25 === 0) { console.log(r); }
        for (let c = minC; c <= maxC; c++) {
            // console.log(`getting grid[${r},${c}]`);
            const char = grid.get(`${c}:${r}`) || '.';
            if (char === 'X') {
                console.log(`found an X at [${r},${c}]`);
                minDistance = Math.min(minDistance, manhattan(r, c));
            }
        }
    }

    return minDistance;
}


function manhattan(r: number, c: number): number {
    return Math.abs(r) + Math.abs(c);
}
