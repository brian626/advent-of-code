
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

class Sample {
    before: number[];
    instruction: number[];
    after: number[];

    constructor(b: number[]) { // }, i: number[], a: number[]) {
        this.before = b;
        this.instruction = [];
        this.after = [];
    }
}

const samples: Sample[] = [];
let sample: Sample = null;

let parsingInstruction = false;

const program: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Before')) {
        const registers = lines[i].slice(9, -1).split(',').map(x => parseInt(x));
        sample = new Sample(registers);
        parsingInstruction = true;
    } else if (lines[i].startsWith('After')) {
        const registers = lines[i].slice(9, -1).split(',').map(x => parseInt(x));
        sample.after = registers;
        parsingInstruction = false;
        samples.push(sample);
    } else if (parsingInstruction) {
        const instruction = lines[i].split(' ').map(x => parseInt(x));
        sample.instruction = instruction;
    } else {
        program.push(lines[i].split(' ').map(x => parseInt(x.replace(',', ''))));
    }
}

// console.log(samples);

// Work out opcode map
const opcodeMap: Map<number, string[]> = new Map<number, string[]>();
opcodeMap.set(0, ['bani', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr']);
opcodeMap.set(1, ['addr', 'seti']);
opcodeMap.set(2, ['mulr', 'banr', 'bani', 'seti', 'gtir', 'gtri', 'eqri', 'eqrr']);
opcodeMap.set(3, ['addr', 'addi', 'mulr', 'muli']);
opcodeMap.set(4, ['gtri', 'gtrr', 'eqir']);
opcodeMap.set(5, ['banr', 'bani', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr']);
opcodeMap.set(6, ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr']);
opcodeMap.set(7, ['gtri', 'gtrr', 'eqir', 'eqri']);
opcodeMap.set(8, ['banr', 'bani', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr']);
opcodeMap.set(9, ['gtri', 'eqir', 'eqrr']);
opcodeMap.set(10, ['addi', 'mulr', 'muli', 'banr', 'bani', 'bori', 'setr', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqrr']);
opcodeMap.set(11, ['setr', 'gtir']);
opcodeMap.set(12, ['eqir']);
opcodeMap.set(13, ['mulr', 'muli', 'banr', 'bani', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr']);
opcodeMap.set(14, ['gtrr', 'eqir']);
opcodeMap.set(15, ['gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr']);

let q = 0;
while (true) {
    // console.log(opcodeMap);

    let ambiguousOpcode = false;

    for (const [opcode, possibles] of opcodeMap) {
        if (possibles.length > 1) { ambiguousOpcode = true; continue; }

        if (possibles.length === 1) {
            // console.log(`removing ${possibles[0]} from maps`);
            for (const [k, v] of opcodeMap) {
                if (k === opcode) { continue; }

                const ind = v.indexOf(possibles[0]);
                if (ind !== -1) {
                    v.splice(ind, 1);
                    opcodeMap.set(k, v);
                }
            }
        }
    }

    if (!ambiguousOpcode) { break; }
}

// console.log(opcodeMap);

const registers: number[] = [0, 0, 0, 0];
for (const p of program) {
    console.log(p);
    const [opcode, input1, input2, output] = [
        opcodeMap.get(p[0])[0],
        p[1],
        p[2],
        p[3],
    ];

    console.log(`${opcode} ${input1} ${input2} ${output}`);

    switch (opcode) {
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

    console.log(registers);
    console.log();
}

console.log(registers[0]);
