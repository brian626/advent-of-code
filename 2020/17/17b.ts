
import { readFileSync } from 'fs';
import { exit } from 'process';

const BIGNUM = Math.pow(2, 32);
const SMALLNUM = -1 * Math.pow(2, 32);

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let grid: Map<string, string> = new Map<string, string>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    for (let j = 0; j < lines[i].split('').length; j++) {
        grid.set(`${j},${i},0,0`, lines[i].split('')[j]);
    }
}

// console.log(`Before any cycles:`);
// console.log();
// printGrid();

const CYCLES = 6;

for (let i = 0; i < CYCLES; i++) {
    changeState();

    // console.log(`After ${i + 1} cycles:`);
    // console.log();
    // printGrid();
}

const [[minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]] = getBounds();

let count = 0;
for (let w = minW - 1; w <= maxW + 1; w++) {
    for (let z = minZ - 1; z <= maxZ + 1; z++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let x = minX - 1; x <= maxX + 1; x++) {
                if (isCubeActive(x, y, z, w)) { count++; }
            }
        }
    }
}

console.log(count);


function getBounds(): [[number, number], [number, number], [number, number], [number, number]] {
    let minX = BIGNUM, minY = BIGNUM, minZ = BIGNUM, minW = BIGNUM;
    let maxX = SMALLNUM, maxY = SMALLNUM, maxZ = SMALLNUM, maxW = SMALLNUM;

    for (const [k, _v] of grid) {
        // console.log(`k: `, k);
        const [x, y, z, w] = k.split(',').map(x => parseInt(x));
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        minW = Math.min(minW, w);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
        maxW = Math.max(maxW, w);
    }

    // console.log(`returning `, [minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]);
    return [[minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]];
}

function changeState(): void {
    const [[minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]] = getBounds();
    let newGrid: Map<string, string> = new Map<string, string>();

    for (let w = minW - 1; w <= maxW + 1; w++) {
        for (let z = minZ - 1; z <= maxZ + 1; z++) {
            for (let y = minY - 1; y <= maxY + 1; y++) {
                for (let x = minX - 1; x <= maxX + 1; x++) {
                    let newState = getCube(x, y, z, w);
                    const neighbors = getNeighbors(x, y, z, w);

                    if (newState === '#' && (neighbors !== 2 && neighbors !== 3)) {
                        newState = '.';
                    } else if (newState === '.' && neighbors === 3) {
                        newState = '#';
                    }

                    newGrid.set(`${x},${y},${z},${w}`, newState);
                }
            }
        }
    }

    grid = newGrid;
}


function getCube(x: number, y: number, z: number, w: number): string {
    return grid.get(`${x},${y},${z},${w}`) || '.';
}

function isCubeActive(x: number, y: number, z: number, w: number): boolean {
    return getCube(x, y, z, w) === '#';
}

function getNeighbors(x: number, y: number, z: number, w: number): number {
    // console.log(`getting neighbors of x=${x},y=${y},z=${z},w=${w}`);

    let count = 0;

    for (let a = w - 1; a <= w + 1; a++) {
        for (let b = z - 1; b <= z + 1; b++) {
            for (let c = y - 1; c <= y + 1; c++) {
                for (let d = x - 1; d <= x + 1; d++) {
                    if (a === w && b === z && c === y && d === x) {
                        // console.log(`  skipping self`);
                        continue;
                    }

                    // console.log(`  checking x=${d},y=${c},z=${b},w=${a}`);
                    if (isCubeActive(d, c, b, a)) { count++; }
                }
            }
        }
    }

    return count;
}


function printGrid() {
    const [[minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]] = getBounds();
    // console.log([minX, maxX], [minY, maxY], [minZ, maxZ], [minW, maxW]);

    for (let w = minW; w <= maxW; w++) {
        for (let z = minZ; z <= maxZ; z++) {
            console.log(`z=${z}, w=${w}`);

            for (let y = minY; y <= maxY; y++) {
                let row = '';
                for (let x = minX; x <= maxX; x++) {
                    row += getCube(x, y, z, w);
                }

                console.log(row);
            }

            console.log();
        }
    }
}
