
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.test', 'utf-8');

const lines = file.split('\n');

let stones: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    stones = lines[i].split(' ').map(x => parseInt(x));
}

const BLINKS = 12;

console.log(`Initial arrangement:`);
console.log(stones.join(' '));
console.log();


let s = '';
for (let i = 0; i < BLINKS; i++) {
    const newStones: number[] = [];
    for (let j = 0; j < stones.length; j++) {
        if (stones[j] === 0) {
            newStones.push(1);
        } else if (stones[j].toString().length % 2 === 0) {
            const stoneStr = stones[j].toString();
            const newStone1 = parseInt(stoneStr.slice(0, stoneStr.length / 2));
            const newStone2 = parseInt(stoneStr.slice(stoneStr.length / 2));
            newStones.push(newStone1)
            newStones.push(newStone2)
        } else {
            newStones.push(stones[j] * 2024);
        }
    }

    stones = newStones;

    console.log(`After ${i + 1} blinks:`);
    // if (stones.filter(x => x >= 10).length === 0) {
        console.log(stones.join(', '));
    //     // console.log(stones.length);
        console.log();
    // }
    s += stones.length + ',';
}

console.log(s.slice(0, -1));
// console.log(stones.length);
console.log();
