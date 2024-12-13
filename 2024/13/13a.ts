
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
        this.prize.push(parseInt(matches[1]), parseInt(matches[2]));
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
    let winner = false;

    for (let a = 0; a < 100; a++) {
        for (let b = 0; b < 100; b++) {
            if ((a * m.buttonA[0] + b * m.buttonB[0]) === m.prize[0] &&
                (a * m.buttonA[1] + b * m.buttonB[1]) === m.prize[1]) {
                    console.log(`Machine wins with ${a} presses of A and ${b} presses of B!`);
                    tokens += (3 * a) + b;
                    winner = true;
                    break;
                }
        }

        if ( winner ) { break; }
    }
}

console.log(tokens);
