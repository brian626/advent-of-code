
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');

class Bot {
    posX: number;
    posY: number;
    posZ: number;
    radius: number;

    constructor(x: number, y: number, z: number, r: number) {
        this.posX = x;
        this.posY = y;
        this.posZ = z;
        this.radius = r;
    }
}

const bots: Bot[] = [];

// pos=<1,3,1>, r=1

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /pos=<([\d-]+),([\d-]+),([\d-]+)>, r=(\d+)/.exec(lines[i]);
    // console.log(matches);

    bots.push(new Bot(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])));
}


// console.log(bots);

let strongestBotIndex = -1;
let largestRadius = -1;
for (let i = 0; i < bots.length; i++) {
    const b = bots[i];

    if (b.radius > largestRadius) {
        largestRadius = b.radius;
        strongestBotIndex = i;
    }
}


let numInRange = 0;
for (const b of bots) {
    if (distance(b, bots[strongestBotIndex]) <= largestRadius) {
        numInRange++;
    }
}

console.log(numInRange);


function distance(b1: Bot, b2: Bot): number {
    return Math.abs(b1.posX - b2.posX) +
           Math.abs(b1.posY - b2.posY) +
           Math.abs(b1.posZ - b2.posZ);
}
