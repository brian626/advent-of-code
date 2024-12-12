
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

const HEIGHT = map.length;
const WIDTH = map[0].length;


class Trail {
    trailhead: number[];
    children: number[][];
    tops: Set<string>;
    // score: number;

    constructor(th: number[]) {
        this.trailhead = Array.from(th);
        this.children = [];
        this.tops = new Set<string>();
        // this.score = 0;
    }
}

const trails: Trail[] = [];

for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
        if (map[r][c] === '0') {
            trails.push(new Trail([r, c]));
        }
    }
}

for (const t of trails) {
    const steps: number[][] = [t.trailhead];
    while (steps.length > 0) {
        const [row, col] = steps.shift();
        const elevation = parseInt(map[row][col]);

        if (elevation === 9) {
            t.tops.add(`${row},${col}`);
            // t.score++;
            continue;
        }

        if (row > 0 && map[row - 1][col] === (elevation + 1).toString()) { steps.push([row - 1, col]); }
        if (row < HEIGHT - 1 && map[row + 1][col] === (elevation + 1).toString()) { steps.push([row + 1, col]); }
        if (col > 0 && map[row][col - 1] === (elevation + 1).toString()) { steps.push([row, col - 1]); }
        if (col < WIDTH - 1 && map[row][col + 1] === (elevation + 1).toString()) { steps.push([row, col + 1]); }
    }
}

console.log(trails);

let score = 0;
for (const t of trails) {
    score += t.tops.size;
}

console.log(score);
