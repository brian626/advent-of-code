
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

class Moon {
    posX: number;
    posY: number;
    posZ: number;
    velX: number;
    velY: number;
    velZ: number;

    constructor(x: number, y: number, z: number) {
        this.posX = x;
        this.posY = y;
        this.posZ = z;
        this.velX = 0;
        this.velY = 0;
        this.velZ = 0;
    }
}

const moons: Moon[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [posX, posY, posZ] = lines[i].slice(1, -1).split(',').map(x => parseInt(x.split('=')[1]));

    moons.push(new Moon(posX, posY, posZ));
}

const STEPS = 1000;

for (let i = 0; i < STEPS; i++) {
    // console.log(`After ${i} steps:`);
    // console.log(moons);

    // Apply gravity
    for (let m = 0; m < moons.length; m++) {
        let velX = 0, velY = 0, velZ = 0;

        for (let n = 0; n < moons.length; n++) {
            if (m === n) { continue; }

            // console.log(`comparing moon ${m} posX <${moons[m].posX}> and moon ${n} posX <${moons[n].posX}>`);
            if (moons[m].posX < moons[n].posX) { velX += 1; }
            else if (moons[m].posX > moons[n].posX) { velX -= 1; }

            if (moons[m].posY < moons[n].posY) { velY += 1; }
            else if (moons[m].posY > moons[n].posY) { velY -= 1; }

            if (moons[m].posZ < moons[n].posZ) { velZ += 1; }
            else if (moons[m].posZ > moons[n].posZ) { velZ -= 1; }
        }

        moons[m].velX += velX;
        moons[m].velY += velY;
        moons[m].velZ += velZ;
        // console.log(`set moon ${m} velocity to ${velX}, ${velY}, ${velZ}`);
    }

    // Apply velocity
    for (let m = 0; m < moons.length; m++) {
        moons[m].posX += moons[m].velX;
        moons[m].posY += moons[m].velY;
        moons[m].posZ += moons[m].velZ;
    }

    // console.log();
}

let totalEnergy = 0;

for (let i = 0; i < moons.length; i++) {
    const moon = moons[i];
    const pe = Math.abs(moon.posX) + Math.abs(moon.posY) + Math.abs(moon.posZ);
    const ke = Math.abs(moon.velX) + Math.abs(moon.velY) + Math.abs(moon.velZ);
    // console.log(pe, ke);
    totalEnergy += pe * ke;
}

console.log(totalEnergy);
