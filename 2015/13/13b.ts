
import { readFileSync } from 'fs';
import { exit } from 'process';
import { permutations } from '../../common/permutations';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

const seatingMap: Map<string, number> = new Map<string, number>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [person1, _1, gainOrLoss, amountString, _2, _3, _4, _5, _6, _7, person2] = lines[i].split(' ');
    let amount = parseInt(amountString);

    if (gainOrLoss === 'lose') {
        amount *= -1;
    }

    seatingMap.set(`${person1}:${person2.slice(0, -1)}`, amount);
}

const peopleSet: Set<string> = new Set<string>();
for (const [k, _v] of seatingMap) {
    peopleSet.add(k.split(':')[0]);
}

for (const p of peopleSet) {
    seatingMap.set(`${p}:Me`, 0);
    seatingMap.set(`Me:${p}`, 0);
}

peopleSet.add('Me');

const perms = permutations(peopleSet);

// console.log(seatingMap);
// console.log(perms);

let maxHappiness = 0;

for (const p of perms) {
    maxHappiness = Math.max(maxHappiness, calculateHappiness(p));
}

console.log(maxHappiness);


function calculateHappiness(people: string[]): number {
    let h = 0;

    for (let i = 0; i < people.length; i++) {
        if (i === 0) {
            h += seatingMap.get(`${people[i]}:${people[people.length - 1]}`);
            h += seatingMap.get(`${people[i]}:${people[i + 1]}`);
        } else if (i === people.length - 1) {
            h += seatingMap.get(`${people[i]}:${people[i - 1]}`);
            h += seatingMap.get(`${people[i]}:${people[0]}`);
        } else {
            h += seatingMap.get(`${people[i]}:${people[i - 1]}`);
            h += seatingMap.get(`${people[i]}:${people[i + 1]}`);
        }
    }

    return h;
}
