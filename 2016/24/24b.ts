
import { readFileSync } from 'fs';
import { exit } from 'process';
import { dijkstra } from '../../common/dijkstra';
import { permutations } from '../../common/permutations';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

const pointCoordinates: Map<string, string> = new Map<string, string>();

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c].charCodeAt(0) >= '0'.charCodeAt(0) && grid[r][c].charCodeAt(0) <= '9'.charCodeAt(0)) {
            pointCoordinates.set(grid[r][c], `${r},${c}`);
        }
    }
}

const points: number[] = [];
for (const [k, _v] of pointCoordinates) {
    points.push(parseInt(k));
}

// console.log(points);

const graph = {};

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === '#') { continue; }

        const neighbors = {};
        if (r > 0 && grid[r-1][c] !== '#') { neighbors[`${r-1},${c}`] = 1; }
        if (r < grid.length && grid[r+1][c] !== '#') { neighbors[`${r+1},${c}`] = 1; }
        if (c > 0 && grid[r][c-1] !== '#') { neighbors[`${r},${c-1}`] = 1; }
        if (c < grid[0].length && grid[r][c+1] !== '#') { neighbors[`${r},${c+1}`] = 1; }
        graph[`${r},${c}`] = neighbors;
    }
}

// console.log(graph);

const distances: Map<string, {}> = new Map<string, {}>();
for (const [k, v] of pointCoordinates) {
    distances.set(v, dijkstra(graph, v));
}

// console.log(distances);

const shortestDistances: number[][] = [];

for (const [k, v] of pointCoordinates) {
    for (const [k2, v2] of pointCoordinates) {
        if (k === k2) { continue; }

        // console.log(`Distance from point ${k} to point ${k2}: ${distances.get(v)[v2]}`);
        const p1 = parseInt(k);
        const p2 = parseInt(k2);
        if (!shortestDistances[p1]) { shortestDistances[p1] = []; }
        shortestDistances[p1][p2] = distances.get(v)[v2];
    }
}


const pointsToVisit = new Set(points.filter(x => x !== 0));
const perms = permutations(pointsToVisit);
let fewestSteps = Infinity;
for (const p of perms) {
    const perm = [0].concat(p).concat([0]);
    let pathLength = 0;
    for (let i = 0; i < perm.length - 1; i++) {
        pathLength += shortestDistances[perm[i]][perm[i+1]];
    }

    fewestSteps = Math.min(fewestSteps, pathLength);
}

console.log(fewestSteps);
