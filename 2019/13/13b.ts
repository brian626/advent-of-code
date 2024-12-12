
import { readFileSync } from 'fs';
import { exit } from 'process';

const INPUT = 2;

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

let program: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    program = lines[i].split(',').map(x => parseInt(x));
}

let instructionPointer = 0;
let relOffset = 0;

function debug(s: string): void {
    if (false) {
        console.log(s);
    }
}

function getProgramLocation(l: number): number {
    return program[l] || 0;
}

let outputs: number[] = [];

const grid: string[][] = [];

// play for free
program[0] = 2;
let score = 0;
let inputs: number[] = [];
let ballPos = [0, 0];
let paddlePos = [0, 0];

while (instructionPointer >= 0 && instructionPointer < program.length) {
    let s = '[';
    for (let i = 0; i < program.length; i++) {
        s += `${i}: ${program[i]}, `
    }
    s += ']';
    // debug(s);

    const instruction = program[instructionPointer].toString().padStart(5, '0');
    const opCode = parseInt(instruction.slice(-2));
    debug(`ip: ${instructionPointer}, program[ip]: [${program[instructionPointer]},${program[instructionPointer + 1]},${program[instructionPointer + 2]},${program[instructionPointer + 3]}], opCode ${opCode}`);

    const mode1 = instruction[2], mode2 = instruction[1], mode3 = instruction[0];

    let param1 = 0, param2 = 0, param3 = 0;
    if (mode1 === '0') {
        param1 = getProgramLocation(getProgramLocation(instructionPointer + 1));
        debug(`param1 in position mode: position ${getProgramLocation(instructionPointer + 1)} => ${param1}`);
    } else if (mode1 === '1') {
        param1 = getProgramLocation(instructionPointer + 1);
        debug(`param1 in immediate mode: ${param1}`);
    } else if (mode1 === '2') {
        param1 = getProgramLocation(getProgramLocation(instructionPointer + 1) + relOffset);
        debug(`param1 in relative mode with offset ${relOffset}: position ${getProgramLocation(instructionPointer + 1) + relOffset} => ${param1}`);
    }

    if (mode2 === '0') {
        param2 = getProgramLocation(getProgramLocation(instructionPointer + 2));
        debug(`param2 in position mode: position ${program[instructionPointer + 2]} => ${param2}`);
    } else if (mode2 === '1') {
        param2 = getProgramLocation(instructionPointer + 2);
        debug(`param2 in immediate mode: ${param2}`);
    } else if (mode2 === '2') {
        param2 = getProgramLocation(getProgramLocation(instructionPointer + 2) + relOffset);
        debug(`param2 in relative mode: position ${getProgramLocation(instructionPointer + 2) + relOffset} => ${param2}`);
    }

    if (mode3 === '0') {
        param3 = getProgramLocation(getProgramLocation(instructionPointer + 3));
        debug(`param3 in position mode: position ${program[instructionPointer + 3]} => ${param3}`);
    } else if (mode3 === '1') {
        param3 = getProgramLocation(instructionPointer + 3);
        debug(`param3 in immediate mode: ${param3}`);
    } else if (mode3 === '2') {
        param3 = getProgramLocation(getProgramLocation(instructionPointer + 3) + relOffset);
        debug(`param3 in relative mode: position ${getProgramLocation(instructionPointer + 3) + relOffset} => ${param3}`);
    }

    let storageLocation = -1;

    switch (opCode) {
        case 1: // add
            storageLocation = -1;
            if (mode3 === '0') { storageLocation = getProgramLocation(instructionPointer + 3); }
            else if (mode3 === '1') { console.log('hmmmmm'); }
            else if (mode3 === '2') { storageLocation = getProgramLocation(instructionPointer + 3) + relOffset; }
            debug(`add ${param1} and ${param2} and store in location ${storageLocation}`);
            program[storageLocation] = param1 + param2;
            instructionPointer += 4;
            break;

        case 2: // multiply
            storageLocation = -1;
            if (mode3 === '0') { storageLocation = getProgramLocation(instructionPointer + 3); }
            else if (mode3 === '1') { console.log('hmmmmm'); }
            else if (mode3 === '2') { storageLocation = getProgramLocation(instructionPointer + 3) + relOffset; }
            debug(`multiply ${param1} and ${param2} and store in location ${storageLocation}`);
            program[storageLocation] = param1 * param2;
            instructionPointer += 4;
            break;

        case 3: // store
            if (inputs.length === 0) {
                // console.log(`no inputs`);
                if (ballPos[1] > paddlePos[1]) {
                    // console.log(`tilting paddle right`);
                    inputs.push(1);
                } else if (ballPos[1] < paddlePos[1]) {
                    // console.log(`tilting paddle left`);
                    inputs.push(-1);
                } else {
                    // console.log(`tilting paddle neutral`);
                    inputs.push(0);
                }
            } else {
                storageLocation = -1;
                if (mode1 === '0') { storageLocation = getProgramLocation(instructionPointer + 1); }
                else if (mode1 === '1') { console.log('hmmmmm'); }
                else if (mode1 === '2') { storageLocation = getProgramLocation(instructionPointer + 1) + relOffset; }
                debug(`store input in location ${storageLocation}`);
                program[storageLocation] = inputs.shift();
                instructionPointer += 2;
            }
            break;

        case 4: // output
            debug(`outputting ${param1}`);
            outputs.push(param1);
            if (outputs.length === 3) {
                let x = outputs[0];
                let y = outputs[1];
                let id = outputs[2];
                if (grid[y] === undefined) { grid[y] = []; }

                if (x === -1 && y === 0) {
                    console.log(`score is ${id}`);
                    score = id;
                } else {
                    switch (id) {
                        case 0: grid[y][x] = '.'; break;
                        case 1: grid[y][x] = '|'; break;
                        case 2: grid[y][x] = '#'; break;
                        case 3:
                            grid[y][x] = '_';
                            paddlePos = [y, x];
                            // console.log(`paddle moved to ${y},${x}`);
                            break;
                        case 4:
                            grid[y][x] = 'X';
                            ballPos = [y, x];
                            // console.log(`ball moved to ${y},${x}`);
                            break;
                    }
                }

                outputs = [];
            }
            instructionPointer += 2;
            break;

        case 5: // jump-if-true
            debug(`if ${param1} !== 0, set instruction pointer to ${param2}`);
            if (param1 !== 0) { instructionPointer = param2; }
            else { instructionPointer += 3; }
            break;

        case 6: // jump-if-false
            debug(`if ${param1} === 0, set instruction pointer to ${param2}`);
            if (param1 === 0) { instructionPointer = param2; }
            else { instructionPointer += 3; }
            break;

        case 7: // less than
            storageLocation = -1;
            if (mode3 === '0') { storageLocation = getProgramLocation(instructionPointer + 3); }
            else if (mode3 === '1') { console.log('hmmmmm'); }
            else if (mode3 === '2') { storageLocation = getProgramLocation(instructionPointer + 3) + relOffset; }
            debug(`if ${param1} < ${param2}, store 1 at position ${storageLocation}`);
            if (param1 < param2) { program[storageLocation] = 1; }
            else { program[storageLocation] = 0; }
            instructionPointer += 4;
            break;

        case 8: // equals
            storageLocation = -1;
            if (mode3 === '0') { storageLocation = getProgramLocation(instructionPointer + 3); }
            else if (mode3 === '1') { console.log('hmmmmm'); }
            else if (mode3 === '2') { storageLocation = getProgramLocation(instructionPointer + 3) + relOffset; }
            debug(`if ${param1} === ${param2}, store 1 at position ${storageLocation}`);
            if (param1 === param2) { program[storageLocation] = 1; }
            else { program[storageLocation] = 0; }
            instructionPointer += 4;
            break;

        case 9: // relative base offset
            relOffset += param1;
            debug(`adjusted relOffset to ${relOffset}`);
            instructionPointer += 2;
            break;

        case 99: // halt
            console.log(`halting`);
            // instructionPointer++;
            break;

        default:
            console.log(`unknown opcode ${instruction}, ${param1}, ${param2}`);
            break;
    }

    debug('');

    if (opCode === 99) { break; }
    // printGrid();
}

printGrid();
console.log(`score:`, score);
// console.log(program);


function printGrid(): void {
    for (let y = -2; y < 26; y++) {
        if (grid[y] === undefined) { grid[y] = []; }

        let row = '';
        for (let x = -2; x < 44; x++) {
            row += grid[y][x] || '.';
        }

        console.log(row);
    }

    console.log();
}
