
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

class Amplifier {
    name: string;
    program: number[] = [];
    instructionPointer: number;
    output: number | null;
    halted: boolean;

    private inputs: number[];

    constructor(n: string, p: number[], i: number) {
        this.name = n;
        this.program = Array.from(p);
        this.inputs = [i];
        this.instructionPointer = 0;
        this.output = null;
        this.halted = false;
    }

    debug(s: string): void {
        if (false) {
            console.log(s);
        }
    }

    addInput(n: number): void {
        this.inputs.push(n);
        this.debug(`amp ${this.name} added input ${n}, inputs are now [${this.inputs}]`);
    }

    run(): void {
        while (this.instructionPointer >= 0 && this.instructionPointer < this.program.length) {
            const instruction = this.program[this.instructionPointer].toString().padStart(5, '0');
            const opCode = parseInt(instruction.slice(-2));
            // console.log(`program: ${this.program[this.instructionPointer]}, opCode ${opCode}`);

            const mode1 = instruction[2], mode2 = instruction[1], mode3 = instruction[0];

            let param1 = 0, param2 = 0;
            if (mode1 === '0') {
                param1 = this.program[this.program[this.instructionPointer + 1]];
                // console.log(`param1 in position mode: position ${this.program[this.instructionPointer + 1]} => ${param1}`);
            } else {
                param1 = this.program[this.instructionPointer + 1];
                // console.log(`param1 in immediate mode: ${param1}`);
            }

            if (mode2 === '0') {
                param2 = this.program[this.program[this.instructionPointer + 2]];
                // console.log(`param2 in position mode: position ${this.program[this.instructionPointer + 2]} => ${param2}`);
            } else {
                param2 = this.program[this.instructionPointer + 2];
                // console.log(`param2 in immediate mode: ${param2}`);
            }

            let goBackToSleep = false;

            switch (opCode) {
                case 1: // add
                    this.debug(`amp ${this.name} adding ${param1} and ${param2} and storing in location ${this.program[this.instructionPointer + 3]}`);
                    this.program[this.program[this.instructionPointer + 3]] = param1 + param2;
                    this.instructionPointer += 4;
                    break;

                case 2: // multiply
                this.debug(`amp ${this.name} multiplying ${param1} and ${param2} and storing in location ${this.program[this.instructionPointer + 3]}`);
                    this.program[this.program[this.instructionPointer + 3]] = param1 * param2;
                    this.instructionPointer += 4;
                    break;

                case 3: // store
                    if (this.inputs.length === 0) {
                        this.debug(`amp ${this.name} has no inputs...`);
                        goBackToSleep = true;
                        break;
                    }

                    this.debug(`amp ${this.name} storing input ${this.inputs[0]} in location ${this.program[this.instructionPointer + 1]}`);
                    this.program[this.program[this.instructionPointer + 1]] = this.inputs.shift();;
                    this.instructionPointer += 2;
                    break;

                case 4: // output
                this.debug(`amp ${this.name} outputting ${param1}`);
                    this.output = param1;
                    this.instructionPointer += 2;
                    // goBackToSleep = true;
                    break;

                case 5: // jump-if-true
                this.debug(`amp ${this.name}: if ${param1} !== 0, set instruction pointer to ${param2}`);
                    if (param1 !== 0) { this.instructionPointer = param2; }
                    else { this.instructionPointer += 3; }
                    break;

                case 6: // jump-if-false
                this.debug(`amp ${this.name}: if ${param1} === 0, set instruction pointer to ${param2}`);
                    if (param1 === 0) { this.instructionPointer = param2; }
                    else { this.instructionPointer += 3; }
                    break;

                case 7: // less than
                this.debug(`amp ${this.name}: if ${param1} < ${param2}, store 1 at position ${this.program[this.instructionPointer + 3]}`);
                    if (param1 < param2) { this.program[this.program[this.instructionPointer + 3]] = 1; }
                    else { this.program[this.program[this.instructionPointer + 3]] = 0; }
                    this.instructionPointer += 4;
                    break;

                case 8: // equals
                this.debug(`amp ${this.name}: if ${param1} === ${param2}, store 1 at position ${this.program[this.instructionPointer + 3]}`);
                    if (param1 === param2) { this.program[this.program[this.instructionPointer + 3]] = 1; }
                    else { this.program[this.program[this.instructionPointer + 3]] = 0; }
                    this.instructionPointer += 4;
                    break;

                case 99: // halt
                this.debug(`amp ${this.name} halting`);
                    goBackToSleep = true;
                    this.halted = true;
                    // instructionPointer++;
                    break;

                default:
                    this.debug(`unknown opcode ${opCode}`);
                    break;
            }

            this.debug(this.program.join(','));

            if (goBackToSleep) {
                break;
            }
        }

        this.debug(`amp ${this.name} going back to sleep with output = ${this.output}, halted = ${this.halted}`);
        this.debug('');
        return;
    }
}

const phaseSettings = new Set([5, 6, 7, 8, 9]);
const phaseSettingSequences = permutations(phaseSettings);
let maxSignal = 0;


for (const pss of phaseSettingSequences) {
    const amp1 = new Amplifier('A', originalProgram, pss[0]);
    const amp2 = new Amplifier('B', originalProgram, pss[1]);
    const amp3 = new Amplifier('C', originalProgram, pss[2]);
    const amp4 = new Amplifier('D', originalProgram, pss[3]);
    const amp5 = new Amplifier('E', originalProgram, pss[4]);
    amp1.addInput(0);

    let safety = 1000;
    while (!(amp1.halted && amp2.halted && amp3.halted && amp4.halted && amp5.halted)) {
        safety--;
        if (safety === 0) { console.log(`SAFETY!`); break; }
        if (safety % 10 === 0) { console.log(safety); }

        amp1.run();
        if (amp1.output) { amp2.addInput(amp1.output); }
        amp2.run();
        if (amp2.output) { amp3.addInput(amp2.output); }
        amp3.run();
        if (amp3.output) { amp4.addInput(amp3.output); }
        amp4.run();
        if (amp4.output) { amp5.addInput(amp4.output); }
        amp5.run();
        if (amp5.output) { amp1.addInput(amp5.output); }
    }

    maxSignal = Math.max(maxSignal, amp5.output);
}

console.log();
console.log(maxSignal);
