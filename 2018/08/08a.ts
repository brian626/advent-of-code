
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

const license: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    for (const n of lines[i].split(' ')) {
        license.push(parseInt(n));
    }
}

class Node {
    name: string;
    numChildren: number;
    numMetadata: number;
    children: Node[];
    metadata: number[];

    constructor(n: string, c: number, m: number) {
        this.name = n;
        this.numChildren = c;
        this.numMetadata = m;
        this.children = [];
        this.metadata = [];
    }
}

// console.log(license);

const nodes: Node[] = [];
let name: string = 'A';

while (license.length > 0) {
    nodes.push(parseNode());
}

// console.log(nodes);

let metadataTotal = 0;
for (let i = 0; i < nodes.length; i++) {
    metadataTotal += nodes[i].metadata.reduce((a, b) => a + b, 0);
}

console.log(metadataTotal);


function parseNode(): Node {
    const c = license.shift();
    const m = license.shift();

    const newNode = new Node(name, c, m);
    name = String.fromCharCode(name.charCodeAt(0) + 1);

    for (let i = 0; i < c; i++) {
        const childNode = parseNode();
        newNode.children.push(childNode);
        nodes.push(childNode);
    }

    for (let i = 0; i < m; i++) {
        newNode.metadata.push(license.shift());
    }

    return newNode;
}
