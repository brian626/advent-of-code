
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./05.input', 'utf-8');

const lines = file.split('\n');

let program: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    program = lines[i].split(',').map(x => parseInt(x));
}

let instructionPointer = 0;

while (instructionPointer >= 0 && instructionPointer < program.length) {
    // console.log(program);

    const instruction = program[instructionPointer].toString().padStart(5, '0');
    const opCode = parseInt(instruction.slice(-2));
    console.log(`program: ${program[instructionPointer]}, opCode ${opCode}`);
    if (opCode === 99) { break; }

    const mode1 = instruction[2], mode2 = instruction[1], mode3 = instruction[0];

    let param1 = 0, param2 = 0;
    if (mode1 === '0') {
        param1 = program[program[instructionPointer + 1]];
        console.log(`param1 in position mode: position ${program[instructionPointer+1]} => ${param1}`);
    } else {
        param1 = program[instructionPointer + 1];
        console.log(`param1 in immediate mode: ${param1}`);
    }

    if (mode2 === '0') {
        param2 = program[program[instructionPointer + 2]];
        console.log(`param2 in position mode: position ${program[instructionPointer+2]} => ${param2}`);
    } else {
        param2 = program[instructionPointer + 2];
        console.log(`param2 in immediate mode: ${param2}`);
    }

    switch (opCode) {
        case 1: // add
            console.log(`add ${param1} and ${param2} and store in location ${program[instructionPointer + 3]}`);
            program[program[instructionPointer + 3]] = param1 + param2;
            instructionPointer += 4;
            break;

        case 2: // multiply
            console.log(`multiply ${param1} and ${param2} and store in location ${program[instructionPointer + 3]}`);
            program[program[instructionPointer + 3]] = param1 * param2;
            instructionPointer += 4;
            break;

        case 3: // store
            console.log(`store input in location ${program[instructionPointer + 1]}`);
            program[program[instructionPointer + 1]] = 1;
            instructionPointer += 2;
            break;

        case 4: // output
            console.log(`outputting ${param1}`);
            console.log(param1);
            instructionPointer += 2;
            break;

        case 99: // halt
            instructionPointer++;
            break;

        default:
            console.log(`unknown opcode ${opCode}`);
            break;
    }

    console.log();
}

// console.log(program);
