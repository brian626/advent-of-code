// --- Part Two ---
// To completely determine whether you have enough adapters, you'll need to figure out how many different
// ways they can be arranged. Every arrangement needs to connect the charging outlet to your device.
// The previous rules about when adapters can successfully connect still apply.

// The first example above (the one that starts with 16, 10, 15) supports the following arrangements:

// (0), 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 6, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 5, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 6, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 6, 7, 10, 12, 15, 16, 19, (22)
// (0), 1, 4, 7, 10, 11, 12, 15, 16, 19, (22)
// (0), 1, 4, 7, 10, 12, 15, 16, 19, (22)

// (The charging outlet and your device's built-in adapter are shown in parentheses.) Given the
// adapters from the first example, the total number of arrangements that connect the charging outlet
// to your device is 8.

// The second example above (the one that starts with 28, 33, 18) has many arrangements. Here are a few:

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 48, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 46, 49, (52)

// (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
// 32, 33, 34, 35, 38, 39, 42, 45, 47, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 46, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 46, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 47, 48, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 47, 49, (52)

// (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
// 48, 49, (52)

// In total, this set of adapters can connect the charging outlet to your device in 19208 distinct arrangements.

// You glance back down at your bag and try to remember why you brought so many adapters; there must be
// more than a trillion valid ways to arrange them! Surely, there must be an efficient way to count the arrangements.

// What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.test2', 'utf-8');

const lines = file.split('\n');

const adapters: number[] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    adapters.push(parseInt(lines[i]));
}

adapters.sort((a,b) => a - b);

let deviceJoltage = Math.max(...adapters) + 3;
adapters.push(deviceJoltage);
// console.log(adapters);


class Node {
    constructor(val: number) { this.value = val; this.plusOne = null; this.plusTwo = null; this.plusThree = null; }

    value: number;
    plusOne: Node;
    plusTwo: Node;
    plusThree: Node;
}

const head = new Node(0);
const nodesToFill: Node[] = [head];
const nodeMap: Map<number, Node> = new Map<number, Node>();

fillTree();

console.log(head);

let paths = 0;
const nodeQueue = [head];
dfs();
console.log(paths);



function dfs() {
    let node = nodeQueue.pop();
    while (node !== undefined) {
        if (node.value === deviceJoltage) {
            paths += 1;
        }

        if (node.plusOne !== null) { nodeQueue.push(node.plusOne); }
        if (node.plusTwo !== null) { nodeQueue.push(node.plusTwo); }
        if (node.plusThree !== null) { nodeQueue.push(node.plusThree); }
    }
}


function fillTree() {
    let node = nodesToFill.pop();

    while (node !== undefined) {
        // if (deviceJoltage - node.value <= 3) {
        //     paths += 1;
        //     if (paths % 100000 === 0) { console.log(paths); }
        // }
        // else {
            if (node.plusOne === null && adapters.includes(node.value + 1)) { node.plusOne = insertNode(node.value + 1); nodesToFill.push(node.plusOne); }
            if (node.plusTwo === null && adapters.includes(node.value + 2)) { node.plusTwo = insertNode(node.value + 2); nodesToFill.push(node.plusTwo); }
            if (node.plusThree === null && adapters.includes(node.value + 3)) { node.plusThree = insertNode(node.value + 3); nodesToFill.push(node.plusThree); }
        // }

        // console.log(nodesToFill.length);
        node = nodesToFill.pop();
    }
}


function insertNode(val: number) {
    let existingNode = nodeMap.get(val);
    if (existingNode === undefined) {
        console.log(`creating node for ${val}`);
        existingNode = new Node(val);
        nodeMap.set(val, existingNode);
    }

    return existingNode;
}
