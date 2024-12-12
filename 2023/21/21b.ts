
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

const mapHeight = map.length;
const mapWidth = map[0].length;

let startRow, startCol;

for (let r = 0; r < mapHeight; r++) {
    let foundIt = false;

    for (let c = 0; c < mapWidth; c++) {
        if (map[r][c] === 'S') {
            foundIt = true;
            startRow = r;
            startCol = c;
            break;
        }
    }

    if (foundIt) { break; }
}

// printMap(map);
// console.log(`[${startRow}, ${startCol}]`);

let reachablePlots: number[][] = [[startRow, startCol]];

const STEPS = 64;

for (let i = 0; i < STEPS; i++) {
    const nextReachablePlots: number[][] = [];

    while (reachablePlots.length > 0) {
        const [plotRow, plotCol] = reachablePlots.shift();
        if (plotRow > 0 && map[plotRow - 1][plotCol] !== '#') {
            nextReachablePlots.push([plotRow - 1, plotCol]);
        }
        if (plotRow < mapHeight - 1 && map[plotRow + 1][plotCol] !== '#') {
            nextReachablePlots.push([plotRow + 1, plotCol]);
        }
        if (plotCol > 0 && map[plotRow][plotCol - 1] !== '#') {
            nextReachablePlots.push([plotRow, plotCol - 1]);
        }
        if (plotCol < mapWidth - 1 && map[plotRow][plotCol + 1] !== '#') {
            nextReachablePlots.push([plotRow, plotCol + 1]);
        }
    }

    // reachablePlots = [...new Set(nextReachablePlots.map(x => `${x[0]},${x[1]}`))];
    // let x = nextReachablePlots.map(x => `${x[0]},${x[1]}`);
    // let y = new Set<string>(nextReachablePlots.map(x => `${x[0]},${x[1]}`));
    // let z = [...new Set<string>(nextReachablePlots.map(x => `${x[0]},${x[1]}`))];
    reachablePlots = [...new Set<string>(nextReachablePlots.map(x => `${x[0]},${x[1]}`))].map(x => x.split(',').map(y => parseInt(y)));
}

console.log(reachablePlots);
console.log(reachablePlots.length);



function printMap(m: string[][]) {
    for (let r = 0; r < m.length; r++) {
        console.log(m[r].join(''));
    }
}
