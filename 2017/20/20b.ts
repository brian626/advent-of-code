
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
    toBeDestroyed: boolean;
    destroyed: boolean;

    constructor(v: number[]) {
        this.position = new Vector(v[0], v[1], v[2]);
        this.velocity = new Vector(v[3], v[4], v[5]);
        this.acceleration = new Vector(v[6], v[7], v[8]);
        this.toBeDestroyed = false;
        this.destroyed = false;
    }
}

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

const particles: Particle[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /p=<\s*([\d-]+),([\d-]+),([\d-]+)>,\s*v=<\s*([\d-]+),([\d-]+),([\d-]+)>,\s*a=<\s*([\d-]+),([\d-]+),([\d-]+)>/.exec(lines[i]);

    particles.push(new Particle(matches.slice(1, 10).map(x => parseInt(x))));
}

// console.log(particles);


let q = 0;
while (true) {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.destroyed) { continue; }
        p.velocity.x += p.acceleration.x;
        p.velocity.y += p.acceleration.y;
        p.velocity.z += p.acceleration.z;
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        p.position.z += p.velocity.z;

    }

    for (let i = 0; i < particles.length; i++) {
        for (let j = 0; j < particles.length; j++) {
            if (i === j) { continue; }
            const p1 = particles[i];
            const p2 = particles[j];
            if (p1.destroyed || p2.destroyed) { continue; }

            if (p1.position.x === p2.position.x &&
                p1.position.y === p2.position.y &&
                p1.position.z === p2.position.z) {
                p1.toBeDestroyed = true;
                p2.toBeDestroyed = true;
            }
        }
    }

    for (const p of particles) {
        if (p.toBeDestroyed) { p.destroyed = true; }
    }

    if (q % 100 === 0) {
        const remaining = particles.filter(x => !x.destroyed).length;
        console.log(`there are ${remaining} particles remaining`);
    }
    if (q > 1000) { break; }

    q++;
}

const remaining = particles.filter(x => !x.destroyed).length;
console.log(`there are ${remaining} particles remaining`);
