
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.test', 'utf-8');

const lines = file.split('\n');

const allowedRanges: number[][] = [[0,9]];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [low, high] = lines[i].split('-').map(x => parseInt(x));
    console.log(`considering blacklist ${low}-${high}`);

    for (let i = 0; i < allowedRanges.length; i++) {
        const r = allowedRanges[i];
        const lowIsInRange = (low >= r[0]) && (low <= r[1]);
        const highIsInRange = (high >= r[0]) && (high <= r[1]);
        console.log(lowIsInRange, highIsInRange);

        // if (low > r[0] && high < r[1]) {
        if (lowIsInRange && highIsInRange) {
            // fully enclosed in this range
            console.log(`case a: removing range ${r[0]}-${r[1]} and adding ranges ${r[0]}-${low-1} and ${high + 1}-${r[1]}`);
            allowedRanges.splice(i, 1);
            allowedRanges.push([r[0], low - 1]);
            allowedRanges.push([high + 1, r[1]]);
            break;
        // } else if (lowIsInRange) {
        //     console.log(`case b: removing range ${r[0]}-${r[1]} and adding ranges ${r[0]}-${low-1} and ${high + 1}-${r[1]}`);
        //     allowedRanges.splice(i, 1);
        //     allowedRanges.push([r[0], low - 1]);
        //     break;
        }

        // } else if (low === r[0] && high < r[1]) {
        //     allowedRanges.splice(i, 1);
        //     const rangeMin = Math.max(r[0], high + 1);
        //     const rangeMax = Math.max(r[1], high + 1);
        //     console.log(`case b: removing range ${r[0]}-${r[1]} and adding range ${rangeMin}-${rangeMax}`);
        //     allowedRanges.push([rangeMin, rangeMax]);
        //     break;
        // } else if (low === r[1] && high === r[1]) {
        //     allowedRanges.splice(i, 1);
        //     const rangeMin = Math.max(r[0], low - 1);
        //     const rangeMax = Math.min(r[1], high + 1);
        //     console.log(`case c: removing range ${r[0]}-${r[1]} and adding range ${rangeMin}-${rangeMax}`);
        //     allowedRanges.push([rangeMin, rangeMax]);
        //     break;
        // }
    }
}

allowedRanges.sort((a, b) => a[0] - b[0]);
console.log(allowedRanges);
