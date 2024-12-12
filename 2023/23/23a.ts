
import { readFileSync } from 'fs';
import { exit } from 'process';

import { DFSNode, Dfs } from '../../common/dfs';

const file = readFileSync('./23.test', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

// printMap(map);

let dfs = new Dfs();

const mapHeight = map.length;
const mapWidth = map[0].length;
const WEIGHT = 1;

// dfs.addNode(new DFSNode(`1`, ['2', '5', '9']));
// dfs.addNode(new DFSNode(`2`, ['1', '3']));
// dfs.addNode(new DFSNode(`3`, ['2', '4']));
// dfs.addNode(new DFSNode(`4`, ['3', '11']));
// dfs.addNode(new DFSNode(`5`, ['1', '6', '8']));
// dfs.addNode(new DFSNode(`6`, ['5', '7']));
// dfs.addNode(new DFSNode(`7`, ['6', '11']));
// dfs.addNode(new DFSNode(`8`, ['5', '11']));
// dfs.addNode(new DFSNode(`9`, ['1', '10']));
// dfs.addNode(new DFSNode(`10`, ['9', '11']));
// dfs.addNode(new DFSNode('11', []));

// console.log(dfs.graph);
// console.log(dfs.DFS('1', '11'));
// console.log(dfs.maxPathLength);

for (let r = 0; r < mapHeight; r++) {
    for (let c = 0; c < mapWidth; c++) {
        if (map[r][c] === '#') { continue; }

        let neighbors: any[] = [];
        if (r > 0) {
            if (map[r-1][c] === '.' || map[r-1][c] === '^') {
                neighbors.push(`${r-1},${c}`);
            }
        }
        if (r < mapHeight - 1) {
            if (map[r+1][c] === '.' || map[r+1][c] === 'v') {
                neighbors.push(`${r+1},${c}`);
            }
        }
        if (c > 0) {
            if (map[r][c-1] === '.' || map[r][c-1] === '<') {
                neighbors.push(`${r},${c-1}`);
            }
        }
        if (c < mapWidth - 1) {
            if (map[r][c+1] === '.' || map[r][c+1] === '>') {
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
dfs.DFS_recursive(`${startRow},${startCol}`, `${endRow},${endCol}`);
console.log(dfs.maxPathLength - 1);



function printMap(m: string[][]) {
    for (let r = 0; r < m.length; r++) {
        console.log(m[r].join(''));
    }
    console.log();
}
