
import { readFileSync } from 'fs';
import { exit } from 'process';
import { findAllPaths } from '../../common/findAllPaths';



const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

let complexity = 0;

const numericKeypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['', '0', 'A'],
];

const numericMaze = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
];

const directionalKeypad = [
    ['', '^', 'A'],
    ['<', 'v', '>'],
];

const directionalMaze = [
    [1, 0, 0],
    [0, 0, 0],
];


for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const code = lines[i];

    const robot1 = codeToSequences(code);
    // console.log(robot1);

    let shortestLen = Infinity;
    let shortestSequence = '';
    for (const r1 of robot1) {
        shortestSequence = r1;
        for (let j = 0; j < 0; j++) {
            // console.log(j, shortestSequence.length);
            shortestSequence = sequenceToSequence(shortestSequence);
        }
        if (shortestSequence.length < shortestLen) {
            shortestLen = shortestSequence.length;
        }
    }

    console.log(shortestLen, parseInt(code.slice(0, -1)));
    complexity += (shortestLen * parseInt(code.slice(0, -1)));
    break;
}

console.log(complexity);

function sequenceToSequence(sequenceInput: string): string {
    let sequenceOutput = '';
    let currentPos = 'A';

    for (let i = 0; i < sequenceInput.length; i++) {
        if (currentPos === 'A') {
            if (sequenceInput[i] === 'A') { sequenceOutput += ''; }
            else if (sequenceInput[i] === '^') { sequenceOutput += '<'; }
            else if (sequenceInput[i] === '<') { sequenceOutput += 'v<<'; }
            else if (sequenceInput[i] === 'v') { sequenceOutput += 'v<'; }
            else if (sequenceInput[i] === '>') { sequenceOutput += 'v'; }
        } else if (currentPos === '^') {
            if (sequenceInput[i] === 'A') { sequenceOutput += '>'; }
            else if (sequenceInput[i] === '^') { sequenceOutput += ''; }
            else if (sequenceInput[i] === '<') { sequenceOutput += 'v<'; }
            else if (sequenceInput[i] === 'v') { sequenceOutput += 'v'; }
            else if (sequenceInput[i] === '>') { sequenceOutput += 'v>'; }
        } else if (currentPos === '<') {
            if (sequenceInput[i] === 'A') { sequenceOutput += '>>^'; }
            else if (sequenceInput[i] === '^') { sequenceOutput += '>^'; }
            else if (sequenceInput[i] === '<') { sequenceOutput += ''; }
            else if (sequenceInput[i] === 'v') { sequenceOutput += '>'; }
            else if (sequenceInput[i] === '>') { sequenceOutput += '>>'; }
        } else if (currentPos === 'v') {
            if (sequenceInput[i] === 'A') { sequenceOutput += '>^'; }
            else if (sequenceInput[i] === '^') { sequenceOutput += '^'; }
            else if (sequenceInput[i] === '<') { sequenceOutput += '<'; }
            else if (sequenceInput[i] === 'v') { sequenceOutput += ''; }
            else if (sequenceInput[i] === '>') { sequenceOutput += '>'; }
        } else if (currentPos === '>') {
            if (sequenceInput[i] === 'A') { sequenceOutput += '^'; }
            else if (sequenceInput[i] === '^') { sequenceOutput += '<^'; }
            else if (sequenceInput[i] === '<') { sequenceOutput += '<<'; }
            else if (sequenceInput[i] === 'v') { sequenceOutput += '<'; }
            else if (sequenceInput[i] === '>') { sequenceOutput += ''; }
        }

        currentPos = sequenceInput[i];
        sequenceOutput += 'A';
    }


    return sequenceOutput;
}

function codeToSequences(code: string): string[] {
    const returnMap: Map<string, string[]> = new Map<string, string[]>();

    let current = [3, 2];

    const allPaths: number[][][][] = [];

    for (let i = 0; i < code.length; i++) {
        const allPaths1a = findAllPaths(numericMaze, current, numericButtonPos(code[i]));
        current = numericButtonPos(code[i]);

        const shortestPathLen1a = Math.min(...allPaths1a.map(x => x.length));
        const allPaths1 = allPaths1a.filter(x => x.length === shortestPathLen1a);
        allPaths[i] = allPaths1;
    }

    let workingSet: string[] = [''];
    for (let i = 0; i < allPaths.length; i++) {
        const newWorkingSet: string[] = [];

        for (let j = 0; j < workingSet.length; j++) {
            for (let k = 0; k < allPaths[i].length; k++) {
                newWorkingSet.push(workingSet[j] + pathToNumericKeypresses(allPaths[i][k]) + 'A');
            }
        }

        workingSet = newWorkingSet;
    }

    returnMap.set(code, workingSet);

    let retArray: string[] = [];
    for (const [_, v] of returnMap) {
        retArray = v;
    }

    return retArray;
}

function pathToNumericKeypresses(path: number[][]): string {
    let keypresses = '';

    for (let i = 1; i < path.length; i++) {
        if (path[i - 1][0] - 1 === path[i][0]) { keypresses += '^'; }
        else if (path[i - 1][0] + 1 === path[i][0]) { keypresses += 'v'; }
        else if (path[i - 1][1] - 1 === path[i][1]) { keypresses += '<'; }
        else if (path[i - 1][1] + 1 === path[i][1]) { keypresses += '>'; }
    }

    // console.log(`pathToNumericKeypresses(${path}): ${keypresses}`);
    return keypresses;
}

function numericButtonPos(button: string): [number, number] {
    switch (button) {
        case '7': return [0, 0];
        case '8': return [0, 1];
        case '9': return [0, 2];
        case '4': return [1, 0];
        case '5': return [1, 1];
        case '6': return [1, 2];
        case '1': return [2, 0];
        case '2': return [2, 1];
        case '3': return [2, 2];
        case '0': return [3, 1];
        case 'A': return [3, 2];
    }
}
