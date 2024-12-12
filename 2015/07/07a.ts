
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

const lines = file.split('\n');

const wires: Map<string, number> = new Map<string, number>();
const instructions: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    instructions.push(lines[i]);
}

while (instructions.length > 0) {
    const instruction = instructions.shift();
    const [part1, part2] = instruction.split(' -> ');

    if (part1.includes('AND') || part1.includes('OR') || part1.includes('LSHIFT') || part1.includes('RSHIFT')) {
        const [input1, operator, input2] = part1.split(' ');
        let value1 = undefined, value2 = undefined;

        if (isNaN(parseInt(input1))) {
            if (wires[input1] !== undefined) {
                value1 = wires[input1];
            }
        } else {
            value1 = parseInt(input1);
        }

        if (isNaN(parseInt(input2))) {
            if (wires[input2] !== undefined) {
                value2 = wires[input2];
            }
        } else {
            value2 = parseInt(input2);
        }

        if (value1 === undefined || value2 === undefined) {
            instructions.push(instruction);
        } else {
            if (operator === 'AND') {
                console.log(`setting wire[${part2}] equal to ${value1} & ${value2}`);
                wires[part2] = value1 & value2;
            } else if (operator === 'OR') {
                console.log(`setting wire[${part2}] equal to ${value1} | ${value2}`);
                wires[part2] = value1 | value2;
            } else if (operator === 'LSHIFT') {
                console.log(`setting wire[${part2}] equal to ${value1} << ${value2}`);
                wires[part2] = value1 << value2;
            } else if (operator === 'RSHIFT') {
                console.log(`setting wire[${part2}] equal to ${value1} >> ${value2}`);
                wires[part2] = value1 >> value2;
            }
        }
    } else if (part1.includes('NOT')) {
        const [operator, input1] = part1.split(' ');
        let value1 = undefined;

        if (isNaN(parseInt(input1))) {
            if (wires[input1] !== undefined) {
                value1 = wires[input1];
            }
        } else {
            value1 = parseInt(input1);
        }

        if (value1 === undefined) {
            instructions.push(instruction);
        } else {
            if (operator === 'NOT') {
                console.log(`setting wire[${part2}] equal to ~${value1}`);
                wires[part2] = ~value1;
                if (wires[part2] < 0) { wires[part2] += 65536; }
            }
        }
    } else {
        const input1 = part1;
        let value1 = undefined;

        if (isNaN(parseInt(input1))) {
            if (wires[input1] !== undefined) {
                value1 = wires[input1];
            }
        } else {
            value1 = parseInt(input1);
        }

        if (value1 === undefined) {
            instructions.push(instruction);
        } else {
            console.log(`setting wire[${part2}] equal to ${value1}`);
            wires[part2] = value1;
        }
    }
}

// console.log(wires);
console.log(wires['a']);
