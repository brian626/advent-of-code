
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./2.input', 'utf-8');

const lines = file.split('\n');

// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    let parts = lines[i].split(':');

    const gameNum = parseInt(parts[0].split(' ')[1]);

    const cubeSets = parts[1].trim().split(';').map(x => x.trim());

    // console.log(`Game ${gameNum}: ${cubeSets.join('|')}`);

    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;

    for (const cubeSet of cubeSets) {
        // console.log(`cubeSet: ${cubeSet}`);
        const cubes = cubeSet.split(',');

        for (const c of cubes) {
            // console.log(`c: ${c.trim()}`);
            const numCubes = parseInt(c.trim().split(' ')[0]);
            const color = c.trim().split(' ')[1];

            if (color === 'red') { minRed = Math.max(minRed, numCubes); }
            if (color === 'green') { minGreen = Math.max(minGreen, numCubes); }
            if (color === 'blue') { minBlue = Math.max(minBlue, numCubes); }
        }
    }

    let power = 1;
    if (minRed !== 0) { power *= minRed; }
    if (minGreen !== 0) { power *= minGreen; }
    if (minBlue !== 0) { power *= minBlue; }
    // console.log(minRed, minGreen, minBlue, power);
    sum += power;
}

console.log(sum);
