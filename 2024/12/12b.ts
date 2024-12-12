
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

// printGrid();

class Region {
    type: string;
    area: number;
    perimeter: number;
    sides: number;

    constructor(t: string) {
        this.type = t;
        this.area = 0;
        this.perimeter = 0;
        this.sides = 0;
    }
}

const regions: Region[] = [];

// Do this in multiple phases:
// 1) Scan the grid for non-discovered tiles
// 2) When a new tile is found, determine all the tiles that are connected to it.
// 3) For all of the connected tiles, calculate their area and perimeter and create a Region

let regionTiles: Set<string> = new Set<string>();

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === '.') { continue; }

        captureRegionTiles(r, c, grid[r][c]);
        // console.log(regionTiles);

        // calc area and perimeter and create a region
        regions.push(createRegion(regionTiles, grid[r][c]));

        // mark region tiles as visited
        for (const t of regionTiles) {
            const [r, c] = t.split(',').map(x => parseInt(x));
            grid[r][c] = '.';
        }

        regionTiles.clear();
    }
}

console.log(regions);
let price = 0;
for (const r of regions) {
    price += (r.sides * r.area);
}

console.log(price);


function createRegion(regionTiles: Set<string>, type: string): Region {
    let perimeter = 0;
    let area = 0;

    // rowStart,rowEnd,colStart,colEnd,side
    // where side is 0 for top, 1 for right, 2 for bottom, 3 for left
    const fenceSet: Set<string> = new Set<string>();

    for (const t of regionTiles) {
        area += 1;

        const [r, c] = t.split(',').map(x => parseInt(x));
        if (!canMoveUp(r, c, type)) {
            fenceSet.add(`${r},${r},${c},${c},0`);
        }
        if (!canMoveDown(r, c, type)) {
            fenceSet.add(`${r},${r},${c},${c},2`);
        }
        if (!canMoveLeft(r, c, type)) {
            fenceSet.add(`${r},${r},${c},${c},3`);
        }
        if (!canMoveRight(r, c, type)) {
            fenceSet.add(`${r},${r},${c},${c},1`);
        }
    }

    const fences = Array.from(fenceSet);
    console.log(`starting with ${fences.length} fences`);
    const mergedFences: string[] = [];
    while (fences.length > 0) {
        const fence = fences.shift();
        let [fenceRowStart, fenceRowEnd, fenceColStart, fenceColEnd, fenceSide] = fence.split(',').map(x => parseInt(x));

        let mergedFence = true;
        while (mergedFence) {
            mergedFence = false;

            for (let i = fences.length - 1; i >= 0; i--) {
                const [rStart, rEnd, cStart, cEnd, s] = fences[i].split(',').map(x => parseInt(x));
                console.log(`  should fence [${fences[i]}] be merged with [${fence}]?`);

                if (fenceSide === s) {
                    switch (fenceSide) {
                        case 0:
                        case 2:
                            if (fenceRowStart === rStart) {
                                if (cStart === fenceColStart - 1) {
                                    mergedFence = true;
                                    console.log(`    merging horiontally, case 1`);
                                    fenceColStart--;
                                    fences[i] = '-1,-1,-1,-1,-1';
                                } else if (cEnd === fenceColEnd + 1) {
                                    mergedFence = true;
                                    console.log(`    merging horiontally, case 2`);
                                    fenceColEnd++;
                                    fences[i] = '-1,-1,-1,-1,-1';
                                }
                            }
                            break;

                        case 1:
                        case 3:
                            if (fenceColStart === cStart) {
                                if (rStart === fenceRowStart - 1) {
                                    mergedFence = true;
                                    console.log(`    merging vertically, case 1`);
                                    fenceRowStart--;
                                    fences[i] = '-1,-1,-1,-1,-1';
                                } else if (rEnd === fenceRowEnd + 1) {
                                    mergedFence = true;
                                    console.log(`    merging vertically, case 2`);
                                    fenceRowEnd++;
                                    fences[i] = '-1,-1,-1,-1,-1';
                                }
                            }
                            break;
                    }
                }
            }
        }

        if (fenceSide != -1) {
            mergedFences.push(`${fenceRowStart},${fenceRowEnd},${fenceColStart},${fenceColEnd},${fenceSide}`);
        }
    }

    console.log(`there are now ${mergedFences.length} fences after merging`);
    console.log(mergedFences);
    console.log();

    const region = new Region(type);
    region.perimeter = perimeter;
    region.area = area;
    region.sides = mergedFences.length;

    return region;
}


function canMoveUp(r: number, c: number, t: string): boolean {
    return r > 0 && grid[r - 1][c] === t;
}
function canMoveDown(r: number, c: number, t: string): boolean {
    return r < grid.length - 1 && grid[r + 1][c] === t;
}
function canMoveLeft(r: number, c: number, t: string): boolean {
    return c > 0 && grid[r][c - 1] === t;
}
function canMoveRight(r: number, c: number, t: string): boolean {
    return c < grid[0].length - 1 && grid[r][c + 1] === t;
}

function captureRegionTiles(row: number, col: number, type: string) {
    if (grid[row][col] === type) {
        regionTiles.add(`${row},${col}`);
    }

    if (row > 0 && !regionTiles.has(`${row - 1},${col}`) && grid[row - 1][col] === type) {
        captureRegionTiles(row - 1, col, type);
    }

    if (row < grid.length - 1 && !regionTiles.has(`${row + 1},${col}`) && grid[row + 1][col] === type) {
        captureRegionTiles(row + 1, col, type);
    }

    if (col > 0 && !regionTiles.has(`${row},${col - 1}`) && grid[row][col - 1] === type) {
        captureRegionTiles(row, col - 1, type);
    }

    if (col < grid[0].length - 1 && !regionTiles.has(`${row},${col + 1}`) && grid[row][col + 1] === type) {
        captureRegionTiles(row, col + 1, type);
    }
}

function printGrid() {
    for (let r = 0; r < grid.length; r++) {
        console.log(grid[r].join(''));
    }
    console.log();
}
