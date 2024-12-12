
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

class Reindeer {
    name: string;
    speed: number;
    flightDuration: number;
    restDuration: number;
    isFlying: boolean;
    timeUntilSwitch: number;
    travelDistance: number;

    constructor(n: string, s: number, f: number, r: number) {
        this.name = n;
        this.speed = s;
        this.flightDuration = f;
        this.restDuration = r;
        this.isFlying = true;
        this.timeUntilSwitch = f;
        this.travelDistance = 0;
    }
}

const reindeer: Reindeer[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [name, _1, _2, speed, _3, _4, flightDuration, _5, _6, _7, _8, _9, _10, restDuration, _11] = lines[i].split(' ');

    reindeer.push(new Reindeer(name, parseInt(speed), parseInt(flightDuration), parseInt(restDuration)));
}


const SECONDS = 2503;

for (let i = 0; i < SECONDS; i++) {
    for (const r of reindeer) {
        if (r.isFlying) {
            r.travelDistance += r.speed;
        }

        r.timeUntilSwitch -= 1;

        if (r.timeUntilSwitch === 0) {
            if (r.isFlying) {
                r.timeUntilSwitch = r.restDuration;
            } else {
                r.timeUntilSwitch = r.flightDuration;
            }
            r.isFlying = !r.isFlying;
        }
    }
}

console.log(reindeer.map(x => `${x.name} has gone ${x.travelDistance} km and is ${x.isFlying ? 'flying' : 'resting'}.`));

console.log(reindeer.sort((a, b) => b.travelDistance - a.travelDistance)[0].name);
