
import { readFileSync } from 'fs';
import { exit } from 'process';

const BIGNUM = Math.pow(2, 32);

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

const network: Map<string, string> = new Map<string, string>();

const initial: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    initial.push(lines[i]);
}

const height = initial.length;
const heightOffset = Math.floor(height / 2);
const width = initial[0].length;
const widthOffset = Math.floor(width / 2);

for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
        network.set(`${r - heightOffset},${c - widthOffset}`, initial[r][c]);
    }
}


let carrierX = 0, carrierY = 0;
const BURSTS = 10000000;
let infectionBursts = 0;
let direction = 0; // 0: up, 1: right, 2: down, 3: left

// printNetwork();

for (let i = 0; i < BURSTS; i++) {
    if (i % 100000 === 0) { console.log(i); }
    // console.log(`burst #${i+1}`);
    // Decide which way to turn based on the current node:
    // If it is clean, it turns left.
    if (isClean(carrierX, carrierY)) {
        // console.log(`  node is clean, turning left`);
        direction -= 1;
        if (direction === -1) { direction = 3; }
    }

    // If it is weakened, it does not turn, and will continue moving in the same direction.
    else if (isWeakened(carrierX, carrierY)) {
        // console.log(`  node is weaking, not turning`);
    }

    // If it is infected, it turns right.
    else if (isInfected(carrierX, carrierY)) {
        // console.log(`  node is infected, turning right`);
        direction += 1;
        if (direction === 4) { direction = 0; }
    }

    // If it is flagged, it reverses direction, and will go back the way it came.
    else if (isFlagged(carrierX, carrierY)) {
        // console.log(`  node is flagged, turning around`);
        direction += 2;
        if (direction === 4) { direction = 0; }
        else if (direction === 5) { direction = 1; }
    }

    // Modify the state of the current node, as described above.
    infectionBursts += toggle(carrierX, carrierY);

    // The virus carrier moves forward one node in the direction it is facing.
    switch (direction) {
        case 0:
            // console.log(`  moving up`);
            carrierY -= 1;
            break;
        case 1:
            // console.log(`  moving right`);
            carrierX += 1;
            break;
        case 2:
            // console.log(`  moving down`);
            carrierY += 1;
            break;
        case 3:
            // console.log(`  moving left`);
            carrierX -= 1;
            break;
        default:
            break;
    }

    // printNetwork();
}

// printNetwork();
console.log(infectionBursts);

function isInfected(x: number, y: number): boolean {
    return network.get(`${y},${x}`) === '#';
}

function isClean(x: number, y: number): boolean {
    return !network.has(`${y},${x}`) || network.get(`${y},${x}`) === '.';
}

function isWeakened(x: number, y: number): boolean {
    return network.get(`${y},${x}`) === 'W';
}

function isFlagged(x: number, y: number): boolean {
    return network.get(`${y},${x}`) === 'F';
}

function toggle(x: number, y: number): number {
    // Clean nodes become weakened.
    // Weakened nodes become infected.
    // Infected nodes become flagged.
    // Flagged nodes become clean.

    const currentState = network.get(`${y},${x}`) || '.';
    let newState = '?';

    switch (currentState) {
        case '.': newState = 'W'; break;
        case 'W': newState = '#'; break;
        case '#': newState = 'F'; break;
        case 'F': newState = '.'; break;
        // default: console.log(`wtf state is ${currentState}`); break;
    }

    network.set(`${y},${x}`, newState);

    // console.log(`  toggled [${y},${x}], returning ${isInfected(x, y) ? 1 : 0}`);
    return isInfected(x, y) ? 1 : 0;
}


function printNetwork(): void {
    let minX = BIGNUM, minY = BIGNUM, maxX = BIGNUM * -1, maxY = BIGNUM * -1;
    for (const k of network.keys()) {
        const [y, x] = k.split(',').map(x => parseInt(x));
        if (y < minY) { minY = y; }
        if (y > maxY) { maxY = y; }
        if (x < minX) { minX = x; }
        if (x > maxX) { maxX = x; }
    }

    minX -= 3;
    minY -= 3;
    maxX += 3;
    maxY += 3;

    for (let r = minY; r <= maxY; r++) {
        let s = '';

        for (let c = minX; c <= maxX; c++) {
            if (r === carrierY && c === carrierX) {
                s += '[';
                s += network.has(`${r},${c}`) ? network.get(`${r},${c}`) : '.';
                s += ']';
            } else if (r === carrierY && (c + 1) === carrierX) {
                s += network.has(`${r},${c}`) ? network.get(`${r},${c}`) : '.';
            } else if (r === carrierY && (c - 1) === carrierX) {
                s += network.has(`${r},${c}`) ? network.get(`${r},${c}`) : '.';
                s += ' ';
            } else {
                s += network.has(`${r},${c}`) ? network.get(`${r},${c}`) : '.';
                s += ' ';
            }
        }

        console.log(s);
    }

    console.log();
}
