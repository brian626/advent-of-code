
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

let startingNumbers: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    startingNumbers = lines[i].split(',').map(x => parseInt(x));
}

// const spokenNumbers: Set<number> = new Set<number>();
const numberHistory: Map<number, number[]> = new Map<number, number[]>();

let i = 0;
let lastNumberSpoken = -1;
const TURNS = 2020;

while (i < TURNS) {
    // console.log(`Last number spoken was ${lastNumberSpoken}...`);

    let numberSpoken = -1;
    if (startingNumbers.length > 0) {
        numberSpoken = startingNumbers.shift();
    } else {
        const history = Array.from(numberHistory.get(lastNumberSpoken));
        if (history.length === 1) {
            // console.log(`  That was the first time ${lastNumberSpoken} was spoken`);
            numberSpoken = 0;
        } else {
            // console.log(`  ${lastNumberSpoken} was spoken before on turns [${history}]`);
            numberSpoken = history.pop() - history.pop();
        }
    }

    // spokenNumbers.add(numberSpoken);
    const history = numberHistory.get(numberSpoken) || [];
    history.push(i+1);
    // console.log(`  updating ${numberSpoken}'s history to [${history}]`);
    numberHistory.set(numberSpoken, history);

    lastNumberSpoken = numberSpoken;

    // console.log(`Turn ${i+1}: The number spoken is ${numberSpoken}`);
    // console.log();

    i++;
}

console.log(lastNumberSpoken);
