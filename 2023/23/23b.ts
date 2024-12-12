
import { readFileSync } from 'fs';
import { exit } from 'process';

import { DFSNode, Dfs } from '../../common/dfs';

const file = readFileSync('./23.test', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

const v8 = require('v8');
v8.setFlagsFromString('--stack-size=50000');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

// printMap(map);

let dfs = new Dfs();

const mapHeight = map.length;
const mapWidth = map[0].length;

for (let r = 0; r < mapHeight; r++) {
    for (let c = 0; c < mapWidth; c++) {
        if (map[r][c] === '#') { continue; }

        let neighbors: any[] = [];
        if (r > 0) {
            if (map[r-1][c] !== '#') {
                neighbors.push(`${r-1},${c}`);
            }
        }
        if (r < mapHeight - 1) {
            if (map[r+1][c] !== '#') {
                neighbors.push(`${r+1},${c}`);
            }
        }
        if (c > 0) {
            if (map[r][c-1] !== '#') {
                neighbors.push(`${r},${c-1}`);
            }
        }
        if (c < mapWidth - 1) {
            if (map[r][c+1] !== '#') {
                neighbors.push(`${r},${c+1}`);
            }
        }

        dfs.addNode(new DFSNode(`${r},${c}`, neighbors));
    }
}

const startRow = 0;
const startCol = map[startRow].findIndex(x => x === '.');
const endRow = mapHeight - 1;
const endCol = map[endRow].findIndex(x => x === '.');

// console.log([...dfs.graph.values()].map(x => x.toString()));
// dfs.DFS_recursive(`${startRow},${startCol}`, `${endRow},${endCol}`);
// console.log(dfs.maxPathLength - 1);

dfs.DFS_iterative(`${startRow},${startCol}`, `${endRow},${endCol}`);
// console.log(dfs.path.map(x => `[${x}] -> `).join(''));
// console.log(dfs.path.length - 1);
console.log(dfs.maxPathLength - 1);
// console.log(dfs.findNode(dfs.path.slice(-1)[0]));
// console.log(dfs.graph.get(dfs.path.slice(-1)[0]));

for (let i = 0; i < dfs.path.length; i++) {
    const [r, c] = dfs.path[i].split(',');
    map[r][c] = 'O';
}

printMap(map);


function printMap(m: string[][]) {
    for (let r = 0; r < m.length; r++) {
        console.log(m[r].join(''));
    }
    console.log();
}


// 5006 is too low
// 9380 is too high
