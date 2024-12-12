
import { readFileSync } from 'fs';
import { exit } from 'process';

class Action {
    currentValue: number;
    writeValue: number;
    move: number;
    nextState: string;

    constructor(c: number, w: number, m: number, n: string) {
        this.currentValue = c;
        this.writeValue = w;
        this.move = m;
        this.nextState = n;
    }
}

class State {
    name: string;
    action0: Action;
    action1: Action;

    constructor(n: string, a0: Action, a1: Action) {
        this.name = n;
        this.action0 = a0;
        this.action1 = a1;
    }
}

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

const states: State[] = [];
let checksumAfterSteps = -1;
let beginningStateName = '';
let state: State = null;
let action: Action = null;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Begin')) {
        beginningStateName = lines[i].slice(-2).slice(0,1);
    }

    else if (lines[i].startsWith('Perform')) {
        const matches = /[^\d*](\d+) steps./.exec(lines[i]);
        checksumAfterSteps = parseInt(matches[1]);
    }

    else if (lines[i].startsWith('In ')) {
        const name = lines[i].slice(-2).slice(0, 1);
        state = new State(name, null, null);
    }

    else if (lines[i].startsWith('  If')) {
        const currentValue = parseInt(lines[i].slice(-2).slice(0, 1));
        action = new Action(currentValue, -1, -1, '');
    }

    else if (lines[i].startsWith('    - Write')) {
        const writeValue = parseInt(lines[i].slice(-2).slice(0, 1));
        action.writeValue = writeValue;
    }

    else if (lines[i].startsWith('    - Move')) {
        if (lines[i].endsWith('left.')) {
            action.move = -1;
        } else {
            action.move = 1;
        }
    }

    else if (lines[i].startsWith('    - Continue')) {
        const nextState = lines[i].slice(-2).slice(0, 1);
        action.nextState = nextState;
        if (action.currentValue === 0) {
            state.action0 = action;
        } else if (action.currentValue === 1) {
            state.action1 = action;
            states.push(state);
        }
    }
}

let steps = 0;
let currentState = states.find(x => x.name === beginningStateName);
let values: Map<number, number> = new Map<number, number>();
let position = 0;

console.log(`running for ${checksumAfterSteps} steps`);

while (steps < checksumAfterSteps) {
    if (steps % 100000 === 0) { console.log(steps); }

    const currentValue = values.get(position) || 0;
    let activeAction: Action = null;
    if (currentValue === 0) {
        activeAction = currentState.action0;
    } else {
        activeAction = currentState.action1;
    }

    values.set(position, activeAction.writeValue);
    position += activeAction.move;
    currentState = states.find(x => x.name === activeAction.nextState);

    steps++;

    // printTape(currentState.name, position);
}

console.log(values);
console.log(Array.from(values.values()).filter(x => x === 1).length);

function printTape(n: string, p: number): void {
    let minPosition = Math.min(...values.keys());
    minPosition--;
    let maxPosition = Math.max(...values.keys());
    maxPosition++;

    let s = '... ';
    for (let i = minPosition; i <= maxPosition + 1; i++) {
        s += (i === position) ? ' [' : '  ';
        s += values.get(i) || '0';
        s += (i === position) ? '] ' : '  ';
    }

    s += '... (';
    if (steps === 0) { s += 'before any steps'; }
    else if (steps === 1) { s += `after 1 step`; }
    else { s += `after ${steps} steps`; }

    s += `; about to run state ${n})`;

    console.log(s);
}
