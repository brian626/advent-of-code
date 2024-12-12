
import { readFileSync } from 'fs';
import { exit } from 'process';

class Instruction {
    op: string;
    input1: string;
    input2: string | number;

    constructor(o: string, i1: string, i2: string | number) {
        this.op = o;
        this.input1 = i1;
        this.input2 = i2;
    }
}

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

const instructions: Instruction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [o, i1, i2] = lines[i].split(' ');
    if (/[a-z]/.test(i2)) {
        instructions.push(new Instruction(o, i1, i2 as string));
    } else {
        instructions.push(new Instruction(o, i1, parseInt(i2)));
    }
}

// console.log(instructions);

const registers: Map<string, number> = new Map<string, number>();

let lastSound = -1;
let recoveredSound = -1;
let iPos = 0;

while (iPos >= 0 && iPos < instructions.length && recoveredSound === -1) {
    const i = instructions[iPos];
    console.log(`${iPos}: ${i.op}, ${i.input1}, ${i.input2 !== undefined ? i.input2 : ''}`);

    switch (i.op) {
        case 'snd':
            lastSound = getRegister(i.input1);
            break;

        case 'set':
            if (typeof(i.input2) === 'string') { registers.set(i.input1, getRegister(i.input2)); }
            else { registers.set(i.input1, i.input2); }
            break;

        case 'add':
            if (typeof(i.input2) === 'string') { registers.set(i.input1, getRegister(i.input1) + getRegister(i.input2)); }
            else { registers.set(i.input1, getRegister(i.input1) + i.input2); }
            break;

        case 'mul':
            if (typeof(i.input2) === 'string') { registers.set(i.input1, getRegister(i.input1) * getRegister(i.input2)); }
            else { registers.set(i.input1, getRegister(i.input1) * i.input2); }
            break;

        case 'mod':
            if (typeof(i.input2) === 'string') { registers.set(i.input1, getRegister(i.input1) % getRegister(i.input2)); }
            else { registers.set(i.input1, getRegister(i.input1) % i.input2); }
            break;

        case 'rcv':
            if (getRegister(i.input1) !== 0) { recoveredSound = lastSound; }
            break;

        case 'jgz':
            if (getRegister(i.input1) > 0) {
                if (typeof(i.input2) === 'string') { iPos += getRegister(i.input2); }
                else { iPos += i.input2; }
                iPos--;
            }
            break;

        default:
            break;
    }

    console.log(registers);
    console.log();
    iPos++;
}

console.log(`----`);
console.log(recoveredSound);


function getRegister(r: string): number {
    if (!registers.has(r)) { registers.set(r, 0); }

    return registers.get(r);
}
