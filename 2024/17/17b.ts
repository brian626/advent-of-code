
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

const registers: Map<string, number> = new Map<string, number>();
let program: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Register')) {
        const matches = /Register (\S): (\d+)/.exec(lines[i]);
        registers.set(matches[1], parseInt(matches[2]));
    } else if (lines[i].startsWith('Program')) {
        const [_, programList] = lines[i].split(' ');
        program = programList.split(',').map(x => parseInt(x));
    }
}

// console.log(registers);
// console.log(program);

let aInitial = 202971645519911;
while (true) {
    registers.set('A', aInitial);
    registers.set('B', 0);
    registers.set('C', 0);
    if (aInitial % 100000 === 0) { console.log(aInitial); }

    let instructionPointer = 0;
    let output: number[] = [];
    while (instructionPointer < program.length) {
        const opcode = program[instructionPointer];
        const operand = program[instructionPointer + 1];
        // console.log(`${instructionPointer}: ${opcode} ${operand}, A: ${registers.get('A')}, B: ${registers.get('B')}, C: ${registers.get('C')}`);
        let breakEarly = false;

        let combo = -1;
        switch (operand) {
            case 0:
            case 1:
            case 2:
            case 3:
                combo = operand;
                break;

            case 4:
                combo = registers.get('A');
                break;

            case 5:
                combo = registers.get('B');
                break;

            case 6:
                combo = registers.get('C');
                break;

            default:
                console.log(`unknown combo ${operand}`);
                break;
        }

        switch (opcode) {
            case 0: // adv
                registers.set('A', Math.floor(registers.get('A') / Math.pow(2, combo)));
                break;

            case 1: // bxl
                registers.set('B', registers.get('B') ^ operand);
                break;

            case 2: // bst
                registers.set('B', combo % 8);
                break;

            case 3: // jnz
                if (registers.get('A') !== 0) {
                    instructionPointer = (operand - 2);
                }
                break;

            case 4: // bxc
                registers.set('B', registers.get('B') ^ registers.get('C'));
                break;

            case 5: // out
                // console.log(`outputting ${combo % 8}`);
                output.push(Math.abs(combo % 8));
                const outputSoFar = output.join(',');
                // if (outputSoFar !== program.slice(0, output.length).join(',')) {
                //     breakEarly = true;
                // }
                if (output.length === program.length) {
                    breakEarly = true;
                }
                break;

            case 6: // bdv
                registers.set('B', Math.floor(registers.get('A') / Math.pow(2, combo)));
                break;

            case 7: // cdv
                registers.set('C', Math.floor(registers.get('A') / Math.pow(2, combo)));
                break;

            default:
                console.log(`unknown opcode ${opcode}`);
                break;
        }

        instructionPointer += 2;

        if (breakEarly) {
            break;
        }
    }

    // console.log(`${aInitial}: ${output.join('')}`);

    // console.log(output.join(','));
    if (output.join(',') === program.join(',')) {
        console.log(`success!`);
        console.log(output, program);
        console.log();
        console.log(aInitial);
        console.log();
        break;
    }

    aInitial++;

    // if (aInitial > 118000) {
    //     break;
    // }
}


// last digit 0 means that aInitial is between 175_921_860_444_160 and 211_106_232_532_992
// second-to-last digit 3 means that