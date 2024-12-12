
import { readFileSync } from 'fs';
import { exit } from 'process';
import { permutations } from '../../common/permutations';

const file = readFileSync('./07.input', 'utf-8');

const lines = file.split('\n');

let originalProgram: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    originalProgram = lines[i].split(',').map(x => parseInt(x));
}

const phaseSettings = new Set([0, 1, 2, 3, 4]);
const phaseSettingSequences = permutations(phaseSettings);
let maxSignal = 0;

for (const pss of phaseSettingSequences) {
    const amp1Output = runProgram(pss[0], 0);
    // console.log(`  amp1: inputs ${pss[0]} and 0 produced output ${amp1Output}`);
    const amp2Output = runProgram(pss[1], amp1Output);
    // console.log(`  amp2: inputs ${pss[1]} and ${amp1Output} produced output ${amp2Output}`);
    const amp3Output = runProgram(pss[2], amp2Output);
    // console.log(`  amp3: inputs ${pss[2]} and ${amp2Output} produced output ${amp3Output}`);
    const amp4Output = runProgram(pss[3], amp3Output);
    // console.log(`  amp4: inputs ${pss[3]} and ${amp3Output} produced output ${amp4Output}`);
    const amp5Output = runProgram(pss[4], amp4Output);
    // console.log(`  amp5: inputs ${pss[4]} and ${amp4Output} produced output ${amp5Output}`);

    maxSignal = Math.max(maxSignal, amp5Output);
}

console.log();
console.log(maxSignal);


function runProgram(input1: number, input2: number): number {
    let program = Array.from(originalProgram);
    const inputs = [input1, input2];

    let instructionPointer = 0;
    let output = 0;

    while (instructionPointer >= 0 && instructionPointer < program.length) {
        const instruction = program[instructionPointer].toString().padStart(5, '0');
        const opCode = parseInt(instruction.slice(-2));
        // console.log(`program: ${program[instructionPointer]}, opCode ${opCode}`);
        if (opCode === 99) { break; }

        const mode1 = instruction[2], mode2 = instruction[1], mode3 = instruction[0];

        let param1 = 0, param2 = 0;
        if (mode1 === '0') {
            param1 = program[program[instructionPointer + 1]];
            // console.log(`param1 in position mode: position ${program[instructionPointer + 1]} => ${param1}`);
        } else {
            param1 = program[instructionPointer + 1];
            // console.log(`param1 in immediate mode: ${param1}`);
        }

        if (mode2 === '0') {
            param2 = program[program[instructionPointer + 2]];
            // console.log(`param2 in position mode: position ${program[instructionPointer + 2]} => ${param2}`);
        } else {
            param2 = program[instructionPointer + 2];
            // console.log(`param2 in immediate mode: ${param2}`);
        }

        switch (opCode) {
            case 1: // add
                // console.log(`add ${param1} and ${param2} and store in location ${program[instructionPointer + 3]}`);
                program[program[instructionPointer + 3]] = param1 + param2;
                instructionPointer += 4;
                break;

            case 2: // multiply
                // console.log(`multiply ${param1} and ${param2} and store in location ${program[instructionPointer + 3]}`);
                program[program[instructionPointer + 3]] = param1 * param2;
                instructionPointer += 4;
                break;

            case 3: // store
                // console.log(`store input in location ${program[instructionPointer + 1]}`);
                program[program[instructionPointer + 1]] = inputs.shift();;
                instructionPointer += 2;
                break;

            case 4: // output
                // console.log(`outputting ${param1}`);
                output = param1;
                instructionPointer += 2;
                break;

            case 5: // jump-if-true
                // console.log(`if ${param1} !== 0, set instruction pointer to ${param2}`);
                if (param1 !== 0) { instructionPointer = param2; }
                else { instructionPointer += 3; }
                break;

            case 6: // jump-if-false
                // console.log(`if ${param1} === 0, set instruction pointer to ${param2}`);
                if (param1 === 0) { instructionPointer = param2; }
                else { instructionPointer += 3; }
                break;

            case 7: // less than
                // console.log(`if ${param1} < ${param2}, store 1 at position ${program[instructionPointer + 3]}`);
                if (param1 < param2) { program[program[instructionPointer + 3]] = 1; }
                else { program[program[instructionPointer + 3]] = 0; }
                instructionPointer += 4;
                break;

            case 8: // equals
                // console.log(`if ${param1} === ${param2}, store 1 at position ${program[instructionPointer + 3]}`);
                if (param1 === param2) { program[program[instructionPointer + 3]] = 1; }
                else { program[program[instructionPointer + 3]] = 0; }
                instructionPointer += 4;
                break;

            case 99: // halt
                instructionPointer++;
                break;

            default:
                console.log(`unknown opcode ${opCode}`);
                break;
        }
    }

    // console.log(`returning ${output}`);
    return output;
}
