
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

// Step C must be finished before step A can begin.

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

console.log(steps);

const availableSteps: Step[] = [];
for (const [_name, step] of steps) {
    if (step.prerequisites.length === 0) {
        availableSteps.push(step);
    }
}
const completedSteps: Step[] = [];

// console.log(availableSteps);
while (availableSteps.length > 0) {
    availableSteps.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`available steps are ${availableSteps.map(x => x.name)}`);
    let step = availableSteps.shift();
    while (!arePrerequisitesCompleted(step)) {
        console.log(`  step ${step.name} can't be completed (prereqs are ${step.prerequisites}), moving on`);
        availableSteps.push(step);
        step = availableSteps.shift();
    }
    console.log(`  trying to complete step ${step.name}`);

    completedSteps.push(step);
    for (const d of step.descendents) {
        if (!availableSteps.includes(steps.get(d))) {
            availableSteps.push(steps.get(d));
        }
    }
}

console.log(completedSteps.map(x => x.name).join(''));


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
