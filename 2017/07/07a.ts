
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

class Program {
    name: string;
    weight: number;
    parent: string;
    children: string[];

    constructor(n: string, w: number) {
        this.name = n;
        this.weight = w;
        this.parent = null;
        this.children = [];
    }
}

const lines = file.split('\n');

// ktlj (57)
// fwft (72) -> ktlj, cntj, xhth

const programs: Map<string, Program> = new Map<string, Program>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [program, childList] = lines[i].split(' -> ');
    const [programName, programWeight] = program.split(' ');
    let parentProgram: Program = programs.get(programName);
    if (!parentProgram) {
        parentProgram = new Program(programName, parseInt(programWeight.replace(/[()]/g, '')));
    } else if (parentProgram.weight === -1) {
        parentProgram.weight = parseInt(programWeight.replace(/[()]/g, ''));
    }
    programs.set(programName, parentProgram);

    if (childList) {
        const children = childList.split(', ');
        for (const c of children) {
            let childProgram = programs.get(c);
            if (!childProgram) {
                childProgram = new Program(c, -1);
            }
            childProgram.parent = parentProgram.name;
            programs.set(c, childProgram);
        }

        parentProgram.children = children;
    }
}

// console.log(programs);

for (const [n, p] of programs) {
    if (p.parent === null) {
        console.log(n);
        break;
    }
}
