
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

const BORDER = 5;
const DEBUG = false;
function debug(s: string): void { if (DEBUG) { console.log(s); } }

let program: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    program = lines[i].split(',').map(x => parseInt(x));
}


class Robot {
    row: number;
    col: number;
    facing: number; // 0: up, 1: right, 2: down, 3: left
    program: number[];
    instructionPointer: number;
    private inputs: number[];
    private lastInput: number;
    halted: boolean;
    private outputs: number[];
    // relOffset: number;

    constructor(p: number[]) {
        this.row = 0;
        this.col = 0;
        this.facing = 0;
        this.program = Array.from(p);
        this.instructionPointer = 0;
        this.inputs = [];
        this.halted = false;
        this.outputs = [];
        // this.relOffset = 0;
    }

    addInput(n: number) {
        this.inputs.push(n);
        this.lastInput = n;
    }

    getProgramLocation(l: number): number {
        return this.program[l] || 0;
    }

    turnLeft(): void {
        this.facing -= 1;
        if (this.facing < 0) { this.facing = 3; }
    }

    turnRight(): void {
        this.facing += 1;
        if (this.facing > 3) { this.facing = 0; }
    }

    getOutput(): number[] {
        const o = this.outputs;
        // this.outputs = [];
        return o;
    }

    clearOutput(): void {
        this.outputs = [];
    }

    move(): void {
        switch (this.facing) {
            case 0: this.row -= 1; break;
            case 1: this.col += 1; break;
            case 2: this.row += 1; break;
            case 3: this.col -= 1; break;
            default: console.log(`wtf!`); break;
        }
    }

    run() {
        while (this.instructionPointer >= 0 && this.instructionPointer < program.length) {
            let s = '[';
            for (let i = 0; i < this.program.length; i++) {
                s += `${i}: ${this.program[i]}, `
            }
            s += ']';
            // debug(s);

            const instruction = this.program[this.instructionPointer].toString().padStart(5, '0');
            const opCode = parseInt(instruction.slice(-2));
            debug(`ip: ${this.instructionPointer}, program[ip]: [${this.program[this.instructionPointer]},${this.program[this.instructionPointer + 1]},${this.program[this.instructionPointer + 2]},${this.program[this.instructionPointer + 3]}], opCode ${opCode}`);

            const mode1 = instruction[2], mode2 = instruction[1], mode3 = instruction[0];

            let param1 = 0, param2 = 0; // , param3 = 0;
            if (mode1 === '0') {
                param1 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 1));
                debug(`param1 in position mode: position ${this.getProgramLocation(this.instructionPointer + 1)} => ${param1}`);
            } else if (mode1 === '1') {
                param1 = this.getProgramLocation(this.instructionPointer + 1);
                debug(`param1 in immediate mode: ${param1}`);
                // } else if (mode1 === '2') {
                //     param1 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 1) + this.relOffset);
                //     debug(`param1 in relative mode with offset ${this.relOffset}: position ${this.getProgramLocation(this.instructionPointer + 1) + this.relOffset} => ${param1}`);
            }

            if (mode2 === '0') {
                param2 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 2));
                debug(`param2 in position mode: position ${program[this.instructionPointer + 2]} => ${param2}`);
            } else if (mode2 === '1') {
                param2 = this.getProgramLocation(this.instructionPointer + 2);
                debug(`param2 in immediate mode: ${param2}`);
                // } else if (mode2 === '2') {
                //     param2 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 2) + this.relOffset);
                //     debug(`param2 in relative mode: position ${this.getProgramLocation(this.instructionPointer + 2) + this.relOffset} => ${param2}`);
            }

            // if (mode3 === '0') {
            //     param3 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 3));
            //     debug(`param3 in position mode: position ${program[this.instructionPointer + 3]} => ${param3}`);
            // } else if (mode3 === '1') {
            //     param3 = this.getProgramLocation(this.instructionPointer + 3);
            //     debug(`param3 in immediate mode: ${param3}`);
            // } else if (mode3 === '2') {
            //     param3 = this.getProgramLocation(this.getProgramLocation(this.instructionPointer + 3) + this.relOffset);
            //     debug(`param3 in relative mode: position ${this.getProgramLocation(this.instructionPointer + 3) + this.relOffset} => ${param3}`);
            // }

            let storageLocation = -1;
            if (mode3 === '0') {
                storageLocation = this.getProgramLocation(this.instructionPointer + 3);
                // console.log(`this.getProgramLocation(this.instructionPointer) = ${this.getProgramLocation(this.instructionPointer)}`);
                // console.log(`this.getProgramLocation(this.instructionPointer + 1) = ${this.getProgramLocation(this.instructionPointer + 1)}`);
                // console.log(`this.getProgramLocation(this.instructionPointer + 2) = ${this.getProgramLocation(this.instructionPointer + 2)}`);
                // console.log(`this.getProgramLocation(this.instructionPointer + 3) = ${this.getProgramLocation(this.instructionPointer + 3)}`);
                // console.log(`storage location is ${storageLocation}`);
            }
            else { console.log('hmmmmm'); }
            // else if (mode3 === '2') { storageLocation = this.getProgramLocation(this.instructionPointer + 3) + this.relOffset; }

            let goBackToSleep = false;

            switch (opCode) {
                case 1: // add
                    debug(`add ${param1} and ${param2} and store in location ${storageLocation}`);
                    this.program[storageLocation] = param1 + param2;
                    this.instructionPointer += 4;
                    break;

                case 2: // multiply
                debug(`multiply ${param1} and ${param2} and store in location ${storageLocation}`);
                    this.program[storageLocation] = param1 * param2;
                    this.instructionPointer += 4;
                    break;

                case 3: // store
                    if (this.inputs.length === 0) {
                        debug(`no inputs, replenishing with ${this.lastInput}...`);
                        this.inputs.push(this.lastInput);
                        goBackToSleep = true;
                        // break;
                    }

                    storageLocation = -1;
                    if (mode1 === '0') {
                        storageLocation = this.getProgramLocation(this.instructionPointer + 1);
                        // console.log(`storage location is ${storageLocation}`);
                    }

                    debug(`store input ${this.inputs[0]} in location ${storageLocation}`);
                    this.program[storageLocation] = this.inputs.shift();
                    this.instructionPointer += 2;
                    break;

                case 4: // output
                debug(`outputting ${param1}`);
                    this.outputs.push(param1);
                    this.instructionPointer += 2;
                    goBackToSleep = true;
                    break;

                case 5: // jump-if-true
                debug(`if ${param1} !== 0, set instruction pointer to ${param2}`);
                    if (param1 !== 0) { this.instructionPointer = param2; }
                    else { this.instructionPointer += 3; }
                    break;

                case 6: // jump-if-false
                debug(`if ${param1} === 0, set instruction pointer to ${param2}`);
                    if (param1 === 0) { this.instructionPointer = param2; }
                    else { this.instructionPointer += 3; }
                    break;

                case 7: // less than
                debug(`if ${param1} < ${param2}, store 1 in location ${storageLocation}`);
                    if (param1 < param2) { this.program[storageLocation] = 1; }
                    else { this.program[storageLocation] = 0; }
                    this.instructionPointer += 4;
                    break;

                case 8: // equals
                debug(`if ${param1} === ${param2}, store 1 in location ${storageLocation}`);
                    if (param1 === param2) { this.program[storageLocation] = 1; }
                    else { this.program[storageLocation] = 0; }
                    this.instructionPointer += 4;
                    break;

                // case 9: // relative base offset
                //     this.relOffset += param1;
                //     console.log(`adjusted relOffset to ${this.relOffset}`);
                //     this.instructionPointer += 2;
                //     break;

                case 99: // halt
                debug(`halting`);
                    this.halted = true;
                    goBackToSleep = true;
                    break;

                default:
                    console.log(`unknown opcode ${instruction}, ${param1}, ${param2}`);
                    break;
            }

            debug('');

            if (goBackToSleep) {
                break;
            }
        }
    }
}


const hullColors: Map<string, string> = new Map<string, string>();

const robot: Robot = new Robot(program);
robot.addInput(0);

let color = -1;
let turn = -1;

let safety = 100000;

const paintedSquares: Set<string> = new Set<string>();

while (!robot.halted) {
    safety--;
    if (safety === 0) { console.log(`SAFETY`); break; }

    robot.run();
    const output = robot.getOutput();
    if (output.length === 2) {
        robot.clearOutput();
        [color, turn] = output;
        // console.log(`outputs`, color, turn);
        if (color < 0 || color > 1) { console.log(`unknown color ${color}`); break; }
        if (turn < 0 || turn > 1) { console.log(`unknown turn ${turn}`); break; }

        hullColors.set(`${robot.row},${robot.col}`, `${color}`);
        paintedSquares.add(`${robot.row},${robot.col}`);

        if (turn === 0) { robot.turnLeft(); }
        else { robot.turnRight(); }
        robot.move();

        const newColor = parseInt(hullColors.get(`${robot.row},${robot.col}`) || '0');
        robot.addInput(newColor);
    }

    // printGrid();
}

// console.log(robot);
// printGrid();
// console.log(countPainted());
console.log(paintedSquares.size);

// 3809 is too high - should be 2160


function countPainted(): number {
    let count = 0;
    for (let r = -1 * BORDER; r <= BORDER; r++) {
        for (let c = -1 * BORDER; c <= BORDER; c++) {
            if ((hullColors.get(`${r},${c}`) || '0') === '1') { count++; }
        }
    }

    return count;
}

function printGrid() {
    for (let r = -1 * BORDER; r <= BORDER; r++) {
        let row = '';
        for (let c = -1 * BORDER; c <= BORDER; c++) {
            let color = '.';
            if ((hullColors.get(`${r},${c}`) || '0') === '1') { color = '#'; }
            if (r === robot.row && c === robot.col) {
                switch (robot.facing) {
                    case 0: color = '^'; break;
                    case 1: color = '>'; break;
                    case 2: color = 'v'; break;
                    case 3: color = '<'; break;
                    default: color = '?'; break;
                }
            }
            row += color;
        }
        console.log(row);
    }
    console.log();
}
