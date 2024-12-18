// Next, you need to find the largest basins so you know what areas are most important to avoid.

// A basin is all locations that eventually flow downward to a single low point. Therefore,
// every low point has a basin, although some basins are very small. Locations of height 9 do
// not count as being in any basin, and all other locations will always be part of exactly one basin.

// The size of a basin is the number of locations within the basin, including the low point.
// The example above has four basins.

// The top-left basin, size 3:

// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678

// The top-right basin, size 9:

// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678

// The middle basin, size 14:

// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678

// The bottom-right basin, size 9:

// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678

// Find the three largest basins and multiply their sizes together. In the above example, this is 9 * 14 * 9 = 1134.

// What do you get if you multiply together the sizes of the three largest basins?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const heightMap: number[][] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length <= 0) { continue; }
    heightMap[i] = new Array();
    const row = lines[i].split('').map(x => parseInt(x));
    for (let j = 0; j < row.length; j++) {
        heightMap[i].push(row[j]);
    }
}

const basins: number[] = [];

for (let r = 0; r < heightMap.length; r++) {
    for (let c = 0; c < heightMap[0].length; c++) {
        const basin = markNextBasin(heightMap, r, c);
        if (basin > 0) {
            basins.push(basin);
        }
    }
}

console.log(basins);
console.log(basins.sort((a,b) => b - a).slice(0, 3));
console.log(basins.sort((a,b) => b - a).slice(0, 3).reduce((a,b) => a * b, 1));

function printBasin(heightMap: number[][]) {
    for (let i = 0; i < heightMap.length; i++) {
        console.log(heightMap[i].join(' '));
    }
}

function extendBasin(heightMap: number[][], r: number, c: number) {
    if (heightMap[r][c] === 9) { return; }

    // console.log(`extendBasin(${r}, ${c})`);
    heightMap[r][c] = -1;

    if (r > 0) {
        if (heightMap[r-1][c] != -1) {
            extendBasin(heightMap, r - 1, c);
        }
    }
    if (r < heightMap.length - 1) {
        if (heightMap[r+1][c] != -1) {
            extendBasin(heightMap, r + 1, c);
        }
    }
    if (c > 0) {
        if (heightMap[r][c-1] != -1) {
            extendBasin(heightMap, r, c - 1);
        }
    }
    if (c < heightMap[0].length - 1) {
        if (heightMap[r][c+1] != -1) {
            extendBasin(heightMap, r, c + 1);
        }
    }
}

function markNextBasin(heightMap: number[][], r: number, c: number): number {
    if (heightMap[r][c] === 9) { return 0; }

    // console.log(`before marking`);
    // printBasin(heightMap);

    extendBasin(heightMap, r, c);

    // console.log(`after marking`);
    // printBasin(heightMap);

    let basinSize = 0;
    for (let i = 0; i < heightMap.length; i++) {
        for (let j = 0; j < heightMap[0].length; j++) {
            if (heightMap[i][j] === -1) {
                basinSize += 1;
                heightMap[i][j] = 9;
            }
        }
    }

    // console.log(`returning basin size ${basinSize}`);
    return basinSize;
}
