// --- Day 8: Treetop Tree House ---

// The expedition comes across a peculiar patch of tall trees all planted carefully in a grid.
// The Elves explain that a previous expedition planted these trees as a reforestation effort.
// Now, they're curious if this would be a good location for a tree house.

// First, determine whether there is enough tree cover here to keep a tree house hidden.
// To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

// The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

// 30373
// 25512
// 65332
// 33549
// 35390

// Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

// A tree is visible if all of the other trees between it and an edge of the grid are shorter than it.
// Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

// All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees
// to block the view. In this example, that only leaves the interior nine trees to consider:

// The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)

// The top-middle 5 is visible from the top and right.

// The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.

// The left-middle 5 is visible, but only from the right.

// The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.

// The right-middle 3 is visible from the right.

// In the bottom row, the middle 5 is visible, but the 3 and 4 are not.

// With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

// Consider your map; how many trees are visible from outside the grid?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

const trees: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    trees.push(lines[i].split('').map(x => parseInt(x)));
}

// console.log(trees);

let numberOfVisibleTrees = trees.length * 4 - 4;

for (let y = 1; y < trees.length - 1; y++) {
    for (let x = 1; x < trees[0].length - 1; x++) {
        if (isTreeVisible(x,y)) {
            numberOfVisibleTrees++;
        }
    }
}

console.log(numberOfVisibleTrees);


function isTreeVisible(x: number, y: number): boolean {
    const treeHeight = trees[y][x];
    console.log(`checking tree at (${y},${x}) with height ${trees[y][x]}`);

    let isVisibleFromLeft = true;
    let isVisibleFromRight = true;
    let isVisibleFromTop = true;
    let isVisibleFromBottom = true;

    // Check from left
    for (let i = 0; i < x; i++) {
        if (trees[y][i] >= treeHeight) {
            // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the left`);
            isVisibleFromLeft = false;
            break;
        }
    }

    if (isVisibleFromLeft) {
        console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the left`);
        return true;
    }

    // Check from right
    for (let i = x + 1; i < trees[0].length; i++) {
        if (trees[y][i] >= treeHeight) {
            // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the right`);
            isVisibleFromRight = false;
            break;
        }
    }

    if (isVisibleFromRight) {
        console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the right`);
        return true;
     }

    // Check from top
    for (let i = 0; i < y; i++) {
        if (trees[i][x] >= treeHeight) {
            // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the top`);
            isVisibleFromTop = false;
            break;
        }
    }

    if (isVisibleFromTop) {
        console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the top`);
        return true;
    }

    // Check from bottom
    for (let i = y + 1; i < trees.length; i++) {
        if (trees[i][x] >= treeHeight) {
            // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the bottom`);
            isVisibleFromBottom = false;
            break;
        }
    }

    if (isVisibleFromBottom) {
        console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the bottom`);
        return true;
    }

    console.log(`  tree at (${y},${x}) with height ${treeHeight} is not visible`);

    return false;
}
