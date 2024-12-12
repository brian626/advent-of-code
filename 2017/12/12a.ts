
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

let connectedPrograms: Set<string> = new Set<string>();
for (const [name, program] of programs) {
    console.log(`evaluating ${name}`);
    if (!connectedPrograms.has(name)) {
        if (name === '0') {
            connectedPrograms.add(name);
        } else if (program.pipes.includes('0')) {
            connectedPrograms.add(name);
        } else {
            const checkedPrograms: string[] = [name];
            let programsToCheck: string[] = program.pipes;
            while (programsToCheck.length > 0) {
                const c = programsToCheck.pop();
                if (connectedPrograms.has(c)) {
                    connectedPrograms.add(name);
                    break;
                } else {
                    for (const p of programs.get(c).pipes) {
                        if (!checkedPrograms.includes(p)) {
                            checkedPrograms.push(p);
                            programsToCheck = programsToCheck.concat(programs.get(c).pipes);
                        }
                    }
                }
            }
        }
    }
}

console.log(connectedPrograms.size);
