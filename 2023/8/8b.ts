
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

class Node {
    name: string;
    suffix: string;
    leftString: string;
    rightString: string;
    left: Node;
    right: Node;

    constructor(n: string, l: string, r: string) {
        this.name = n;
        this.suffix = n.slice(n.length - 1);
        this.leftString = l;
        this.left = null;
        this.rightString = r;
        this.right = null;
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

let nodePtrs = nodes.filter(x => x.suffix === 'A');
// console.log(nodePtrs);
// let steps = 0;
let instructionNum = 0;

for (let i = 0; i < nodes.length; i++) {
    const leftNode = nodes.filter(x => x.name === nodes[i].leftString)[0];
    nodes[i].left = leftNode;
    const rightNode = nodes.filter(x => x.name === nodes[i].rightString)[0];
    nodes[i].right = rightNode;
}

let nodeSteps: number[] = [];
for (let i = 0; i < nodePtrs.length; i++) {
    let nodePtr = nodePtrs[i];
    let steps = 0;

    while (nodePtr.suffix !== 'Z') {
        if (instructions[instructionNum] === 'L') {
            nodePtr = nodePtr.left;
        } else {
            nodePtr = nodePtr.right;
        }

        instructionNum += 1;
        if (instructionNum >= instructions.length) {
            instructionNum = 0;
        }

        steps += 1;
    }

    nodeSteps[i] = steps;
    console.log(nodeSteps);
}

console.log(nodeSteps);
console.log(nodeSteps.reduce((x, y) => x * y, 1));

// [ 17141, 16579, 18827, 12083, 13207, 22199 ]

// 17141 = 61 × 281
// 16579 = 59 × 281
// 18827 = 67 × 281
// 12083 = 43 × 281
// 13207 = 47 × 281
// 22199 = 79 × 281

// product of [ 61, 59, 67, 43, 47, 79 ] = 38499053647

// 38499053647 is wrong

// 38499053647 * 281 = 10818234074807 is right
