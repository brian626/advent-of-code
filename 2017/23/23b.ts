
import { readFileSync } from 'fs';
import { exit, send } from 'process';

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

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');


const instructions: Instruction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [o, i1, i2] = lines[i].split(' ');

    let input1: number | string;
    if (/[a-z]/.test(i1)) { input1 = i1; }
    else { input1 = parseInt(i1); }

    let input2: number | string;
    if (/[a-z]/.test(i2)) { input2 = i2; }
    else { input2 = parseInt(i2); }

    instructions.push(new Instruction(o, input1, input2));
}

// console.log(instructions);

const registers1: Map<string, number> = new Map<string, number>();
registers1.set('a', 1);

let iPos1 = 0;

let lastD = -1;

function processInstruction(pos: number): number {
    // if ((id === 0 && d1) || (id === 1 && d2)) { return [pos, d1, d2]; }

    const i = instructions[pos];
    const registers = registers1;

    // console.log(`${pos}: ${i.op}, ${i.input1}, ${i.input2 !== undefined ? i.input2 : ''}`);

    switch (i.op) {
        case 'set':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, i.input2); }
            break;

        case 'sub':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) - getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) - i.input2); }
            break;

        case 'mul':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) * getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) * i.input2); }
            break;

        case 'jnz':
            // console.log(`${pos}: ${i.op}, ${i.input1}, ${i.input2 !== undefined ? i.input2 : ''}`);
            if (getRegister(registers, 'd') !== lastD) {
                lastD = getRegister(registers, 'd');
                printRegisters();
            }
            if (typeof(i.input1) === 'string' && getRegister(registers, i.input1 as string) !== 0) {
                // console.log(`  jumping case 1`);
                if (typeof(i.input2) === 'string') { pos += getRegister(registers, i.input2); }
                else { pos += i.input2; }
                pos--;
            }
            else if (typeof(i.input1) === 'number' && i.input1 !== 0) {
                // console.log(`  jumping case 2`);
                if (typeof(i.input2) === 'string') { pos += getRegister(registers, i.input2); }
                else { pos += i.input2; }
                pos--;
            } else {
                // console.log(`  not jumping`);
            }
            break;

        default:
            break;
    }

    pos++;

    // console.log(registers);

    return pos;
}


let safety = 0;
while (true) {
    safety++;
    if (safety > 100000000) { console.log(`safety`); break; }

    if (iPos1 >= 0 && iPos1 < instructions.length) {
        iPos1 = processInstruction(iPos1);
    } else {
        break;
    }
}

console.log(`h is ${getRegister(registers1, 'h')}`);



function getRegister(registers: Map<string, number>, r: string): number {
    if (!registers.has(r)) { registers.set(r, 0); }

    return registers.get(r);
}


function printRegisters(): void {
    const keys = Array.from(registers1.keys()).sort((a, b) => a.localeCompare(b));

    let s = '';
    for (const k of keys) {
        s += `${k}: ${registers1.get(k)}, `;
    }

    console.log(s);
}
