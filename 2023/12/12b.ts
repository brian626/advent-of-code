
import { readFileSync } from 'fs';
import { exit } from 'process';

class Node {
    pattern: string;
    leftChild: Node;
    rightChild: Node;

    constructor(p: string) {
        this.pattern = p;
        this.leftChild = null;
        this.rightChild = null;
    }
}

const file = readFileSync('./12.test', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    console.log(i);

    const parts = lines[i].split(' ');
    const patternString = parts[0];
    const sizes = parts[1];

    let unfoldedPatternString = '';
    let unfoldedSizes = '';
    const NUMCOPIES = 4;
    for (let i = 0; i < NUMCOPIES; i++) {
        unfoldedPatternString += patternString + '?';
        unfoldedSizes += sizes + ',';
    }
    unfoldedPatternString += patternString;
    const unfoldedPattern = unfoldedPatternString.split('');
    unfoldedSizes += sizes;
    // console.log(unfoldedPattern.join(''));
    // console.log(unfoldedSizes);

    sum += explore(unfoldedPattern, unfoldedSizes);

    // console.log();
}

console.log(sum);


function explore(pattern: string[], sizes: string): number {
    const rootNode = new Node('');
    const nodes: Node[] = [rootNode];

    let children: Node[] = [];
    if (pattern[0] !== '?') {
        const newNode = new Node(pattern[0]);
        rootNode.leftChild = newNode;
        children.push(newNode);
    } else {
        const newNode1 = new Node('.');
        rootNode.leftChild = newNode1;
        children.push(newNode1);
        const newNode2 = new Node('#');
        rootNode.rightChild = newNode2;
        children.push(newNode2);
    }

    for (let i = 1; i < pattern.length; i++) {
        // console.log(`working on position ${i} of ${pattern} with children: ${children.map(x => x.pattern).join(', ')}`);
        let nextGeneration: Node[] = [];
        if (pattern[i] !== '?') {
            while (children.length > 0) {
                const child = children.shift();
                if (testPartialArrangement(child.pattern + pattern[i], sizes)) {
                    const grandChild = new Node(child.pattern + pattern[i]);
                    // console.log(`child of ${child.pattern} is ${grandChild.pattern}`);
                    nodes.push(grandChild);
                    child.leftChild = grandChild;
                    nextGeneration.push(grandChild);
                }
            }
        } else {
            while (children.length > 0) {
                const child = children.shift();
                if (testPartialArrangement(child.pattern + '.', sizes)) {
                    const grandChild1 = new Node(child.pattern + '.');
                    // console.log(`child 1 of ${child.pattern} is ${grandChild1.pattern}`);
                    nodes.push(grandChild1);
                    child.leftChild = grandChild1;
                    nextGeneration.push(grandChild1);
                }
                if (testPartialArrangement(child.pattern + '#', sizes)) {
                    const grandChild2 = new Node(child.pattern + '#');
                    // console.log(`child 2 of ${child.pattern} is ${grandChild2.pattern}`);
                    nodes.push(grandChild2);
                    child.rightChild = grandChild2;
                    nextGeneration.push(grandChild2);
                }
            }
        }

        children = nextGeneration;
    }

    // console.log(nodes);

    let count = 0;
    for (const n of nodes.filter(x => x.pattern.length === pattern.length)) {
        if (testArrangement(n.pattern, sizes)) { count++; }
    }

    return count;
}

function testArrangement(a: string, s: string): boolean {
    const sizes = a.split('.').map(x => x.length).filter(x => x > 0).join(',');
    // console.log(`testArrangement(${a}, ${s}) returning (${sizes} === ${s}) === ${sizes === s}`);
    return sizes === s;
}


function testPartialArrangement(pattern: string, sizes: string): boolean {
    const partialSizes = pattern.split('.').map(x => x.length).filter(x => x > 0).slice(0, -1).join(',');
    // console.log(`testPartialArrangement(${pattern}, ${sizes}) returning (${sizes}.startsWith(${partialSizes}) === ${sizes.startsWith(partialSizes)}`);
    return sizes.startsWith(partialSizes);
}
