
import { readFileSync } from 'fs';
import { exit } from 'process';

class Instruction {
    op: string;
    input1: string | number;
    input2: string | number;

    constructor(o: string, i1: string | number, i2: string | number) {
        this.op = o;
        this.input1 = i1;
        this.input2 = i2;
    }
}

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

const registers: Map<string, number> = new Map<string, number>();
registers.set('a', 0);
registers.set('b', 0);
registers.set('c', 1);
registers.set('d', 0);

const instructions: Instruction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [o, i1, i2] = lines[i].split(' ');

    if (/[a-z]/.test(i1)) {
        instructions.push(new Instruction(o, i1 as string, i2));
    } else {
        instructions.push(new Instruction(o, parseInt(i1), i2));
    }
}


let x = 0;

let safety = 100000000;

while (x < instructions.length) {
    safety--;
    if (safety === 0) { console.log(`safety`); break; }

    const i = instructions[x];

    switch (i.op) {
        case 'cpy':
            if (typeof(i.input1) === 'string') {
                registers.set(i.input2 as string, registers.get(i.input1));
            } else {
                registers.set(i.input2 as string, i.input1);
            }
            break;

        case 'inc':
            registers.set(i.input1 as string, registers.get(i.input1 as string) + 1);
            break;

        case 'dec':
            registers.set(i.input1 as string, registers.get(i.input1 as string) - 1);
            break;

        case 'jnz':
            if (registers.get(i.input1 as string) !== 0) {
                x += (i.input2 as number) - 1;
            }
            break;
    }

    x++;
}

console.log(registers.get('a'));
