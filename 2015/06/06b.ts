
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./06.input', 'utf-8');

const lines = file.split('\n');

const ROWS = 1000;
const COLS = 1000;
const lights: number[][] = [];

for (let r = 0; r < ROWS; r++) {
    lights[r] = [];
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [part1, part2] = lines[i].split(' through ');
    let startX = 0, startY = 0;
    let action = '';

    if (part1.startsWith('turn on')) {
        action = 'turn on';
        [startX, startY] = part1.slice(8).split(',').map(x => parseInt(x));
    } else if (part1.startsWith('toggle')) {
        action = 'toggle';
        [startX, startY] = part1.slice(7).split(',').map(x => parseInt(x));
    } else {
        action = 'turn off';
        [startX, startY] = part1.slice(9).split(',').map(x => parseInt(x));
    }

    const [endX, endY] = part2.split(',').map(x => parseInt(x));

    for (let c = startX; c <= endX; c++) {
        for (let r = startY; r <= endY; r++) {
            if (lights[r][c] === undefined) { lights[r][c] = 0; }

            if (action === 'turn on') {
                lights[r][c] += 1;
            } else if (action === 'toggle') {
                lights[r][c] += 2;
            } else {
                lights[r][c] = Math.max(lights[r][c] - 1, 0);
            }
        }
    }
}

let count = 0;
for (let r = 0; r < ROWS; r++) {
    count += lights[r].filter(x => x !== undefined).reduce((x, y) => x + y, 0);
}

console.log(count);
