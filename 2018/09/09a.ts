
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');

let numPlayers = 0, lastValue = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let [n, _1, _2, _3, _4, _5, v, _6] = lines[i].split(' ');
    numPlayers = parseInt(n);
    lastValue = parseInt(v);
}

// console.log(numPlayers, lastValue);

const scores: number[] = [];
const marblesAvailable: number[] = [];
let marblesPlaced: number[] = [0];

for (let i = 0; i <= numPlayers; i++) {
    scores[i] = 0;
}
for (let i = 1; i <= lastValue + 1; i++) {
    marblesAvailable.push(i);
}

let currentElf = 0;
let currentMarble = 0;

while (marblesAvailable.length > 0) {
    // let debugString = `[${currentElf === 0 ? '-' : currentElf}] `;
    // for (let i = 0; i < marblesPlaced.length; i++) {
    //     if (i === currentMarble) {
    //         debugString += `(${marblesPlaced[i]}) `;
    //     } else {
    //         debugString += `${marblesPlaced[i]} `;
    //     }
    // }
    // console.log(debugString);

    const nextMarble = marblesAvailable.shift();
    if (nextMarble % 23 === 0) {
        // console.log(`adding ${nextMarble} to the score for elf #${currentElf}`);
        scores[currentElf] += nextMarble;
        let marbleToRemove = currentMarble - 7;
        if (marbleToRemove < 0) {
            marbleToRemove += marblesPlaced.length;
        }
        // console.log(`adding ${marblesPlaced[marbleToRemove]} to the score for elf #${currentElf}`);
        scores[currentElf] += marblesPlaced[marbleToRemove];

        marblesPlaced.splice(marbleToRemove, 1);
        currentMarble = marbleToRemove;
    } else {
        let nextMarbleIndex = currentMarble + 2;
        if (nextMarbleIndex > marblesPlaced.length) {
            nextMarbleIndex -= marblesPlaced.length;
        }

        marblesPlaced = marblesPlaced.slice(0, nextMarbleIndex).concat([nextMarble]).concat(marblesPlaced.slice(nextMarbleIndex));
        currentMarble = nextMarbleIndex;
    }

    currentElf++;
    if (currentElf > numPlayers) {
        currentElf = 1;
    }
}

// console.log(scores);
console.log(Math.max(...scores));
