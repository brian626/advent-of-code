
import { readFileSync } from 'fs';
import { exit } from 'process';

class Disc {
    name: string;
    positions: number;
    initialPosition: number;
    currentPosition: number;

    constructor(n: string, p: number, i: number) {
        this.name = n;
        this.positions = p;
        this.initialPosition = i;
        this.currentPosition = i;
    }

    tick(t: number): void {
        this.currentPosition += t;
        if (this.currentPosition >= this.positions) {
            this.currentPosition = (this.currentPosition % this.positions);
        }
    }

    reset(): void {
        this.currentPosition = this.initialPosition;
    }
}

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

const discs: Disc[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)\./.exec(lines[i]);

    discs.push(new Disc(matches[1], parseInt(matches[2]), parseInt(matches[3])));
}

// console.log(discs);

let startTime = 0;

let safety = 10000000;

while (true) {
    safety--;
    if (safety === 0) { console.log(`safety`); break; }

    if (startTime % 1000 === 0) { console.log(startTime); }

    for (const d of discs) {
        d.reset();
    }

    if (getsCapsule(startTime)) {
        break;
    } else {
        startTime++;
    }
}

console.log(startTime);


function getsCapsule(t: number): boolean {
    // console.log();
    // console.log(`Pressing the button at time=${t}...`);

    for (const d of discs) {
        d.tick(t);
    }

    let capsulePosition = 0;
    while (true) {
        for (const d of discs) {
            d.tick(1);
        }

        capsulePosition++;
        const disc = discs.find(x => x.name === capsulePosition.toString());
        if (disc) {
            if (disc.currentPosition != 0) {
                // console.log(`  Capsule reaches disc #${capsulePosition} and bounces off because disc position is ${disc.currentPosition}.`);
                return false;
            } else {
                // console.log(`  Capsule reaches disc #${capsulePosition} and falls through.`);
            }
        } else {
            // console.log(`  Capsule comes out of the machine.`);
            return true;
        }
    }
}
