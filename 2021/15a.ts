// --- Day 15: Chiton ---
// You've almost reached the exit of the cave, but the walls are getting closer together.
// Your submarine can barely still fit, though; the main problem is that the walls of the
// cave are covered in chitons, and it would be best not to bump any of them.

// The cavern is large, but has a very low ceiling, restricting your motion to two dimensions.
// The shape of the cavern resembles a square; a quick scan of chiton density produces a map
// of risk level throughout the cave (your puzzle input). For example:

// 1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581

// You start in the top left position, your destination is the bottom right position,
// and you cannot move diagonally. The number at each position is its risk level; to
// determine the total risk of an entire path, add up the risk levels of each position
// you enter (that is, don't count the risk level of your starting position unless you
// enter it; leaving it adds no risk to your total).

// Your goal is to find a path with the lowest total risk. In this example, a path with
// the lowest total risk is highlighted here:

// 1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581

// The total risk of this path is 40 (the starting position is never entered, so its
// risk is not counted).

// What is the lowest total risk of any path from the top left to the bottom right?

import { readFileSync } from 'fs';
import { exit } from 'process';

class Node {
    constructor(val: number) { this.val = val; }

    val: number;
}

type Grid = Node[][];

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

const grid: Grid = new Array();
for (let r = 0; r < lines.length; r++) {
    if (lines[r].length === 0) { continue; }
    grid[r] = new Array();
    for (let c = 0; c < lines[0].length; c++) {
        grid[r][c] = new Node(parseInt(lines[r][c]));
    }
}

grid[0][0].val = 0;

walkGrid(grid);

let minRisk = grid[grid.length - 1][grid[0].length - 1].val;
console.log(minRisk);

function printGrid(grid: Node[][]) {
    for (let r = 0; r < grid.length; r++) {
        console.log(grid[r].map(x => x.val).join(' '))
    }
}

function walkGrid(grid: Node[][]) {
    for (let r = 1; r < grid.length; r++) {
        grid[r][0].val += grid[r-1][0].val;
    }

    for (let c = 1; c < grid[0].length; c++) {
        grid[0][c].val += grid[0][c-1].val;
    }

    for (let r = 1; r < grid.length; r++) {
        for (let c = 1; c < grid[0].length; c++) {
            grid[r][c].val += Math.min(grid[r-1][c].val, grid[r][c-1].val);
        }
    }

    // printGrid(grid);
}
