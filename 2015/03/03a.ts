
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.input', 'utf-8');

const lines = file.split('\n');

const grid: Map<string, number> = new Map<string, number>();

let xPos = 0;
let yPos = 0;

deliverPresent(xPos, yPos);

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const moves = lines[i].split('');
    for (let j = 0; j < moves.length; j++) {
        if (moves[j] === '^') { yPos -= 1; }
        else if (moves[j] === 'v') { yPos += 1; }
        else if (moves[j] === '>') { xPos += 1; }
        else if (moves[j] === '<') { xPos -= 1; }

        deliverPresent(xPos, yPos);
    }
}

console.log(grid);
console.log(grid.size);


function deliverPresent(x: number, y: number): void {
    const positionString = `${xPos},${yPos}`;
    let presentCount = grid.get(positionString);
    if (presentCount) {
        grid.set(positionString, presentCount + 1);
    } else {
        grid.set(positionString, 1);
    }
}
