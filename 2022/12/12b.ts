// --- Part Two ---

// As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic,
// though; perhaps you can find a better starting point.

// To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E.
// However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path
// from any square at elevation a to the square marked E.

// What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?

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
            // this.distance = 0;
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


let minimumSteps = Math.pow(2,31);

const startingNodes: Node[] = [];
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x].elevation === 1) {
            startingNodes.push(grid[y][x]);
        }
    }
}

console.log(`considering ${startingNodes.length} starts`);

for (let i = 0; i < startingNodes.length; i++) {
    console.log(` start ${i}`);
    // Reset grid
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            grid[y][x].distance = Math.pow(2,31);
            grid[y][x].visited = false;
        }
    }

    const startingNode = startingNodes[i];
    startingNode.distance = 0;

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

    minimumSteps = Math.min(minimumSteps, grid[endY][endX].distance);
}

// console.log(grid[endY][endX].distance);
console.log(minimumSteps);
