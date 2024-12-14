
import { readFileSync } from 'fs';
import { exit } from 'process';

class Instruction {
    op: string;
    input1: string | number;
    input2: string | number;

    constructor(o: string, i1: string | number, i2: string | number) {
        this.op = o;
        this.input1 = i1;
        this.input2 = i2;
    }
}

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

const registers: Map<string, number> = new Map<string, number>();
registers.set('a', 0);
registers.set('b', 0);
registers.set('c', 0);
registers.set('d', 0);

const instructions: Instruction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [o, i1, i2] = lines[i].split(' ');

    const inst = new Instruction(o, null, null);

    if (/[a-z]/.test(i1)) { inst.input1 = i1 as string; }
    else { inst.input1 = parseInt(i1); }

    if (/[a-z]/.test(i2)) { inst.input2 = i2 as string; }
    else { inst.input2 = parseInt(i2); }

    instructions.push(inst);
}


for (let a = 0; a < 1000; a++) {
    console.log(`Intializing register a to ${a}`);
    registers.set('a', a);

    let x = 0;

    let iterations = 0;
    let lastOutput = -1;
    let bailedEarly = false;
    while (x < instructions.length) {
        iterations++;
        if (iterations === 100000) { console.log(`SAFETY`); break; }

        const i = instructions[x];
        // console.log(i.op, i.input1, i.input2 === undefined ? '' : i.input2);

        switch (i.op) {
            case 'out':
                let output = -1;
                if (typeof (i.input1) === 'string') {
                    output = registers.get(i.input1);
                } else {
                    output = i.input1;
                }

                console.log(`Iteration ${iterations}: output is ${output}`);
                if (lastOutput === -1) {
                    lastOutput = output;
                } else if (lastOutput === output) {
                    console.log(`Saw the same output twice in a row...`);
                    x = instructions.length;
                    bailedEarly = true;
                } else {
                    lastOutput = output;
                }
                break;

            case 'cpy':
                if (typeof (i.input2) !== 'string') {
                    console.log(`  invalid instruction!`);
                    break;
                }
                else if (typeof (i.input1) === 'string') {
                    registers.set(i.input2 as string, registers.get(i.input1));
                } else {
                    registers.set(i.input2 as string, i.input1);
                }
                break;

            case 'inc':
                registers.set(i.input1 as string, registers.get(i.input1 as string) + 1);
                break;

            case 'dec':
                registers.set(i.input1 as string, registers.get(i.input1 as string) - 1);
                break;

            case 'jnz':
                if (typeof (i.input1) === 'string') {
                    if (registers.get(i.input1) !== 0) {
                        if (typeof (i.input2) === 'string') {
                            x += registers.get(i.input2) - 1;
                        } else {
                            x += i.input2 - 1;
                        }
                    }
                } else {
                    if (i.input1 !== 0) {
                        if (typeof (i.input2) === 'string') {
                            x += registers.get(i.input2) - 1;
                        } else {
                            x += i.input2 - 1;
                        }
                    }
                }
                // console.log(`  jumped to ${x + 1}`);
                break;

            case 'tgl':
                const offsetReg = i.input1 as string;
                const offset = registers.get(offsetReg);
                if ((x + offset) < 0 || (x + offset) >= instructions.length) { break; }

                const toggleInstruction = instructions[x + offset];
                switch (toggleInstruction.op) {
                    case 'inc': toggleInstruction.op = 'dec'; break;
                    case 'dec': toggleInstruction.op = 'inc'; break;
                    case 'tgl': toggleInstruction.op = 'inc'; break;
                    case 'jnz': toggleInstruction.op = 'cpy'; break;
                    case 'cpy': toggleInstruction.op = 'jnz'; break;
                    default: console.log(`wtf`); break;
                }

                instructions[x + offset] = toggleInstruction;

                break;
        }

        // console.log(registers);
        // console.log(instructions)
        // console.log();

        x++;
    }

    if (!bailedEarly) { console.log(`SUCCESS WITH a = ${a}`)};
    console.log();
}
