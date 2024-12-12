
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

    let possible = true;
    for (const cubeSet of cubeSets) {
        // console.log(`cubeSet: ${cubeSet}`);
        const cubes = cubeSet.split(',');

        for (const c of cubes) {
            // console.log(`c: ${c.trim()}`);
            const numCubes = parseInt(c.trim().split(' ')[0]);
            const color = c.trim().split(' ')[1];

            if (color === 'red' && numCubes > 12) { possible = false; }
            else if (color === 'green' && numCubes > 13) { possible = false; }
            else if (color === 'blue' && numCubes > 14) { possible = false; }
            // console.log(`possible: ${possible}`);
        }

        if (!possible) { break; }
    }

    if (possible) { sum += gameNum; }
}

console.log(sum);
