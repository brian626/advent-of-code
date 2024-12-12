
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

// 19, 13, 30 @ -2,  1, -2

class Hailstone {
    px: number;
    py: number;
    pz: number;
    vx: number;
    vy: number;
    vz: number;

    constructor(s: string) {
        const [pParts, vParts] = s.split('@').map(x => x.trim());
        [this.px, this.py, this.pz] = pParts.split(',').map(x => parseInt(x.trim()));
        [this.vx, this.vy, this.vz] = vParts.split(',').map(x => parseInt(x.trim()));
    }

    toString(): string {
        return `${this.px}, ${this.py} @ ${this.vx}, ${this.vy}`;
    }
}

const stones: Hailstone[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    stones.push(new Hailstone(lines[i]));
}

// console.log(stones);

const AREA_MIN = 200000000000000;
const AREA_MAX = 400000000000000;

let count = 0;

for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
        const stoneA = stones[i];
        // console.log(`stoneA: ${stoneA.toString()}`);
        const pointsA = [[stoneA.px, stoneA.py], [stoneA.px + stoneA.vx, stoneA.py + stoneA.vy]];
        // console.log(`pointsA: [${pointsA[0]}, ${pointsA[1]}]`);
        const mA = (pointsA[0][1] - pointsA[1][1]) / (pointsA[0][0] - pointsA[1][0]);
        const bA = pointsA[0][1] - (mA * pointsA[0][0]);
        // console.log(`mA: ${mA}, bA: ${bA}`);

        const stoneB = stones[j];
        const pointsB = [[stoneB.px, stoneB.py], [stoneB.px + stoneB.vx, stoneB.py + stoneB.vy]];
        const mB = (pointsB[0][1] - pointsB[1][1]) / (pointsB[0][0] - pointsB[1][0]);
        const bB = pointsB[0][1] - (mB * pointsB[0][0]);
        // console.log(`mB: ${mA}, bB: ${bA}`);

        const x = (bB - bA) / (mA - mB);
        const y = (mA * x) + bA;

        // console.log(`Stones <${stoneA.toString()}> and <${stoneB.toString()}> will intersect at (${x}, ${y})`);

        if (x >= AREA_MIN && x <= AREA_MAX && y >= AREA_MIN && y <= AREA_MAX) {
            let inFutureA = true;
            if (stoneA.vx > 0 && x < stoneA.px) { inFutureA = false; }
            if (stoneA.vx < 0 && x > stoneA.px) { inFutureA = false; }
            if (stoneA.vy > 0 && y < stoneA.py) { inFutureA = false; }
            if (stoneA.vy < 0 && y > stoneA.py) { inFutureA = false; }

            let inFutureB = true;
            if (stoneB.vx > 0 && x < stoneB.px) { inFutureB = false; }
            if (stoneB.vx < 0 && x > stoneB.px) { inFutureB = false; }
            if (stoneB.vy > 0 && y < stoneB.py) { inFutureB = false; }
            if (stoneB.vy < 0 && y > stoneB.py) { inFutureB = false; }

            if (inFutureA && inFutureB) {
                // console.log(`   count it!`);
                count += 1;
            }
        }
    }
}

console.log(count);
