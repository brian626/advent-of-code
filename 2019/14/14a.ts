
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.test', 'utf-8');

const lines = file.split('\n');

// 10 ORE => 10 A
// 1 ORE => 1 B
// 7 A, 1 B => 1 C
// 7 A, 1 C => 1 D
// 7 A, 1 D => 1 E
// 7 A, 1 E => 1 FUEL

class Reaction {
    inputs: string[];
    outputs: string[];

    constructor(i: string[], o: string[]) {
        this.inputs = i;
        this.outputs = o;
    }
}

const reactions: Reaction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [inputList, outputList] = lines[i].split(' => ');
    let inputs: string[] = [];
    for (const i of inputList.split(', ')) {
        const [quantity, symbol] = i.split(' ');
        for (let q = 0; q < parseInt(quantity); q++) {
            inputs.push(symbol);
        }
    }
    let outputs: string[] = [];
    for (const o of outputList.split(', ')) {
        const [quantity, symbol] = o.split(' ');
        for (let q = 0; q < parseInt(quantity); q++) {
            outputs.push(symbol);
        }
    }

    reactions.push(new Reaction(inputs, outputs));
}

// console.log(reactions);

const chemicals: string[] = ['FUEL'];

let safety = 10000;

while (true) {
    safety--;
    if (safety === 0) { break; }

    const chemical = chemicals.pop();
    const relevantReactions = reactions.filter(x => x.outputs.includes(chemical));
    // console.log(relevantReactions);
    if (relevantReactions.length === 1) {
        const r = relevantReactions[0];
        console.log(`converting ${chemical} to ${r.inputs}`);
        for (const i of r.inputs) {
            chemicals.push(i);
        }
    } else {
        chemicals.push(chemical);
    }

    // console.log(chemicals);
    if (chemicals.filter(x => x === 'ORE').length === chemicals.length) { break; }
}

console.log(chemicals.length);
