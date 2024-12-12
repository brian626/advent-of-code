
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

class Step {
    name: string;
    descendents: string[];
    prerequisites: string[];
}

const lines = file.split('\n');

const steps: Map<string, Step> = new Map<string, Step>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [_1, p, _2, _3, _4, _5, _6, d, _7, _8] = lines[i].split(' ');

    let prerequisite: Step;
    if (steps.has(p)) {
        prerequisite = steps.get(p);
        prerequisite.descendents.push(d);
    } else {
        prerequisite = new Step();
        prerequisite.name = p;
        prerequisite.descendents = [d];
        prerequisite.prerequisites = [];
    }
    steps.set(p, prerequisite);

    let descendant: Step;
    if (steps.has(d)) {
        descendant = steps.get(d);
        descendant.prerequisites.push(p);
    } else {
        descendant = new Step();
        descendant.name = d;
        descendant.descendents = [];
        descendant.prerequisites = [p];
    }
    steps.set(d, descendant);
}

// console.log(steps);

const availableSteps: Step[] = [];
for (const [_name, step] of steps) {
    if (step.prerequisites.length === 0) {
        availableSteps.push(step);
    }
}
const completedSteps: Step[] = [];


class Worker {
    name: string;
    currentStep: Step;
    timeLeft: number;

    constructor(n: string) {
        this.name = n;
        this.currentStep = null;
        this.timeLeft = 0;
    }

    assignStep(s: Step) {
        this.currentStep = s;
        this.timeLeft = s.name.charCodeAt(0) - 'A'.charCodeAt(0) + 61;
    }

    work(): boolean {
        this.timeLeft -= 1;
        return this.timeLeft === 0;
    }
}

// const workers: Worker[] = [new Worker('1'), new Worker('2')];
const workers: Worker[] = [new Worker('1'), new Worker('2'), new Worker('3'), new Worker('4'), new Worker('5')];


// console.log(availableSteps);
let time = 0;

console.log(`Second   Worker 1   Worker 2   Worker 3   Worker 4   Worker 5   Done`);

while (completedSteps.length !== steps.size) {
    if (availableSteps.length > 0) {
        availableSteps.sort((a, b) => a.name.localeCompare(b.name));
        console.log(`available steps are ${availableSteps.map(x => x.name)}`);
    }

    const stepsAssigned: number[] = [];
    for (let i = 0; i < availableSteps.length; i++) {
        if (arePrerequisitesCompleted(availableSteps[i])) {
            console.log(`  assigning step ${availableSteps[i].name} to a worker`);

            if (!workers[0].currentStep)      { workers[0].assignStep(availableSteps[i]); stepsAssigned.push(i); }
            else if (!workers[1].currentStep) { workers[1].assignStep(availableSteps[i]); stepsAssigned.push(i); }
            else if (!workers[2].currentStep) { workers[2].assignStep(availableSteps[i]); stepsAssigned.push(i); }
            else if (!workers[3].currentStep) { workers[3].assignStep(availableSteps[i]); stepsAssigned.push(i); }
            else if (!workers[4].currentStep) { workers[4].assignStep(availableSteps[i]); stepsAssigned.push(i); }
            else { console.log(`  UH OH`); }
        } else {
            // console.log(`  NOT assigning step ${availableSteps[i].name} to a worker`);
        }
    }
    // console.log(`  steps assigned: ${stepsAssigned}`);
    for (let i = stepsAssigned.length - 1; i >= 0; i--) {
        // console.log(`  removing step ${stepsAssigned[i]} from available steps`);
        availableSteps.splice(stepsAssigned[i], 1);
    }

    debug(time);

    // console.log(`  working...`);
    if (workers[0].work()) { completeStep(workers[0].currentStep); workers[0].currentStep = null; }
    if (workers[1].work()) { completeStep(workers[1].currentStep); workers[1].currentStep = null; }
    if (workers[2].work()) { completeStep(workers[2].currentStep); workers[2].currentStep = null; }
    if (workers[3].work()) { completeStep(workers[3].currentStep); workers[3].currentStep = null; }
    if (workers[4].work()) { completeStep(workers[4].currentStep); workers[4].currentStep = null; }

    time++;
}

console.log(completedSteps.map(x => x.name).join(''));

function completeStep(s: Step): void {
    console.log(`  step ${s.name} has been completed`);
    completedSteps.push(s);
    for (const d of s.descendents) {
        if (!availableSteps.includes(steps.get(d))) {
            availableSteps.push(steps.get(d));
        }
    }
}

function arePrerequisitesCompleted(step: Step): boolean {
    let prerequisitesCompleted = true;
    for (const p of step.prerequisites) {
        if (!completedSteps.includes(steps.get(p))) {
            prerequisitesCompleted = false;
            break;
        }
    }

    return prerequisitesCompleted;
}


function debug(t: number): void {
    console.log(`   ${t}        ${workers[0].currentStep?.name || '.'}          ${workers[1].currentStep?.name || '.'}          ${workers[2].currentStep?.name || '.'}          ${workers[3].currentStep?.name || '.'}          ${workers[4].currentStep?.name || '.'}       ${completedSteps.map(x => x.name).join('')}`);
}
