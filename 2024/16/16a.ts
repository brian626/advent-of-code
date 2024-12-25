
import { readFileSync } from 'fs';
import { exit } from 'process';
const Graph = require("graphlib").Graph;
const ksp = require('k-shortest-path');

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

let rStart = 0, cStart = 0, rEnd = 0, cEnd = 0;

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === 'S') {
            [rStart, cStart] = [r, c];
        } else if (map[r][c] === 'E') {
            [rEnd, cEnd] = [r, c];
        }
    }
}

const g = new Graph();

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '#') { continue; }

        if (r > 0 && map[r - 1][c] !== '#') { g.setEdge(`${r},${c}`, `${r - 1},${c}`, 1); }
        if (r < map.length - 1 && map[r + 1][c] !== '#') { g.setEdge(`${r},${c}`, `${r + 1},${c}`, 1); }
        if (c > 0 && map[r][c - 1] !== '#') { g.setEdge(`${r},${c}`, `${r},${c - 1}`, 1); }
        if (c < map[0].length - 1 && map[r][c + 1] !== '#') { g.setEdge(`${r},${c}`, `${r},${c + 1}`, 1); }
    }
}

// console.log(g.nodes());
// console.log(g.edges());

// console.log(g.hasNode(`${rStart},${cStart}`));
// console.log(g.outEdges(`${rStart},${cStart}`));
// console.log(g.hasNode(`${rEnd},${cEnd}`));

const paths = ksp.ksp(g, `${rStart},${cStart}`, `${rEnd},${cEnd}`, 2);

// console.log(paths);

let minScore = Infinity;
for (const path of paths) {
    const score = calculateScore(path)
    console.log(score);
    minScore = Math.min(minScore, score);
}

console.log();
console.log(minScore);


function calculateScore(path): number {
    let facing = 1;
    let cost = 1;
    let [rCurrent, cCurrent] = path.edges[0].fromNode.split(',').map(x => parseInt(x) );

    for (let i = 1; i < path.edges.length; i++) {
        const node = path.edges[i];

        if (!node) { continue; }

        let [rNode, cNode] = node.fromNode.split(',').map(x => parseInt(x));
        if (rNode === rStart && cNode === cStart) { continue; }

        // console.log(`current node is [${rCurrent},${cCurrent}] and facing is ${facing}. heading to [${rNode},${cNode}]`);
        switch (facing) {
            case 0:
                if (rNode === rCurrent - 1 && cNode === cCurrent) { cost += 1; }
                else if (rNode === rCurrent && cNode === cCurrent - 1) { cost += 1001; facing = 3; }
                else if (rNode === rCurrent && cNode === cCurrent + 1) { cost += 1001; facing = 1; }
                break;

            case 1:
                if (rNode === rCurrent && cNode === cCurrent + 1) { cost += 1; }
                else if (rNode === rCurrent - 1 && cNode === cCurrent) { cost += 1001; facing = 0; }
                else if (rNode === rCurrent + 1 && cNode === cCurrent) { cost += 1001; facing = 2; }
                break;

            case 2:
                if (rNode === rCurrent + 1 && cNode === cCurrent) { cost += 1; }
                else if (rNode === rCurrent && cNode === cCurrent - 1) { cost += 1001; facing = 3; }
                else if (rNode === rCurrent && cNode === cCurrent + 1) { cost += 1001; facing = 1; }
                break;

            case 3:
                if (rNode === rCurrent && cNode === cCurrent - 1) { cost += 1; }
                else if (rNode === rCurrent - 1 && cNode === cCurrent) { cost += 1001; facing = 0; }
                else if (rNode === rCurrent + 1 && cNode === cCurrent) { cost += 1001; facing = 2; }
                break;
        }

        rCurrent = rNode;
        cCurrent = cNode;
    }

    return cost;
}

// 78392 is too high
