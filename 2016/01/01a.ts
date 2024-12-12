
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./01.input', 'utf-8');

const lines = file.split('\n');

let xPos = 0, yPos = 0;
let facing = 0; // 0: north, 1: east, 2: south, 3: west

let path: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    path = lines[i].split(', ');
}

for (const p of path) {
    // const [turn, distanceStr] = p.split('');
    const turn = p.slice(0, 1);
    const distanceStr = p.slice(1);

    switch (turn) {
        case 'R':
            facing += 1;
            if (facing === 4) { facing = 0; }
            break;

        case 'L':
            facing -= 1;
            if (facing === -1) { facing = 3; }
            break;
    }

    for (let i = 0; i < parseInt(distanceStr); i++) {
        switch (facing) {
            case 0: yPos += 1; break;
            case 1: xPos += 1; break;
            case 2: yPos -= 1; break;
            case 3: xPos -= 1; break;
        }
    }
}

console.log(xPos, yPos);

console.log(Math.abs(xPos) + Math.abs(yPos));
