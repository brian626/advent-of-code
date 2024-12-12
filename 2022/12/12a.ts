// --- Day 12: Hill Climbing Algorithm ---

// You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

// You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above
// broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest
// elevation, b is the next-lowest, and so on up to the highest elevation, z.

// Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E).
// Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

// You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move
// exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination
// square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could
// step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower
// than the elevation of your current square.)

// What is the fewest steps required to move from your current position to the location that should get the best signal?


import { readFileSync } from 'fs';

class Node {
    elevation: number;
    neighbors: Node[];
    isStart: boolean;
    isEnd: boolean;
    visited: boolean;
    distance: number;

    constructor(e: string) {
        this.isStart = this.isEnd = this.visited = false;
        this.distance = Math.pow(2,31);
        this.neighbors = [];

        if (e === 'S') {
            this.elevation = 1;
            this.isStart = true;
            this.distance = 0;
        } else if (e === 'E') {
            this.elevation = 26;
            this.isEnd = true;
        } else {
            this.elevation = e.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        }
    }
}


const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

const grid: Node[][] = [];

let endX = -1;
let endY = -1;

for (let y = 0; y < lines.length; y++) {
    if (lines[y].length === 0) { continue; }

    grid[y] = [];
    for (let x = 0; x < lines[0].length; x++) {
        grid[y].push(new Node(lines[y][x]));
    }
}


for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if (y > 0 && (grid[y-1][x].elevation <= grid[y][x].elevation + 1)) {
            grid[y][x].neighbors.push(grid[y-1][x]);
        }

        if (y < grid.length - 1 && (grid[y+1][x].elevation <= grid[y][x].elevation + 1)) {
            grid[y][x].neighbors.push(grid[y+1][x]);
        }

        if (x > 0 && (grid[y][x-1].elevation <= grid[y][x].elevation + 1)) {
            grid[y][x].neighbors.push(grid[y][x-1]);
        }

        if (x < grid[0].length - 1 && (grid[y][x+1].elevation <= grid[y][x].elevation + 1)) {
            grid[y][x].neighbors.push(grid[y][x+1]);
        }

        if (grid[y][x].isEnd) {
            endX = x;
            endY = y;
        }
    }
}

// for (let y = 0; y < grid.length; y++) {
//     console.log(grid[y].map(x => x.elevation).join(' '));
// }


let currentNode: Node = null; ;
let unvisitedNodes: Node[] = [];
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        unvisitedNodes.push(grid[y][x]);
    }
}
unvisitedNodes = unvisitedNodes.sort((x,y) => x.distance - y.distance);

while (unvisitedNodes.length > 0) {
    currentNode = unvisitedNodes.shift();
    currentNode.visited = true;

    let unvisitedNeighbors: Node[] = currentNode.neighbors.filter(x => !x.visited);

    for (let i = 0; i < unvisitedNeighbors.length; i++) {
        unvisitedNeighbors[i].distance = Math.min(unvisitedNeighbors[i].distance, currentNode.distance + 1);
    }

    unvisitedNodes = unvisitedNodes.sort((x,y) => x.distance - y.distance);
}

// for (let y = 0; y < grid.length; y++) {
//     console.log(grid[y].map(x => x.distance).join(' '));
// }

console.log(grid[endY][endX].distance);

// 580 is too high
// 442 is wrong
