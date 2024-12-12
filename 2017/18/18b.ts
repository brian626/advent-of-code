
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

const registers1: Map<string, number> = new Map<string, number>();
registers1.set('p', 0);
const queue1: number[] = [];
let deadlock1 = false;

const registers2: Map<string, number> = new Map<string, number>();
registers2.set('p', 1);
const queue2: number[] = [];
let deadlock2 = false;

let iPos1 = 0, iPos2 = 0;

function processInstruction(pos: number, id: number, d1: boolean, d2: boolean): [number, boolean, boolean] {
    // if ((id === 0 && d1) || (id === 1 && d2)) { return [pos, d1, d2]; }

    const i = instructions[pos];
    const registers = (id === 0) ? registers1 : registers2;
    const sendQueue = (id === 0) ? queue2 : queue1;
    const rcvQueue = (id === 0) ? queue1 : queue2;
    let deadlock1 = d1, deadlock2 = d2;

    // console.log(`${pos}: ${i.op}, ${i.input1}, ${i.input2 !== undefined ? i.input2 : ''}`);

    switch (i.op) {
        case 'snd':
            if (id === 0) { sends1++; }
            if (typeof(i.input1) === 'string') {
                // console.log(`program ${id} sending registers[${i.input1}] === ${getRegister(registers, i.input1)}`);
                sendQueue.push(getRegister(registers, i.input1));
            } else {
                // console.log(`program ${id} sending ${i.input1}`);
                sendQueue.push(i.input1)
            }

            if (id === 0) { deadlock2 = false; }
            else if (id === 1) { deadlock1 = false; }
            break;

        case 'set':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, i.input2); }
            break;

        case 'add':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) + getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) + i.input2); }
            break;

        case 'mul':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) * getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) * i.input2); }
            break;

        case 'mod':
            if (typeof(i.input2) === 'string') { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) % getRegister(registers, i.input2)); }
            else { registers.set(i.input1 as string, getRegister(registers, i.input1 as string) % i.input2); }
            break;

        case 'rcv':
            if (rcvQueue.length > 0) {
                const v = rcvQueue.shift();
                // console.log(`program ${id} received ${v}`);
                registers.set(i.input1 as string, v);
                if (id === 0) { deadlock1 = false; }
                else if (id === 1) { deadlock2 = false; }
            } else {
                if (id === 0) { deadlock1 = true; pos--; }
                else if (id === 1) { deadlock2 = true; pos--; }
            }
            break;

        case 'jgz':
            if (getRegister(registers, i.input1 as string) > 0) {
                if (typeof(i.input2) === 'string') { pos += getRegister(registers, i.input2); }
                else { pos += i.input2; }
                pos--;
            }
            break;

        default:
            break;
    }

    pos++;

    return [pos, deadlock1, deadlock2];
}


let q = 0;
let sends1 = 0;
while (true) {
    if (deadlock1 && deadlock2) {
        console.log(`breaking due to deadlocks`);
        break;
    }

    if (!deadlock1 && iPos1 >= 0 && iPos1 < instructions.length) {
        [iPos1, deadlock1, deadlock2] = processInstruction(iPos1, 0, deadlock1, deadlock2);
    }

    if (!deadlock2 && iPos2 >= 0 && iPos2 < instructions.length) {
        [iPos2, deadlock1, deadlock2] = processInstruction(iPos2, 1, deadlock1, deadlock2);
    }

    if (sends1 > 32856) {
        console.log(`breaking early`);
        break;
    }

    // console.log(registers1);
    // console.log(registers2);
    // console.log();
}

// console.log(q);
// console.log(registers1);
// console.log(registers2);
// console.log();
// console.log(`----`);
console.log(sends1);


function getRegister(registers: Map<string, number>, r: string): number {
    if (!registers.has(r)) { registers.set(r, 0); }

    return registers.get(r);
}


// 32856 is too high
// 127 is too low
