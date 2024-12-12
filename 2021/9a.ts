// These caves seem to be lava tubes. Parts are even still volcanically active; small hydrothermal vents
// release smoke into the caves that slowly settles like rain.

// If you can model how the smoke flows through the caves, you might be able to avoid it and be that much
// safer. The submarine generates a heightmap of the floor of the nearby caves for you (your puzzle input).

// Smoke flows to the lowest point of the area it's in. For example, consider the following heightmap:

// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678

// Each number corresponds to the height of a particular location, where 9 is the highest and 0 is the
// lowest a location can be.

// Your first goal is to find the low points - the locations that are lower than any of its adjacent
// locations. Most locations have four adjacent locations (up, down, left, and right); locations on the edge
// or corner of the map have three or two adjacent locations, respectively. (Diagonal locations do not count as adjacent.)

// In the above example, there are four low points, all highlighted: two are in the first row (a 1 and a 0),
// one is in the third row (a 5), and one is in the bottom row (also a 5). All other locations on the
// heightmap have some lower adjacent location, and so are not low points.

// The risk level of a low point is 1 plus its height. In the above example, the risk levels of the low
// points are 2, 1, 6, and 6. The sum of the risk levels of all low points in the heightmap is therefore 15.

// Find all of the low points on your heightmap. What is the sum of the risk levels of all low points on your heightmap?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const heightMap: number[][] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length <= 0) { continue; }
    heightMap[i] = new Array();
    heightMap[i].push(9);
    const row = lines[i].split('').map(x => parseInt(x));
    for (let j = 0; j < row.length; j++) {
        heightMap[i].push(row[j]);
    }
    heightMap[i].push(9);
}

const allNines: number[] = [];
for (let i = 0; i < heightMap[0].length; i++) {
    allNines.push(9);
}

heightMap.unshift(allNines);
heightMap.push(allNines);

function isLowPoint(heightMap: number[][], r: number, c: number): boolean {
    if (heightMap[r][c] === 9) { return false; }

    // console.log(`isLowPoint(${r}, ${c})`);
    if (r > 0) {
        // console.log(`  comparing ${heightMap[r][c]} against ${heightMap[r-1][c]}`);
        if (heightMap[r-1][c] <= heightMap[r][c]) { return false; }
    }
    if (r < heightMap.length - 2) {
        // console.log(`  comparing ${heightMap[r][c]} against ${heightMap[r+1][c]}`);
        if (heightMap[r+1][c] <= heightMap[r][c]) { return false; }
    }
    if (c > 0) {
        // console.log(`  comparing ${heightMap[r][c]} against ${heightMap[r][c-1]}`);
        if (heightMap[r][c-1] <= heightMap[r][c]) { return false; }
    }
    if (c < heightMap[0].length - 2) {
        // console.log(`  comparing ${heightMap[r][c]} against ${heightMap[r][c+1]}`);
        if (heightMap[r][c+1] <= heightMap[r][c]) { return false; }
    }

    return true;
}

let totalRiskLevel = 0;
for (let r = 0; r < heightMap.length; r++) {
    for (let c = 0; c < heightMap[0].length; c++) {
        if (isLowPoint(heightMap, r, c)) {
            // console.log(`${r}${c} is a low point`);
            totalRiskLevel += (heightMap[r][c] + 1);
        }
    }
}

console.log(totalRiskLevel);
