// --- Day 18: Boiling Boulders ---

// You and the elephants finally reach fresh air. You've emerged near the base of a large volcano that seems to be
// actively erupting! Fortunately, the lava seems to be flowing away from you and toward the ocean.

// Bits of lava are still being ejected toward you, so you're sheltering in the cavern exit a little longer. Outside
// the cave, you can see the lava landing in a pond and hear it loudly hissing as it solidifies.

// Depending on the specific compounds in the lava and speed at which it cools, it might be forming obsidian! The cooling
// rate should be based on the surface area of the lava droplets, so you take a quick scan of a droplet as it flies past you (your puzzle input).

// Because of how quickly the lava is moving, the scan isn't very good; its resolution is quite low and, as a result, it
// approximates the shape of the lava droplet with 1x1x1 cubes on a 3D grid, each given as its x,y,z position.

// To approximate the surface area, count the number of sides of each cube that are not immediately connected to another cube.
// So, if your scan were only two adjacent cubes like 1,1,1 and 2,1,1, each cube would have a single side covered and five sides
// exposed, a total surface area of 10 sides.

// What is the surface area of your scanned lava droplet?

import { readFileSync } from 'fs';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

const MAX_DIMENSION = 25;
const cubes: number[][][] = [];
for (let z = 0; z < MAX_DIMENSION; z++) {
    cubes[z] = [];
    for (let y = 0; y < MAX_DIMENSION; y++) {
        cubes[z][y] = [];
    }
}

for (let z = 0; z < MAX_DIMENSION; z++) {
    for (let y = 0; y < MAX_DIMENSION; y++) {
        for (let x = 0; x < MAX_DIMENSION; x++) {
            cubes[z][y][x] = 0;
        }
    }
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const coords = lines[i].split(',');
    const z = Number(coords[2]);
    const y = Number(coords[1]);
    const x = Number(coords[0]);
    console.log(`marking a cube at (${z},${y},${x})`);
    cubes[z][y][x] = 1;
}

// for (let z = MAX_DIMENSION - 1; z >= 0; z--) {
//     for (let y = MAX_DIMENSION - 1; y >= 0; y--) {
//         console.log(cubes[z][y].join(' '));
//     }
//     console.log(``);
// }

let exposedSides = 0;

for (let z = MAX_DIMENSION - 1; z >= 0; z--) {
    for (let y = MAX_DIMENSION - 1; y >= 0; y--) {
        for (let x = MAX_DIMENSION - 1; x >= 0; x--) {
            if (cubes[z][y][x] === 1) {
                if (x === 0 || cubes[z][y][x-1] === 0) { exposedSides++; }
                if (x === MAX_DIMENSION - 1 || cubes[z][y][x+1] === 0) { exposedSides++; }

                if (y === 0 || cubes[z][y-1][x] === 0) { exposedSides++; }
                if (y === MAX_DIMENSION - 1 || cubes[z][y+1][x] === 0) { exposedSides++; }

                if (z === 0 || cubes[z-1][y][x] === 0) { exposedSides++; }
                if (z === MAX_DIMENSION - 1 || cubes[z+1][y][x] === 0) { exposedSides++; }
            }
        }
    }
}

console.log(exposedSides);
