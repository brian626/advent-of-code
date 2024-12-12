
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

let numElves = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    numElves = parseInt(lines[i]);
}

const allThePresents = numElves;

class Elf {
    name: string;
    presents: number;

    constructor(n: string, p: number) {
        this.name = n;
        this.presents = p;
    }
}

const elves: Elf[] = [];

for (let i = 0; i < numElves; i++) {
    elves[i] = new Elf((i+1).toString(), 1);
}

// steal from elf across, choosing left (from stealer's perspective if there are two)
// if there are an odd number of elves, there will be two - 1 chooses between floor(n/2)+1 and ceil(n/2)+1
// if there are an even number of elves, only one choice - 1 chooses (n/2)+1

let done = false;
let currentElfNum = 0;


while (!done) {
    if (numElves % 100 === 0) { console.log(`${numElves} elves left`); }
    // console.log(`before steal`);
    // printElves();

    let currentElf = elves[currentElfNum];

    // console.log(`  currentElfNum === ${currentElfNum}`);
    // console.log(`  elf ${currentElf.name} deciding who to steal from`);

    if (currentElf.presents === 0) { continue; }
    if (currentElf.presents === allThePresents) {
        console.log(currentElf.name);
        done = true;
        break;
    }

    let elfNumToStealFrom = -1;
    if (numElves % 2 === 0) {
        elfNumToStealFrom = (numElves / 2);
    } else {
        elfNumToStealFrom = Math.floor(numElves / 2);
    }

    if (elfNumToStealFrom >= numElves) {
        elfNumToStealFrom = elfNumToStealFrom % numElves;
    }

    // console.log(`  elf ${currentElf.name} steals from elf that is ${elfNumToStealFrom} places ahead`);

    let elfToStealFrom: Elf = null;
    let elfPtr = currentElfNum;
    while (elfNumToStealFrom > 0) {
        elfPtr++;
        if (elfPtr >= allThePresents) { elfPtr = 0; }
        if (elves[elfPtr].presents !== 0) {
            elfNumToStealFrom--;
        }
    }
    elfToStealFrom = elves[elfPtr];

    // console.log(`  elf ${currentElf.name} steals from elf ${elfToStealFrom.name}`);

    currentElf.presents += elfToStealFrom.presents;
    elfToStealFrom.presents = 0;

    // console.log(`after steal`);
    // printElves();

    // remove elves without presents
    numElves--;

    // console.log(`after remove`);
    // printElves();

    // console.log(`  incrementing currentElfNum to ${currentElfNum + 1}`);
    currentElfNum++;
    while (elves[currentElfNum].presents === 0) {
        // console.log(`  incrementing currentElfNum to ${currentElfNum + 1}`);
        currentElfNum++;
        if (currentElfNum >= allThePresents) {
            // console.log(`  resetting currentElfNum to 0`);
            currentElfNum = 0;
        }
    }

    // console.log();
}


function printElves(): void {
    let elfPtr = 0;

    while (elves[elfPtr]) {
        console.log(`elf ${(elfPtr === currentElfNum) ? '[' : ''}${elves[elfPtr].name}${(elfPtr === currentElfNum) ? ']' : ''} has ${elves[elfPtr].presents} presents`);
        elfPtr++;
    }

    console.log();
}
