
import { readFileSync } from 'fs';
import { exit } from 'process';
import { Dijkstra, Vertex } from '../../common/dijkstra-algorithm';

const file = readFileSync('./17.test', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

const WIDTH = map[0].length, HEIGHT = map.length;

let dijkstra = new Dijkstra();
for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
        const edgePaths = [
            'UUU',
            'LUU',
            'UUL',
            'ULU',
            'RUU',
            'UUR',
            'URU',
            'LUL',
            'ULL',
            'LLU',
            'RUR',
            'URR',
            'RRU',
            'RRR',
            'DLL',
            'LDL',
            'LLD',
            'DRR',
            'RDR',
            'RRD',
            'LDD',
            'DDL',
            'DLD',
            'DDR',
            'RDD',
            'DRD',
            'DDD'
        ];

        let edges = [];
        for (const edgePath of edgePaths) {
            edges = edges.concat(addEdge(r, c, edgePath));
        }

        console.log(edges);

        dijkstra.addVertex(
            new Vertex(`${r},${c}`, edges, parseInt(map[r][c]))
        );
    }
}

const shortestPath = dijkstra.findShortestWay('0,0', `${HEIGHT - 1},${WIDTH - 1}`);
console.log(shortestPath);

let heatLoss = 0;
for (const step of shortestPath.slice(0, -1)) {
    const [r, c] = step.split(',').map(x => parseInt(x));
    console.log(`move to [${r},${c}]`);
    heatLoss += parseInt(map[r][c]);
}

console.log(heatLoss);


function addEdge(row: number, col: number, path: string): any[] {
    let rowDelta = 0;
    let colDelta = 0;

    for (const p of path) {
        switch (p) {
            case 'U': rowDelta--; break;
            case 'D': rowDelta++; break;
            case 'L': colDelta--; break;
            case 'R': colDelta++; break;
        }
    }

    console.log(`addEdge(${row}, ${col}, path: ${path}, rowDelta: ${rowDelta}, colDelta: ${colDelta})`);

    if (rowDelta < 0 && row + rowDelta < 0 ||
        rowDelta > 0 && row + rowDelta > HEIGHT - 1 ||
        colDelta < 0 && col + colDelta < 0 ||
        colDelta > 0 && col + colDelta > WIDTH - 1) {
            console.log(`path is impossible`);
            console.log();
            return [];
    }

    let edgeName = '';
    let weight = 0;
    let rowStepNum = 0;
    let colStepNum = 0;

    let edges = [];

    for (const p of path) {
        switch (p) {
            case 'U':
                edgeName += `[${row - (1 + rowStepNum)},${col}]`;
                weight += parseInt(map[row - (1 + rowStepNum)][col]);
                rowStepNum++;
                break;

            case 'D':
                edgeName += `[${row + (1 + rowStepNum)},${col}]`;
                weight += parseInt(map[row + (1 + rowStepNum)][col]);
                rowStepNum++;
                break;

            case 'L':
                edgeName += `[${row},${col - (1 + colStepNum)}]`;
                weight += parseInt(map[row][col - (1 + colStepNum)]);
                colStepNum++;
                break;

            case 'R':
                edgeName += `[${row},${col + (1 + colStepNum)}]`;
                weight += parseInt(map[row][col + (1 + colStepNum)]);
                colStepNum++;
                break;
        }
    }

    console.log(`pushing ${edgeName} with weight ${weight}`);
    console.log();

    edges.push({
        nameOfVertex: edgeName,
        weight: weight
    })

    return edges;
}
