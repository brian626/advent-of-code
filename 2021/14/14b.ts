// --- Part Two ---
// The resulting polymer isn't nearly strong enough to reinforce the submarine. You'll need
// to run more steps of the pair insertion process; a total of 40 steps should do it.

// In the above example, the most common element is B (occurring 2192039569602 times) and the
// least common element is H (occurring 3849876073 times); subtracting these produces 2188189693529.

// Apply 40 steps of pair insertion to the polymer template and find the most and least
// common elements in the result. What do you get if you take the quantity of the most
// common element and subtract the quantity of the least common element?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

let template = lines[0];
const rules: Map<string, string> = new Map<string, string>();

for (let i = 1; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const ruleParts = lines[i].split(' ');

    const sourcePair = ruleParts[0];
    const element = ruleParts[2];
    rules.set(sourcePair, element);
}

// console.log(rules);

let polymer: Map<string, number> = new Map<string, number>();

[...rules.keys()].forEach(x => {
    polymer.set(x, 0);
});

for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i+1];
    polymer.set(pair, polymer.get(pair) + 1);
}

// console.log(polymer);

const total: Map<string, number> = new Map<string, number>();
for (let i = 65; i < 91; i++) {
    total.set(String.fromCharCode(i), 0);
}

template.split('').forEach(x => {
    total.set(x, total.get(x) + 1);
});

// console.log(total);

for (let i = 0; i < 40; i++) {
    const tempPolymer = new Map(polymer);
    [...polymer.entries()].filter(([_y,z]) => z > 0).map(([y,_z]) => y).forEach(x => {
        const t1 = x.slice(0,1) + rules.get(x);
        const t2 = rules.get(x) + x.slice(1);

        tempPolymer.set(t1, tempPolymer.get(t1) + polymer.get(x));
        tempPolymer.set(t2, tempPolymer.get(t2) + polymer.get(x));
        tempPolymer.set(x, tempPolymer.get(x) - polymer.get(x));
        total.set(rules.get(x), total.get(rules.get(x)) + polymer.get(x));
    });

    polymer = new Map(tempPolymer);
}

// console.log(polymer);
// console.log(total);

const totalCounts = [...total.values()].filter(x => x > 0);
console.log(Math.max(...totalCounts) - Math.min(...totalCounts));
