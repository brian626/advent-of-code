// --- Part Two ---

// Something seems off about your calculation. The cooling rate depends on exterior surface area, but your calculation
// also included the surface area of air pockets trapped in the lava droplet.

// Instead, consider only cube sides that could be reached by the water and steam as the lava droplet tumbles into the
// pond. The steam will expand to reach as much as possible, completely displacing any air on the outside of the lava
// droplet but never expanding diagonally.

// In the larger example above, exactly one cube of air is trapped within the lava droplet (at 2,2,5), so the exterior
// surface area of the lava droplet is 58.

// What is the exterior surface area of your scanned lava droplet?

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
    // console.log(`marking a cube at (${z},${y},${x})`);
    cubes[z][y][x] = 1;
}

// for (let z = MAX_DIMENSION - 1; z >= 0; z--) {
//     for (let y = MAX_DIMENSION - 1; y >= 0; y--) {
//         console.log(cubes[z][y].join(' '));
//     }
//     console.log(``);
// }


// Add a layer of air around the cube and mark it with 2's. Then go through all the internal air and
// mark as 2's where the air can reach. Then only count sides that are exposed to 2's.

let newCubes: number[][][] = [];
for (let z = 0; z < MAX_DIMENSION + 2; z++) {
    newCubes[z] = [];
    for (let y = 0; y < MAX_DIMENSION + 2; y++) {
        newCubes[z][y] = [];
    }
}

for (let z = 0; z < MAX_DIMENSION + 2; z++) {
    for (let y = 0; y < MAX_DIMENSION + 2; y++) {
        for (let x = 0; x < MAX_DIMENSION + 2; x++) {
            newCubes[z][y][x] = 2;
        }
    }
}

for (let z = 1; z < MAX_DIMENSION + 1; z++) {
    for (let y = 1; y < MAX_DIMENSION + 1; y++) {
        for (let x = 1; x < MAX_DIMENSION + 1; x++) {
            newCubes[z][y][x] = cubes[z-1][y-1][x-1];
        }
    }
}

for (let z = 1; z < MAX_DIMENSION + 1; z++) {
    for (let y = 1; y < MAX_DIMENSION + 1; y++) {
        for (let x = 1; x < MAX_DIMENSION + 1; x++) {
            if (newCubes[z][y][x] === 0) {
                if (newCubes[z-1][y][x] === 2 || newCubes[z+1][y][x] === 2 ||
                    newCubes[z][y-1][x] === 2 || newCubes[z][y+1][x] === 2 ||
                    newCubes[z][y][x-1] === 2 || newCubes[z][y][x+1] === 2) {
                        newCubes[z][y][x] = 2;
                    }
            }
        }
    }
}

for (let z = MAX_DIMENSION + 1; z >= 0; z--) {
    for (let y = MAX_DIMENSION + 1; y >= 0; y--) {
        console.log(newCubes[z][y].join(' '));
    }
    console.log(``);
}



let exposedSides = 0;

for (let z = MAX_DIMENSION - 1; z >= 0; z--) {
    for (let y = MAX_DIMENSION - 1; y >= 0; y--) {
        for (let x = MAX_DIMENSION - 1; x >= 0; x--) {
            if (newCubes[z][y][x] === 1) {
                if (x === 0 || newCubes[z][y][x-1] === 2) { exposedSides++; }
                if (x === MAX_DIMENSION - 1 || newCubes[z][y][x+1] === 2) { exposedSides++; }

                if (y === 0 || newCubes[z][y-1][x] === 2) { exposedSides++; }
                if (y === MAX_DIMENSION - 1 || newCubes[z][y+1][x] === 2) { exposedSides++; }

                if (z === 0 || newCubes[z-1][y][x] === 2) { exposedSides++; }
                if (z === MAX_DIMENSION - 1 || newCubes[z+1][y][x] === 2) { exposedSides++; }
            }
        }
    }
}

// for (let z = MAX_DIMENSION - 1; z >= 0; z--) {
//     for (let y = MAX_DIMENSION - 1; y >= 0; y--) {
//         for (let x = MAX_DIMENSION - 1; x >= 0; x--) {
//             if (cubes[z][y][x] === 1) {
//                 if (x === 0 || cubes[z][y][x-1] === 0) { exposedSides++; }
//                 if (x === MAX_DIMENSION - 1 || cubes[z][y][x+1] === 0) { exposedSides++; }

//                 if (y === 0 || cubes[z][y-1][x] === 0) { exposedSides++; }
//                 if (y === MAX_DIMENSION - 1 || cubes[z][y+1][x] === 0) { exposedSides++; }

//                 if (z === 0 || cubes[z-1][y][x] === 0) { exposedSides++; }
//                 if (z === MAX_DIMENSION - 1 || cubes[z+1][y][x] === 0) { exposedSides++; }
//             }
//         }
//     }
// }


console.log(exposedSides);

// 2166 is too low
