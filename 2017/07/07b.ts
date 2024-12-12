
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

class Program {
    name: string;
    weight: number;
    parent: string;
    children: string[];
    stackWeight: number;
    balanced: boolean;

    constructor(n: string, w: number) {
        this.name = n;
        this.weight = w;
        this.parent = null;
        this.children = [];
        this.stackWeight = 0;
        this.balanced = false;
    }
}

const lines = file.split('\n');

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


let rootProgram = null;

for (const [n, p] of programs) {
    if (p.parent === null) {
        rootProgram = p;
        // console.log(n);
        break;
    }
}


rootProgram.stackWeight = getStackWeight(rootProgram);

// let programsToCheck: Program[] = [rootProgram];

// while (programsToCheck.length > 0) {
//     console.log(programsToCheck.length);
//     // console.log(programsToCheck);
//     console.log(programsToCheck.map(x => x.name));
//     const programToCheck = programsToCheck.shift();
//     if (!isBalanced(programToCheck)) {
//         console.log(`${programToCheck.name} is not balanced`);
//         programToCheck.balanced = false;
//     } else {
//         programToCheck.balanced = true;
//     }

//     for (const c of programToCheck.children) {
//         programsToCheck.push(programs.get(c));
//     }
// }

// console.log(programs);


let programsToCheck: Program[] = [];
for (const [_name, program] of programs) {
    if (program.children.length === 0) {
        programsToCheck.push(program);
    }
}

let unbalancedProgram: Program = null;
while (programsToCheck.length > 0) {
    const p = programsToCheck.shift();
    if (isBalanced(p)) {
        programsToCheck.push(programs.get(p.parent));
    } else {
        console.log(`${p.name} is not balanced`);
        unbalancedProgram = p;
        break;
    }
}

const weightMap: Map<number, number> = new Map<number, number>();
for (const c of unbalancedProgram.children) {
    const child = programs.get(c);
    const w = child.weight + child.stackWeight;
    if (weightMap.has(w)) {
        weightMap.set(w, weightMap.get(w) + 1);
    } else {
        weightMap.set(w, 1);
    }
}

let uniqueWeight = 0, commonWeight = 0;
for (const [k, v] of weightMap) {
    if (v === 1) {
        uniqueWeight = k;
    } else {
        commonWeight = k;
    }
}

const weightDelta = Math.abs(uniqueWeight - commonWeight);

for (const [_name, program] of programs) {
    if (program.weight + program.stackWeight === uniqueWeight) {
        console.log(program.weight - weightDelta);
        break;
    }
}


function isBalanced(p: Program): boolean {
    if (p.children.length === 0 || p.balanced) { return true; }

    console.log(`checking if ${p.name} is balanced`);
    const childWeights: Map<number, number> = new Map<number, number>();
    for (const c of p.children) {
        const child = programs.get(c);
        console.log(`   ${child.name} + stack = ${child.weight} + ${child.stackWeight} = ${child.weight + child.stackWeight}`);
        const w = child.weight + child.stackWeight;
        if (childWeights.has(w)) {
            childWeights.set(w, childWeights.get(w) + 1);
        } else {
            childWeights.set(w, 1);
        }
    }

    console.log(`weights of ${p.name}'s children are ${Array.from(childWeights.keys())}`);
    return childWeights.size === 1;
}


// console.log(programs);

// let programsToCheck: Program[] = [];
// const programSet: Set<string> = new Set<string>();
// for (const [name, program] of programs) {
//     if (program.children.length === 0) {
//         programSet.add(program.parent);
//     }
// }
// programsToCheck = Array.from(programSet).map(x => programs.get(x));
// console.log(`starting with leaf parents: [${programsToCheck.map(x => [x.name, x.weight + x.stackWeight])}]`);

// while (programsToCheck.length > 0) {
//     const programWeights: number[] = programsToCheck.map(x => x.weight + x.stackWeight);
//     console.log(programWeights);

//     const weightCounts: Map<number, number> = new Map<number, number>();
//     for (const w of programWeights) {
//         if (weightCounts.get(w)) {
//             weightCounts.set(w, weightCounts.get(w) + 1);
//         } else {
//             weightCounts.set(w, 1);
//         }
//     }

//     if (weightCounts.size > 1) {
//         console.log(weightCounts);
//     }

//     exit();
// }

// while (programsToCheck.length > 0) {
//     const p = programsToCheck.shift();

//     if (p.children.length > 0) {
//         const childWeights = p.children.map(x => programs.get(x).stackWeight + programs.get(x).weight);
//         console.log(childWeights);
//         const weightsCount: Map<number, number> = new Map<number, number>();
//         for (const w of childWeights) {
//             if (weightsCount.get(w)) {
//                 weightsCount.set(w, weightsCount.get(w) + 1);
//             } else {
//                 weightsCount.set(w, 1);
//             }
//         }

//         if (weightsCount.size > 1) {
//             let commonWeight = 0;
//             let uniqueWeight = 0;
//             for (const [k, v] of weightsCount) {
//                 if (v === 1)  { uniqueWeight = k; }
//                 else { commonWeight = k; }
//             }
//             const weightDelta = Math.abs(commonWeight - uniqueWeight);
//             console.log(`delta is ${weightDelta}`);

//             for (const [name, program] of programs) {
//                 if (program.stackWeight === uniqueWeight) {
//                     console.log(program);
//                     console.log(program.weight - weightDelta);
//                     exit();
//                 }
//             }
//         } else {
//             for (const c of p.children) {
//                 programsToCheck.push(programs.get(c));
//             }
//         }
//     }
// }


function getStackWeight(p: Program): number {
    // console.log(`getting stack weight for ${p.name}`);
    let stackWeight = 0;

    if (p.children.length > 0) {
        // console.log(`   recursing`);
        for (const c of p.children) {
            const child = programs.get(c);
            stackWeight += child.weight + getStackWeight(child)
        }
    // } else {
    //     stackWeight = p.weight;
    }

    // console.log(`   returning ${stackWeight} for ${p.name}`);
    p.stackWeight = stackWeight;
    programs.set(p.name, p);
    return stackWeight;
}
