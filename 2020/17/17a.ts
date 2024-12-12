
import { readFileSync } from 'fs';
import { exit } from 'process';

const BIGNUM = Math.pow(2,32);
const SMALLNUM = -1 * Math.pow(2,32);

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let grid: Map<string, string> = new Map<string, string>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    for (let j = 0; j < lines[i].split('').length; j++) {
        grid.set(`${j},${i},0`, lines[i].split('')[j]);
    }
}

// printGrid();

const CYCLES = 6;

for (let i = 0; i < CYCLES; i++) {
    changeState();

    // console.log(`After ${i+1} cycles:`);
    // printGrid();
}

const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = getBounds();

let count = 0;
for (let z = minZ - 1; z <= maxZ + 1; z++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            if (isCubeActive(x, y, z)) { count++; }
        }
    }
}

console.log(count);


function getBounds(): [[number, number], [number, number], [number, number]] {
    let minX = BIGNUM, minY = BIGNUM, minZ = BIGNUM;
    let maxX = SMALLNUM, maxY = SMALLNUM, maxZ = SMALLNUM;

    for (const [k, v] of grid) {
        const [x, y, z] = k.split(',').map(x => parseInt(x));
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    }

    return [[minX, maxX], [minY, maxY], [minZ, maxZ]];
}

function changeState(): void {
    const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = getBounds();
    let newGrid: Map<string, string> = new Map<string, string>();

    for (let z = minZ - 1; z <= maxZ + 1; z++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let x = minX - 1; x <= maxX + 1; x++) {
                let newState = getCube(x, y, z);
                const neighbors = getNeighbors(x, y, z);

                if (newState === '#' && (neighbors !== 2 && neighbors !== 3)) {
                    newState = '.';
                } else if (newState === '.' && neighbors === 3) {
                    newState = '#';
                }

                newGrid.set(`${x},${y},${z}`, newState);
            }
        }
    }

    grid = newGrid;
}


function getCube(x: number, y: number, z: number): string {
    return grid.get(`${x},${y},${z}`) || '.';
}

function isCubeActive(x: number, y: number, z: number): boolean {
    return getCube(x, y, z) === '#';
}

function getNeighbors(x: number, y: number, z: number): number {
    let count = 0;

    if (isCubeActive(x - 1, y - 1, z - 1)) { count++; }
    if (isCubeActive(x - 1, y - 1, z)) { count++; }
    if (isCubeActive(x - 1, y - 1, z + 1)) { count++; }
    if (isCubeActive(x - 1, y, z - 1)) { count++; }
    if (isCubeActive(x - 1, y, z)) { count++; }
    if (isCubeActive(x - 1, y, z + 1)) { count++; }
    if (isCubeActive(x - 1, y + 1, z - 1)) { count++; }
    if (isCubeActive(x - 1, y + 1, z)) { count++; }
    if (isCubeActive(x - 1, y + 1, z + 1)) { count++; }

    if (isCubeActive(x, y - 1, z - 1)) { count++; }
    if (isCubeActive(x, y - 1, z)) { count++; }
    if (isCubeActive(x, y - 1, z + 1)) { count++; }
    if (isCubeActive(x, y, z - 1)) { count++; }
    // if (isCubeActive(x, y, z)) { count++; }
    if (isCubeActive(x, y, z + 1)) { count++; }
    if (isCubeActive(x, y + 1, z - 1)) { count++; }
    if (isCubeActive(x, y + 1, z)) { count++; }
    if (isCubeActive(x, y + 1, z + 1)) { count++; }

    if (isCubeActive(x + 1, y - 1, z - 1)) { count++; }
    if (isCubeActive(x + 1, y - 1, z)) { count++; }
    if (isCubeActive(x + 1, y - 1, z + 1)) { count++; }
    if (isCubeActive(x + 1, y, z - 1)) { count++; }
    if (isCubeActive(x + 1, y, z)) { count++; }
    if (isCubeActive(x + 1, y, z + 1)) { count++; }
    if (isCubeActive(x + 1, y + 1, z - 1)) { count++; }
    if (isCubeActive(x + 1, y + 1, z)) { count++; }
    if (isCubeActive(x + 1, y + 1, z + 1)) { count++; }

    return count;
}


function printGrid() {
    const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = getBounds();

    for (let z = minZ; z <= maxZ; z++) {
        console.log(`z=${z}`);

        for (let y = minY; y <= maxY; y++) {
            let row = '';
            for (let x = minX; x <= maxX; x++) {
                row += getCube(x, y, z);
            }

            console.log(row);
        }

        console.log();
    }
}
