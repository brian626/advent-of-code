
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

class Machine {
    buttonA: number[];
    buttonB: number[];
    prize: number[];

    constructor(buttonA: string, buttonB: string, prize: string) {
        let matches = /Button A: X\+(\d+), Y\+(\d+)/.exec(buttonA);
        this.buttonA = [];
        this.buttonA.push(parseInt(matches[1]), parseInt(matches[2]));

        matches = /Button B: X\+(\d+), Y\+(\d+)/.exec(buttonB);
        this.buttonB = [];
        this.buttonB.push(parseInt(matches[1]), parseInt(matches[2]));

        matches = /Prize: X=(\d+), Y=(\d+)/.exec(prize);
        this.prize = [];
        this.prize.push(parseInt(matches[1]) + 10000000000000, parseInt(matches[2]) + 10000000000000);
    }
}


let machines: Machine[] = [];

let buttonA = '';
let buttonB = '';
let prize = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Button A')) { buttonA = lines[i]; }
    else if (lines[i].startsWith('Button B')) { buttonB = lines[i]; }
    else if (lines[i].startsWith('Prize')) {
        prize = lines[i];
        machines.push(new Machine(buttonA, buttonB, prize));
    }
}

// console.log(machines);
let tokens = 0;
for (const m of machines) {
    // Equation 1: m.buttonA[0] * a + m.buttonB[0] * b = m.prize[0]
    // Equation 2: m.buttonA[1] * a + m.buttonB[1] * b = m.prize[1]
    let x = m.buttonA[0];
    let y = m.buttonB[0];
    let z = m.prize[0];

    let d = m.buttonA[1];
    let e = m.buttonB[1];
    let f = m.prize[1];

    let b = ((f * x) - (d * z)) / ((e * x) - (d * y));
    let a = (z - (y * b)) / x;

    if (Math.floor(b) === b && Math.floor(a) === a) {
        console.log(`Machine wins with ${a} presses of A and ${b} presses of B!`);
        tokens += (3 * a) + b;
    }
}

console.log(tokens);
