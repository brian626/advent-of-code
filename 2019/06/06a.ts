
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./06.input', 'utf-8');

const lines = file.split('\n');

class Node {
    name: string;
    orbiters: string[];
    depth: number;

    constructor(n: string) {
        this.name = n;
        this.orbiters = [];
        this.depth = 0;
    }
}

const nodes: Map<string, Node> = new Map<string, Node>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [orbitee, orbiter] = lines[i].split(')');
    // console.log(`processing ${lines[i]}`);

    let orbiteeNode = nodes.get(orbitee);
    if (orbiteeNode === undefined) {
        // console.log(`creating node ${orbitee}`);
        orbiteeNode = new Node(orbitee);
        nodes.set(orbitee, orbiteeNode);
    }
    let orbiterNode = nodes.get(orbiter);
    if (orbiterNode === undefined) {
        // console.log(`creating node ${orbiter}`);
        orbiterNode = new Node(orbiter);
        nodes.set(orbiter, orbiterNode);
    }

    orbiteeNode.orbiters.push(orbiter);
    nodes.set(orbitee, orbiteeNode);
}

// console.log(nodes);

let graph = [nodes.get('COM')];

while (graph.length > 0) {
    // console.log(graph);
    const n = graph.shift();
    for (const o of n.orbiters) {
        const n2 = nodes.get(o);
        if (n2) {
            n2.depth = n.depth + 1;
            nodes.set(o, n2);
            graph.push(nodes.get(o));
        }
    }
}

// console.log(nodes);

let totalDepth = 0;
for (const [_name, node] of nodes) {
    totalDepth += node.depth;
}

console.log(totalDepth);
