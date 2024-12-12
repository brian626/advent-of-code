
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

const grid: Map<string, number> = new Map<string, number>();

let xPosSanta = 0;
let yPosSanta = 0;
let xPosRobo = 0;
let yPosRobo = 0;

deliverPresent(xPosSanta, yPosSanta);
deliverPresent(xPosRobo, yPosRobo);

let santasTurn = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const moves = lines[i].split('');
    for (let j = 0; j < moves.length; j++) {
        if (santasTurn) {
            if (moves[j] === '^') { yPosSanta -= 1; }
            else if (moves[j] === 'v') { yPosSanta += 1; }
            else if (moves[j] === '>') { xPosSanta += 1; }
            else if (moves[j] === '<') { xPosSanta -= 1; }

            deliverPresent(xPosSanta, yPosSanta);
            santasTurn = false;
        } else {
            if (moves[j] === '^') { yPosRobo -= 1; }
            else if (moves[j] === 'v') { yPosRobo += 1; }
            else if (moves[j] === '>') { xPosRobo += 1; }
            else if (moves[j] === '<') { xPosRobo -= 1; }

            deliverPresent(xPosRobo, yPosRobo);
            santasTurn = true;
        }
    }
}

// console.log(grid);
console.log(grid.size);


function deliverPresent(x: number, y: number): void {
    const positionString = `${x},${y}`;
    let presentCount = grid.get(positionString);
    if (presentCount) {
        grid.set(positionString, presentCount + 1);
    } else {
        grid.set(positionString, 1);
    }
}
