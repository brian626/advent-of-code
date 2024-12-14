
import { readFileSync } from 'fs';
import { exit } from 'process';

class Node {
    filesystem: string;
    xPos: number;
    yPos: number;
    size: number;
    used: number;
    available: number;
    usePercentage: number;

    constructor(f: string, s: number, u: number, a: number, p: number) {
        this.filesystem = f;
        this.size = s;
        this.used = u;
        this.available = a;
        this.usePercentage = p;

        const [_, x, y] = this.filesystem.split('-');
        this.xPos = parseInt(x.slice(1));
        this.yPos = parseInt(y.slice(1));
    }
}

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

const nodes: Node[][] = [];

let maxXValue = 0;
let maxYValue = 0;
let openXValue = 0;
let openYValue = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('/dev')) {
        const [f, s, u, a, p] = lines[i].replace(/\s+/g, ' ').split(' ');
        const node = new Node(f, parseInt(s.slice(0, -1)), parseInt(u.slice(0, -1)), parseInt(a.slice(0, -1)), parseInt(p.slice(0, -1)));
        if (!nodes[node.yPos]) {
            nodes[node.yPos] = [];
        }
        nodes[node.yPos][node.xPos] = node;
        maxXValue = Math.max(maxXValue, node.xPos);
        maxYValue = Math.max(maxYValue, node.yPos);

        if (node.usePercentage === 0) {
            openXValue = node.xPos;
            openYValue = node.yPos;
        }
    }
}

// console.log(nodes);

const goalNode = nodes[0][maxXValue];
const openNode = nodes[openYValue][openXValue];

printNodes();


function printNodes() {
    for (let y = 0; y < nodes.length; y++) {
        let row = '';

        for (let x = 0; x < nodes[0].length; x++) {
            if (y === goalNode.yPos && x === goalNode.xPos) { row += 'G'; }
            else if (y === openNode.yPos && x === openNode.xPos) { row += '_'; }
            else if (nodes[y][x].size > 500) { row += '#'; }
            else { row += '.'; }
        }

        console.log(row);
    }

    console.log();
}
