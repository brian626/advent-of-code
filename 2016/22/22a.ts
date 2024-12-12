
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

const nodes: Node[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('/dev')) {
        const [f, s, u, a, p] = lines[i].replace(/\s+/g, ' ').split(' ');
        nodes.push(new Node(f, parseInt(s.slice(0, -1)), parseInt(u.slice(0, -1)), parseInt(a.slice(0, -1)), parseInt(p.slice(0, -1))));
    }
}

// console.log(nodes);

// let count = 0;
const viablePairs: Set<string> = new Set<string>();

for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
        if (nodes[i].filesystem === nodes[j].filesystem) { continue; }
        if (isViablePair(nodes[i], nodes[j])) {
            console.log(`pair ${nodes[i].filesystem},${nodes[j].filesystem} is viable because node A has used of ${nodes[i].used}T which would fit on node B's avail ${nodes[j].available}T`);
            viablePairs.add(`${nodes[i].filesystem},${nodes[j].filesystem}`);
        } else {
            // console.log(`pair ${nodes[i].filesystem},${nodes[j].filesystem} is NOT viable because node A has used of ${nodes[i].used}T which would NOT fit on node B's avail ${nodes[j].available}T`);
        }
    }
}

// console.log(count);
console.log(Array.from(viablePairs.values())[0]);
console.log(viablePairs.size);


function isViablePair(a: Node, b: Node): boolean {
    return a.used !== 0 && b.available >= a.used;
}
