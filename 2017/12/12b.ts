
import { readFileSync } from 'fs';
import { exit } from 'process';

class Program {
    id: string;
    pipes: string[];

    constructor(i: string) {
        this.id = i;
        this.pipes = [];
    }
}

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

const programs: Map<string, Program> = new Map<string, Program>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [id, pipeList] = lines[i].split(' <-> ');

    let program = programs.get(id);
    if (!program) {
        program = new Program(id);
    }

    for (const pipe of pipeList.split(', ')) {
        let pipeProgram = programs.get(pipe);
        if (!pipeProgram) {
            pipeProgram = new Program(pipe);
            pipeProgram.pipes.push(id);
            programs.set(pipe, pipeProgram);
        }

        program.pipes.push(pipe);
        program.pipes = Array.from(new Set<string>(program.pipes));
    }

    programs.set(id, program);
}

// console.log(programs);

let groups = 0;

let programsToEvaluate: string[] = Array.from(programs.keys()).sort((a, b) => a.localeCompare(b));

while (programsToEvaluate.length > 0) {
    const e = programsToEvaluate.shift();
    console.log(e);

    const group = walkGroup([e], new Set<string>());
    console.log(`program ${e} has a group of size ${group.length}`);

    let trimmed: string[] = [];
    for (const p of programsToEvaluate) {
        if (!group.includes(p)) {
            trimmed.push(p);
        }
    }
    programsToEvaluate = trimmed;

    groups++;
}

console.log(groups);


function walkGroup(programList: string[], group: Set<string>): string[] {
    // console.log(`walkGroup([${programList}]), group has ${group.size} members: [${Array.from(group).sort((a,b) => a.localeCompare(b))}]`);
    while (programList.length > 0) {
        const program = programList.shift();
        if (!group.has(program)) {
            group.add(program);
            walkGroup(Array.from(programList.concat(programs.get(program).pipes)), group);
        // } else {
        //     console.log(`skipping ${program}`);
        }
    }

    return Array.from(group);
}

// 1615 is too high
