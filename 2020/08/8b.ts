// --- Part Two ---
// After some careful analysis, you believe that exactly one instruction is corrupted.

// Somewhere in the program, either a jmp is supposed to be a nop, or a nop is supposed to be a jmp.
// (No acc instructions were harmed in the corruption of this boot code.)

// The program is supposed to terminate by attempting to execute an instruction immediately after the
// last instruction in the file. By changing exactly one jmp or nop, you can repair the boot code and
// make it terminate correctly.

// For example, consider the same program from above:

// nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6

// If you change the first instruction from nop +0 to jmp +0, it would create a single-instruction
// infinite loop, never leaving that instruction. If you change almost any of the jmp instructions,
// the program will still eventually find another jmp instruction and loop forever.

// However, if you change the second-to-last instruction (from jmp -4 to nop -4), the program
// terminates! The instructions are visited in this order:

// nop +0  | 1
// acc +1  | 2
// jmp +4  | 3
// acc +3  |
// jmp -3  |
// acc -99 |
// acc +1  | 4
// nop -4  | 5
// acc +6  | 6

// After the last instruction (acc +6), the program terminates by attempting to run the instruction
// below the last instruction in the file. With this change, after the program terminates, the accumulator
// contains the value 8 (acc +1, acc +1, acc +6).

// Fix the program so that it terminates normally by changing exactly one jmp (to nop) or nop (to jmp).
// What is the value of the accumulator after the program terminates?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

class Instruction {
    constructor(op: string, arg: number) {
        this.operation = op;
        this.argument = arg;
        this.visited = false;
    }

    operation: string;
    argument: number;
    visited: boolean;
}

const instructions: Instruction[] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [operator, argument] = lines[i].split(' ');
    instructions.push(new Instruction(operator, parseInt(argument)));
}

for (let i = 0; i < instructions.length; i++) {
    const modifedInstructions: Instruction[] = new Array();
    for (let j = 0; j < instructions.length; j++) {
        modifedInstructions[j] = new Instruction(instructions[j].operation, instructions[j].argument);
    }

    if (modifedInstructions[i].operation === 'acc') { continue; }
    else if (modifedInstructions[i].operation == 'jmp') { modifedInstructions[i].operation = 'nop'; }
    else { modifedInstructions[i].operation = 'jmp'; }

    let accumulator = 0;
    let instructionNum = 0;
    let terminated = false;

    while (true) {
        const instruction = modifedInstructions[instructionNum];
        // console.log(instruction);
        if (instruction.visited) { break; }
        instruction.visited = true;

        switch(instruction.operation) {
            case 'nop':
                instructionNum += 1;
                break;

            case 'jmp':
                // console.log(`jumping ahead ${instruction.argument}`);
                instructionNum += instruction.argument;
                break;

            case 'acc':
                // console.log(`accumulating ${instruction.argument}`);
                accumulator += instruction.argument;
                instructionNum += 1;
                break;
        }

        if (instructionNum === instructions.length) {
            terminated = true;
            console.log(`terminated with acc ${accumulator}`);
            break;
        }
    }
}
