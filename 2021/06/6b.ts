// Suppose the lanternfish live forever and have unlimited food and space. Would they take over the entire ocean?

// After 256 days in the example above, there would be a total of 26984457539 lanternfish!

import { readFileSync } from 'fs';

const file = readFileSync('./6.input', 'utf-8');

const lines = file.split('\n');
const fish: number[] = lines[0].split(',').map(x => parseInt(x));

let DAYS = 256;

const fishMap: Map<number, number> = new Map<number, number>();

for (let i = 0; i < 9; i++) {
    fishMap.set(i, 0);
}

for (let i = 0; i < fish.length; i++) {
    const currentFishCount = fishMap.get(fish[i]);
    fishMap.set(fish[i], currentFishCount + 1);
}

for (let d = 0; d < DAYS; d++) {
    const newFish = fishMap.has(0) ? fishMap.get(0) : 0;

    for (let i = 0; i < 8; i++) {
        fishMap.set(i, fishMap.has(i+1) ? fishMap.get(i+1) : 0);
    }

    fishMap.set(6, (fishMap.has(6) ? fishMap.get(6) : 0) + newFish);
    fishMap.set(8, newFish);
}

let numFish = 0;
for (let i = 0; i < 9; i++) {
    numFish += fishMap.get(i);
}

console.log(numFish);
