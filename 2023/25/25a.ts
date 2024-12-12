
import { readFileSync } from 'fs';
import { exit } from 'process';

import { DFSNode, Dfs } from '../../common/dfs';

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

const G: Set<string> = new Set<string>();
const E: Set<string> = new Set<string>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [componentName, connectedComponents] = lines[i].split(':').map(x => x.trim());
    G.add(componentName);
    for (const connectedComponentName of connectedComponents.split(' ')) {
        G.add(connectedComponentName);
        E.add(`${componentName}:${connectedComponentName}`);
    }
}

// console.log(`vertices:`);
// console.log(G);
// console.log();
// console.log(`edges:`);
// console.log(E);
// console.log();

const dfs = new Dfs();

for (const vertex of [...G]) {
    const neighbors: string[] = [];
    for (const edge of [...E]) {
        const [start, end] = edge.split(':');
        if (start === vertex) {
            neighbors.push(end);
        } else if (end === vertex) {
            neighbors.push(start);
        }
    }

    dfs.addNode(new DFSNode(vertex, neighbors));
}

// console.log(dfs);
// console.log(dfs.graph);

// Iterate through all "choose 3 of N" edge combinations
const edgeArray: string[][] = [...E].map(x => x.split(':'));

for (let i = 0; i < edgeArray.length - 2; i++) {
    const [startI, endI] = edgeArray[i];

    let node = dfs.findNode(startI);
    let neighbors = node.neighbors;
    let filteredNeighbors = neighbors.filter(x => x !== endI);
    dfs.addNode(new DFSNode(startI, filteredNeighbors));

    node = dfs.findNode(endI);
    neighbors = node.neighbors;
    filteredNeighbors = neighbors.filter(x => x !== startI);
    dfs.addNode(new DFSNode(endI, filteredNeighbors));

    let currentNeighbors = [];

    for (let j = i + 1; j < edgeArray.length - 1; j++) {
        // For each combination, temporarily remove each edge
        const [startJ, endJ] = edgeArray[j];

        node = dfs.findNode(startJ);
        neighbors = node.neighbors;
        filteredNeighbors = neighbors.filter(x => x !== endJ);
        dfs.addNode(new DFSNode(startJ, filteredNeighbors));

        node = dfs.findNode(endJ);
        neighbors = node.neighbors;
        filteredNeighbors = neighbors.filter(x => x !== startJ);
        dfs.addNode(new DFSNode(endJ, filteredNeighbors));

        for (let k = j + 1; k < edgeArray.length; k++) {
            console.log(i,j,k);
            // console.log(`start`);
            // console.log(`removing ${edgeArray[i]}, ${edgeArray[j]}, ${edgeArray[k]}`);

            dfs.reset();

            const [startK, endK] = edgeArray[k];

            node = dfs.findNode(startK);
            neighbors = node.neighbors;
            filteredNeighbors = neighbors.filter(x => x !== endK);
            dfs.addNode(new DFSNode(startK, filteredNeighbors));

            node = dfs.findNode(endK);
            neighbors = node.neighbors;
            filteredNeighbors = neighbors.filter(x => x !== startK);
            dfs.addNode(new DFSNode(endK, filteredNeighbors));

            // console.log(`edges removed`);

            // With the edges removed, see if it's still possible to get from the endpoints
            // of the edges to each other using DFS.
            if (!dfs.DFS_recursive(startI, endI)) {
                console.log(`after removing ${edgeArray[i]}, ${edgeArray[j]}, and ${edgeArray[k]}`);
                console.log(`we can no longer get from ${startI} to ${endI}`);

                // console.log(dfs.findNode(startI));
                // console.log(dfs.findNode(endI));

                let groupSize = 0;
                for (const vertex of G.values()) {
                    if (vertex === startI) { continue; }
                    dfs.reset();
                    if (dfs.DFS_recursive(startI, vertex)) {
                        // console.log(`${startI} still connects to ${vertex}`);
                        groupSize += 1;
                    }
                }
                console.log((groupSize + 1), (G.size - groupSize - 1));
                console.log((groupSize + 1) * (G.size - groupSize - 1));

                exit();
            }

            // If it is, replace the edges.
            currentNeighbors = dfs.findNode(startK).neighbors;
            currentNeighbors.push(endK);
            dfs.addNode(new DFSNode(startK, currentNeighbors));

            currentNeighbors = dfs.findNode(endK).neighbors;
            currentNeighbors.push(startK);
            dfs.addNode(new DFSNode(endK, currentNeighbors));

            // console.log(`edges replaced`);
        }

        currentNeighbors = dfs.findNode(startJ).neighbors;
        currentNeighbors.push(endJ);
        dfs.addNode(new DFSNode(startJ, currentNeighbors));

        currentNeighbors = dfs.findNode(endJ).neighbors;
        currentNeighbors.push(startJ);
        dfs.addNode(new DFSNode(endJ, currentNeighbors));
    }

    currentNeighbors = dfs.findNode(startI).neighbors;
    currentNeighbors.push(endI);
    dfs.addNode(new DFSNode(startI, currentNeighbors));

    currentNeighbors = dfs.findNode(endI).neighbors;
    currentNeighbors.push(startI);
    dfs.addNode(new DFSNode(endI, currentNeighbors));
}

console.log('huh????');

// 2954 is too low
