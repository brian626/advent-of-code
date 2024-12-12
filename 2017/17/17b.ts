
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let steps = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps = parseInt(lines[i]);
}

class Node {
    val: number;
    next: Node;

    constructor(v: number) { this.val = v; this.next = null; }
}

const rootNode = new Node(0);
rootNode.next = rootNode;
let bufferLength = 1;
let currentNode = rootNode;

for (let i = 1; i <= 50000000; i++) {
    if (i % 10000 === 0) { console.log(i); }
    // printBuffer();

    // Step forward
    for (let j = 0; j < steps; j++) {
        currentNode = currentNode.next;
    }

    // Insert
    const n = new Node(i);
    n.next = currentNode.next;
    currentNode.next = n;
    bufferLength += 1;

    // Update current position
    currentNode = n;
}

let x = rootNode;
while (x.val !== 2017) { x = x.next; if (x === rootNode) { break; } }
console.log(x.next.val);


function printBuffer(): void {
    let s = '';
    let p = rootNode;
    do {
        if (p === currentNode) { s += `(${p.val}) `}
        else { s += `${p.val} `; }
        p = p.next;
    } while (p !== rootNode);
    // for (let i = 0; i < bufferLength; i++) {
    //     if (i === currentPos) { s += `(${buffer[i]}) `; }
    //     else { s += `${buffer[i]} `; }
    // }
    console.log(s);
}
