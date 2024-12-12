
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

class Node {
    name: string;
    left: string;
    right: string;

    constructor(n: string, l: string, r: string) {
        this.name = n;
        this.left = l;
        this.right = r;
    }
}

let instructions: string[] = [];
const nodes: Node[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(' = ');

    if (parts.length === 1) {
        instructions = parts[0].trim().split('');
    } else {
        const newNodeName = parts[0].trim();
        const nodeParts = parts[1].trim().replace('(', '').replace(')', '').split(', ');
        const newNode = new Node(newNodeName, nodeParts[0].trim(), nodeParts[1].trim());
        nodes.push(newNode);
    }
}

let nodePtr = nodes.filter(x => x.name === 'AAA')[0];
let steps = 0;
let instructionNum = 0;

while (nodePtr.name !== 'ZZZ') {
    if (instructions[instructionNum] === 'L') {
        nodePtr = nodes.filter(x => x.name === nodePtr.left)[0];
    } else {
        nodePtr = nodes.filter(x => x.name === nodePtr.right)[0];
    }

    instructionNum += 1;
    if (instructionNum >= instructions.length) {
        instructionNum = 0;
    }

    steps += 1;
}

console.log(steps);
