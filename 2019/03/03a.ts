
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

const grid: Map<string, string> = new Map<string, string>();
grid.set(`0:0`, 'o');

const wirePaths: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    wirePaths.push(lines[i]);
}

const intersectionDistances: number[] = [];

let markIntersections = false;
const path1: string[] = wirePaths[0].split(',');
followPath(path1);
// printGrid();
markIntersections = true;
const path2: string[] = wirePaths[1].split(',');
followPath(path2);
// printGrid();

console.log(intersectionDistances.sort((a, b) => a - b));
console.log(Math.min(...intersectionDistances));
// 2074, 2266, 2346 are too low
// 5221 is not right
// console.log(findClosestIntersection());

function followPath(path: string[]): void {
    let r = 0;
    let c = 0;

    while (path.length > 0) {
        const move = path.shift();
        const direction = move[0];
        const distance = parseInt(move.slice(1));
        // console.log(direction, distance);
        if (direction === 'R') {
            for (let i = 0; i < distance - 1; i++) {
                c += 1;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? '>' : '-');
                } else if (curval === '|') {
                    if (markIntersections) {
                        console.log(`moving R, found |, marking [${c},${r}] as intersection with distance ${manhattan(r,c)}`);
                        grid.set(`${c}:${r}`, 'X');
                        intersectionDistances.push(manhattan(r, c));
                    }
                }
            }

            c += 1;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '-');
        } else if (direction === 'L') {
            for (let i = 0; i < distance - 1; i++) {
                c -= 1;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? '>' : '-');
                } else if (curval === '|') {
                    if (markIntersections) {
                        console.log(`moving L, found |, marking [${c},${r}] as intersection with distance ${manhattan(r,c)}`);
                        grid.set(`${c}:${r}`, 'X');
                        intersectionDistances.push(manhattan(r, c));
                    }
                }
            }

            c -= 1;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '-');
        } else if (direction === 'D') {
            for (let i = 0; i < distance - 1; i++) {
                r -= 1;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? 'v' : '|');
                } else if (curval === '-') {
                    if (markIntersections) {
                        console.log(`moving D, found -, marking [${c},${r}] as intersection with distance ${manhattan(r,c)}`);
                        grid.set(`${c}:${r}`, 'X');
                        intersectionDistances.push(manhattan(r, c));
                    }
                }
            }

            r -= 1;
            grid.set(`${c}:${r}`, path.length > 0 ? '+' : '|');
        } else if (direction === 'U') {
            for (let i = 0; i < distance - 1; i++) {
                r += 1;
                const curval = grid.get(`${c}:${r}`) || '.';
                if (curval === '.') {
                    grid.set(`${c}:${r}`, markIntersections ? 'v' : '|');
                } else if (curval === '-') {
                    if (markIntersections) {
                        console.log(`moving U, found -, marking [${c},${r}] as intersection with distance ${manhattan(r,c)}`);
                        grid.set(`${c}:${r}`, 'X');
                        intersectionDistances.push(manhattan(r, c));
                    }
                }
            }

            r += 1;
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