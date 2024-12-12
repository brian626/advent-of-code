// --- Part Two ---
// Content with the amount of tree cover available, the Elves just need to know the best spot to build
// their tree house: they would like to be able to see a lot of trees.

// To measure the viewing distance from a given tree, look up, down, left, and right from that tree;
// stop if you reach an edge or at the first tree that is the same height or taller than the tree
// under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

// The Elves don't care about distant trees taller than those found by the rules above; the proposed tree
// house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

// In the example above, consider the middle 5 in the second row:

// 30373
// 25512
// 65332
// 33549
// 35390

// Looking up, its view is not blocked; it can see 1 tree (of height 3).
// Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
// Looking right, its view is not blocked; it can see 2 trees.
// Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).

// A tree's scenic score is found by multiplying together its viewing distance in each of the four directions.
// For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

// However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

// 30373
// 25512
// 65332
// 33549
// 35390

// Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
// Looking left, its view is not blocked; it can see 2 trees.
// Looking down, its view is also not blocked; it can see 1 tree.
// Looking right, its view is blocked at 2 trees (by a massive tree of height 9).

// This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

// Consider each tree on your map. What is the highest scenic score possible for any tree?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

const trees: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    trees.push(lines[i].split('').map(x => parseInt(x)));
}

console.log(trees);

let maximumScenicScore = 0;

for (let y = 1; y < trees.length - 1; y++) {
    for (let x = 1; x < trees[0].length - 1; x++) {
        maximumScenicScore = Math.max(maximumScenicScore, calculateScenicScore(x,y));
    }
}

console.log(maximumScenicScore);


function calculateScenicScore(x: number, y: number): number {
    let leftViewDistance = 0;
    let rightViewDistance = 0;
    let topViewDistance = 0;
    let bottomViewDistance = 0;

    const treeHeight = trees[y][x];
    console.log(`checking tree at (${y},${x}) with height ${trees[y][x]}`);

    // Check left
    for (let i = x - 1; i >= 0; i--) {
        leftViewDistance++;
        if (trees[y][i] >= treeHeight) {
            break;
        }
    }

    // Check right
    for (let i = x + 1; i < trees[0].length; i++) {
        rightViewDistance++;
        if (trees[y][i] >= treeHeight) {
            break;
        }
    }

    // Check top
    for (let i = y - 1; i >= 0; i--) {
        topViewDistance++;
        if (trees[i][x] >= treeHeight) {
            break;
        }
    }

    // Check bottom
    for (let i = y + 1; i < trees.length; i++) {
        bottomViewDistance++;
        if (trees[i][x] >= treeHeight) {
            break;
        }
    }

    console.log(`  returning ${leftViewDistance} * ${rightViewDistance} * ${topViewDistance} * ${bottomViewDistance}`);
    return leftViewDistance * rightViewDistance * topViewDistance * bottomViewDistance;
}






// let numberOfVisibleTrees = trees.length * 4 - 4;

// for (let y = 1; y < trees.length - 1; y++) {
//     for (let x = 1; x < trees[0].length - 1; x++) {
//         if (isTreeVisible(x,y)) {
//             numberOfVisibleTrees++;
//         }
//     }
// }

// console.log(numberOfVisibleTrees);


// function isTreeVisible(x: number, y: number): boolean {
//     const treeHeight = trees[y][x];
    // console.log(`checking tree at (${y},${x}) with height ${trees[y][x]}`);

//     let isVisibleFromLeft = true;
//     let isVisibleFromRight = true;
//     let isVisibleFromTop = true;
//     let isVisibleFromBottom = true;

//     // Check from left
//     for (let i = 0; i < x; i++) {
//         if (trees[y][i] >= treeHeight) {
//             // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the left`);
//             isVisibleFromLeft = false;
//             break;
//         }
//     }

//     if (isVisibleFromLeft) {
//         console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the left`);
//         return true;
//     }

//     // Check from right
//     for (let i = x + 1; i < trees[0].length; i++) {
//         if (trees[y][i] >= treeHeight) {
//             // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the right`);
//             isVisibleFromRight = false;
//             break;
//         }
//     }

//     if (isVisibleFromRight) {
//         console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the right`);
//         return true;
//      }

//     // Check from top
//     for (let i = 0; i < y; i++) {
//         if (trees[i][x] >= treeHeight) {
//             // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the top`);
//             isVisibleFromTop = false;
//             break;
//         }
//     }

//     if (isVisibleFromTop) {
//         console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the top`);
//         return true;
//     }

//     // Check from bottom
//     for (let i = y + 1; i < trees.length; i++) {
//         if (trees[i][x] >= treeHeight) {
//             // console.log(`tree at (${y},${x}) with height ${treeHeight} is not visible from the bottom`);
//             isVisibleFromBottom = false;
//             break;
//         }
//     }

//     if (isVisibleFromBottom) {
//         console.log(`  tree at (${y},${x}) with height ${treeHeight} is visible from the bottom`);
//         return true;
//     }

//     console.log(`  tree at (${y},${x}) with height ${treeHeight} is not visible`);

//     return false;
// }
