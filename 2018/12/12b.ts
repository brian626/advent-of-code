
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

class Note {
    pattern: string;
    result: string;

    constructor(p: string, r: string) {
        this.pattern = p;
        this.result = r;
    }
}

let state: string = '';
const notes: Note[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('initial')) {
        state = lines[i].split(': ')[1];
    } else {
        const [p, r] = lines[i].split(' => ');
        notes.push(new Note(p, r));
    }
}

state = `.....${state}.....`;
let leftmostPot = -5;
// console.log(state);
// console.log(notes);

const GENERATIONS = 50000;

for (let i = 0; i < GENERATIONS; i++) {
    let newState: string[] = ['.', '.'];
    for (let i = 0; i < state.length - 5; i++) {
        let foo = false;
        for (const n of notes) {
            if (n.pattern === state.slice(i, i + 5)) {
                // console.log(`pattern ${n.pattern} matches pot ${i + 2 + leftmostPot}, pot will be ${n.result}`);
                newState[i + 2] = n.result;
                // console.log(newState.join(''));
                foo = true;
                break;
            }
        }

        if (!foo) { newState[i + 2] = '.'; }
        // if (foo) { break; }
        // break;
    }

    // console.log(`before adding dots`);
    // console.log(newState.join(''));

    let leadingDots = 0;
    for (let i = 0; i < newState.length; i++) {
        if (newState[i] === '.') {
            // console.log(`newState[${i}] is a dot`);
            leadingDots++;
        } else {
            // console.log(`newState[${i}] is NOT a dot - it's '${newState[i]}'`);
            break;
        }
    }
    if (leadingDots > 5) {
        newState = newState.slice(leadingDots - 5);
        leftmostPot += (leadingDots - 5);
        leadingDots = 5;
    }
    // console.log(`need to add ${5 - leadingDots} dots`);

    let trailingDots = 0;
    for (let i = newState.length - 1; i >= 0; i--) {
        if (newState[i] === '.') {
            trailingDots++;
        } else {
            break;
        }
    }
    if (trailingDots > 5) { trailingDots = 5; }

    for (let i = 0; i < 5 - leadingDots; i++) {
        // console.log(`prepending a dot`);
        newState.unshift('.');
        leftmostPot--;
    }
    for (let i = 0; i < 5 - trailingDots; i++) {
        // console.log(`appending a dot`);
        newState.push('.');
    }

    // console.log(`after adding dots`);
    // console.log(newState.join(''));

    state = newState.join('');
}

console.log(state);

let sum = 0;

for (let i = 0; i < state.length; i++) {
    if (state[i] === '#') {
        sum += (i + leftmostPot);
    }
}

console.log(sum);
