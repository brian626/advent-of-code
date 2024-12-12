
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
    }
}

// console.log(samples);

let count = 0;
for (const s of samples) {
    if (behavesLike(s) >= 3) {
        count++;
    }
}

console.log(count);


function behavesLike(s: Sample): number {
    let opcodes: string[] = [];

    // addr
    if (s.before[s.instruction[1]] + s.before[s.instruction[2]] === s.after[s.instruction[3]]) { opcodes.push('addr'); }

    // addi
    if (s.before[s.instruction[1]] + s.instruction[2] === s.after[s.instruction[3]]) { opcodes.push('addi'); }

    // mulr
    if (s.before[s.instruction[1]] * s.before[s.instruction[2]] === s.after[s.instruction[3]]) { opcodes.push('mulr'); }

    // muli
    if (s.before[s.instruction[1]] * s.instruction[2] === s.after[s.instruction[3]]) { opcodes.push('muli'); }

    // banr
    if ((s.before[s.instruction[1]] & s.before[s.instruction[2]]) === s.after[s.instruction[3]]) { opcodes.push('banr'); }

    // bani
    if ((s.before[s.instruction[1]] & s.instruction[2]) === s.after[s.instruction[3]]) { opcodes.push('bani'); }

    // borr
    if ((s.before[s.instruction[1]] | s.before[s.instruction[2]]) === s.after[s.instruction[3]]) { opcodes.push('borr'); }

    // bori
    if ((s.before[s.instruction[1]] | s.instruction[2]) === s.after[s.instruction[3]]) { opcodes.push('bori'); }

    // setr
    if (s.before[s.instruction[1]] === s.after[s.instruction[3]]) { opcodes.push('setr'); }

    // seti
    if (s.instruction[1] === s.after[s.instruction[3]]) { opcodes.push('seti'); }

    // gtir
    if ((s.instruction[1] > s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 1) { opcodes.push('gtir'); }
    if ((s.instruction[1] <= s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 0) { opcodes.push('gtir'); }

    // gtri
    if ((s.before[s.instruction[1]] > s.instruction[2]) && s.after[s.instruction[3]] === 1) { opcodes.push('gtri'); }
    if ((s.before[s.instruction[1]] <= s.instruction[2]) && s.after[s.instruction[3]] === 0) { opcodes.push('gtri'); }

    // gtrr
    if ((s.before[s.instruction[1]] > s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 1) { opcodes.push('gtrr'); }
    if ((s.before[s.instruction[1]] <= s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 0) { opcodes.push('gtrr'); }

    // eqir
    if ((s.instruction[1] === s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 1) { opcodes.push('eqir'); }
    if ((s.instruction[1] !== s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 0) { opcodes.push('eqir'); }

    // eqri
    if ((s.before[s.instruction[1]] === s.instruction[2]) && s.after[s.instruction[3]] === 1) { opcodes.push('eqri'); }
    if ((s.before[s.instruction[1]] !== s.instruction[2]) && s.after[s.instruction[3]] === 0) { opcodes.push('eqri'); }

    // eqrr
    if ((s.before[s.instruction[1]] === s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 1) { opcodes.push('eqrr'); }
    if ((s.before[s.instruction[1]] !== s.before[s.instruction[2]]) && s.after[s.instruction[3]] === 0) { opcodes.push('eqrr'); }

    console.log(s);
    console.log(`Sample with opcode ${s.instruction[0]} behaves like ${opcodes.length} opcodes: [${opcodes.map(x => `'${x}'`).join(', ')}]`);
    console.log();

    return opcodes.length;
}


// 553 is too low
