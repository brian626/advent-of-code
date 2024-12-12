
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

const platform: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    platform[i] = lines[i].split('');
}

printPlatform(platform);

for (let r = 1; r < platform.length; r++) {
    for (let c = 0; c < platform[0].length; c++) {
        if (platform[r][c] === 'O') {
            moveRockNorth(platform, r, c);
        }
    }
}

printPlatform(platform);


function moveRockNorth(p: string[][], r: number, c: number) {
    let sourceRow = r;
    let destinationRow = r-1;

    while (destinationRow >= 0 && p[destinationRow][c] === '.') {
        p[destinationRow][c] = p[sourceRow][c];
        p[sourceRow][c] = '.';
        sourceRow -= 1;
        destinationRow -= 1;
    }
}

let load = 0;

for (let r = 0; r < platform.length; r++) {
    for (let c = 0; c < platform[0].length; c++) {
        if (platform[r][c] === 'O') {
            load += (platform.length - r);
        }
    }
}

console.log(load);

function printPlatform(p: string[][]) {
    for (let r = 0; r < p.length; r++) {
        console.log(p[r].join(''));
    }

    console.log();
}
