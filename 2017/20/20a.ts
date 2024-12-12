
import { readFileSync } from 'fs';
import { exit } from 'process';

class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Particle {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;

    constructor(v: number[]) {
        this.position = new Vector(v[0], v[1], v[2]);
        this.velocity = new Vector(v[3], v[4], v[5]);
        this.acceleration = new Vector(v[6], v[7], v[8]);
    }
}

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

const particles: Particle[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /p=<\s*([\d-]+),([\d-]+),([\d-]+)>,\s*v=<\s*([\d-]+),([\d-]+),([\d-]+)>,\s*a=<\s*([\d-]+),([\d-]+),([\d-]+)>/.exec(lines[i]);

    particles.push(new Particle(matches.slice(1,10).map(x => parseInt(x))));
}

// console.log(particles);

const closest: Map<number, number> = new Map<number, number>();

let q = 0;
while (true) {
    let closestDistance = Math.pow(2, 32);
    let closestParticle = -1;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.velocity.x += p.acceleration.x;
        p.velocity.y += p.acceleration.y;
        p.velocity.z += p.acceleration.z;
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        p.position.z += p.velocity.z;

        const distance = Math.abs(p.position.x) + Math.abs(p.position.y) + Math.abs(p.position.z);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestParticle = i;
        }
    }

    if (closest.has(closestParticle)) {
        closest.set(closestParticle, closest.get(closestParticle) + 1);
    } else {
        closest.set(closestParticle, 1);
    }

    if (q % 100 === 0) {
        const closestCount = Math.max(...closest.values());
        for (const [k,v] of closest.entries()) {
            if (v === closestCount) {
                console.log(`Particle ${k} has been closest ${v} times.`);
                break;
            }
        }
    }
    if (q > 10000) { break; }

    q++;
}

// console.log(closest);
const closestCount = Math.max(...closest.values());
for (const [k,v] of closest.entries()) {
    if (v === closestCount) {
        console.log(`Particle ${k} has been closest ${v} times.`);
        break;
    }
}
