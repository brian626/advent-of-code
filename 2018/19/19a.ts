
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

class Instruction {
    opcode: string;
    input1: number;
    input2: number;
    output: number;

    constructor(op: string, i1: number, i2: number, o: number) {
        this.opcode = op;
        this.input1 = i1;
        this.input2 = i2;
        this.output = o;
    }
}

const instructions: Instruction[] = [];

let instructionPointer = 0;
let instructionPointerRegister = -1;

const registers = [0, 0, 0, 0, 0, 0];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('#')) {
        const [_, ip] = lines[i].split(' ');
        instructionPointerRegister = parseInt(ip);
    } else {
        const [op, i1, i2, o] = lines[i].split(' ');
        instructions.push(new Instruction(op, parseInt(i1), parseInt(i2), parseInt(o)));
    }
}

// console.log(instructionPointerRegister);
// console.log(instructions);


while (true) {
    const inst = instructions[instructionPointer];

    registers[instructionPointerRegister] = instructionPointer;
    const input1 = inst.input1, input2 = inst.input2, output = inst.output;

    switch(inst.opcode) {
        case 'addr':
            registers[output] = registers[input1] + registers[input2];
            break;

        case 'addi':
            registers[output] = registers[input1] + input2;
            break;

        case 'mulr':
            registers[output] = registers[input1] * registers[input2];
            break;

        case 'muli':
            registers[output] = registers[input1] * input2;
            break;

        case 'banr':
            registers[output] = registers[input1] & registers[input2];
            break;

        case 'bani':
            registers[output] = registers[input1] & input2;
            break;

        case 'borr':
            registers[output] = registers[input1] | registers[input2];
            break;

        case 'bori':
            registers[output] = registers[input1] | input2;
            break;

        case 'setr':
            registers[output] = registers[input1];
            break;

        case 'seti':
            registers[output] = input1;
            break;

        case 'gtir':
            registers[output] = input1 > registers[input2] ? 1 : 0;
            break;

        case 'gtri':
            registers[output] = registers[input1] > input2 ? 1 : 0;
            break;

        case 'gtrr':
            registers[output] = registers[input1] > registers[input2] ? 1 : 0;
            break;

        case 'eqir':
            registers[output] = input1 === registers[input2] ? 1 : 0;
            break;

        case 'eqri':
            registers[output] = registers[input1] === input2 ? 1 : 0;
            break;

        case 'eqrr':
            registers[output] = registers[input1] === registers[input2] ? 1 : 0;
            break;

        default:
            break;
    }

    instructionPointer = registers[instructionPointerRegister];
    instructionPointer++;

    if (instructionPointer >= instructions.length) {
        break;
    }
}

console.log(registers[0]);
