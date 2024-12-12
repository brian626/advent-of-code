
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');

class Instruction {
    code: string;
    register: string;
    offset: number;

    constructor(c: string, r: string, o: number = 0) {
        this.code = c;
        this.register = r;
        this.offset = o;
    }
}

const instructions: Instruction[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [code, part2, part3] = lines[i].split(' ');

    if (code === 'jmp') {
        instructions.push(new Instruction(code, '', parseInt(part2)));
    } else {
        instructions.push(new Instruction(code, part2.replace(',', ''), parseInt(part3) || 0));
    }
}

// console.log(instructions);

const registers: Map<string, number> = new Map<string, number>();

let i = 0;
while (i < instructions.length) {
    const inst = instructions[i];
    const reg = inst.register;
    let curval = registers.get(reg);
    if (curval === undefined) {
        registers.set(reg, 0);
        curval = 0;
    }
    // console.log(`i: ${i} [${inst.code} ${inst.register}, ${inst.offset}], a: ${registers.get('a')}`);

    if (inst.code === 'hlf') {
        registers.set(reg, curval / 2);
    } else if (inst.code === 'tpl') {
        registers.set(reg, curval * 3);
    } else if (inst.code === 'inc') {
        registers.set(reg, curval + 1);
    } else if (inst.code === 'jmp') {
        i += inst.offset;
        continue;
    } else if (inst.code === 'jie') {
        if (curval % 2 === 0) {
            i += inst.offset;
            continue;
        }
    } else if (inst.code === 'jio') {
        if (curval === 1) {
            i += inst.offset;
            continue;
        }
    }

    i++;
}

console.log(registers.get('b'));
