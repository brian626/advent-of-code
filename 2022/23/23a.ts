// --- Day 23: Unstable Diffusion ---

// You enter a large crater of gray dirt where the grove is supposed to be. All around you, plants you imagine were expected to be
// full of fruit are instead withered and broken. A large group of Elves has formed in the middle of the grove.

// "...but this volcano has been dormant for months. Without ash, the fruit can't grow!"

// You look up to see a massive, snow-capped mountain towering above you.

// "It's not like there are other active volcanoes here; we've looked everywhere."

// "But our scanners show active magma flows; clearly it's going somewhere."

// They finally notice you at the edge of the grove, your pack almost overflowing from the random star fruit you've been collecting.
// Behind you, elephants and monkeys explore the grove, looking concerned. Then, the Elves recognize the ash cloud slowly spreading above your recent detour.

// "Why do you--" "How is--" "Did you just--"

// Before any of them can form a complete question, another Elf speaks up: "Okay, new plan. We have almost enough fruit already, and ash
// from the plume should spread here eventually. If we quickly plant new seedlings now, we can still make it to the extraction point. Spread out!"

// The Elves each reach into their pack and pull out a tiny plant. The plants rely on important nutrients from the ash, so they can't be planted too close together.

// There isn't enough time to let the Elves figure out where to plant the seedlings themselves; you quickly scan the grove (your puzzle input) and note their positions.

// The scan shows Elves # and empty ground .; outside your scan, more empty ground extends a long way in every direction. The scan is oriented so that
// north is up; orthogonal directions are written N (north), S (south), W (west), and E (east), while diagonal directions are written NE, NW, SE, SW.

// The Elves follow a time-consuming process to figure out where they should each go; you can speed up this process considerably. The process consists
// of some number of rounds during which Elves alternate between considering where to move and actually moving.

// During the first half of each round, each Elf considers the eight positions adjacent to themself. If no other Elves are in one of those eight positions,
// the Elf does not do anything during this round. Otherwise, the Elf looks in each of four directions in the following order and proposes moving one step
// in the first valid direction:

// If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
// If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
// If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
// If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.

// After each Elf has had a chance to propose a move, the second half of the round can begin. Simultaneously, each Elf moves to their proposed
// destination tile if they were the only Elf to propose moving to that position. If two or more Elves propose moving to the same position, none of those Elves move.

// Finally, at the end of the round, the first direction the Elves considered is moved to the end of the list of directions. For example, during the
// second round, the Elves would try proposing a move to the south first, then west, then east, then north. On the third round, the Elves would first
// consider west, then east, then north, then south.


// To make sure they're on the right track, the Elves like to check after round 10 that they're making good progress toward covering enough ground.
// To do this, count the number of empty ground tiles contained by the smallest rectangle that contains every Elf. (The edges of the rectangle should
// be aligned to the N/S/E/W directions; the Elves do not have the patience to calculate arbitrary rectangles.) In the above example, that rectangle is:


// Simulate the Elves' process and find the smallest rectangle that contains the Elves after 10 rounds. How many empty ground tiles does that rectangle contain?


import { readFileSync } from 'fs';

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');

const INVALID_POSITION = Math.pow(2,31);

class Elf {
    r: number;
    c: number;
    proposedRow: number;
    proposedCol: number;

    constructor(r: number, c: number) {
        this.r = r;
        this.c = c;
        this.proposedRow = this.proposedCol = INVALID_POSITION;
    }

    proposeMove() {
        const northNeighbor = elves.find(x => (x.r === this.r - 1 && x.c === this.c));
        const northeastNeighbor = elves.find(x => (x.r === this.r - 1 && x.c === this.c + 1));
        const northwestNeighbor = elves.find(x => (x.r === this.r - 1 && x.c === this.c - 1));
        const southNeighbor = elves.find(x => (x.r === this.r + 1 && x.c === this.c));
        const southEastNeighbor = elves.find(x => (x.r === this.r + 1 && x.c === this.c + 1));
        const southWestNeighbor = elves.find(x => (x.r === this.r + 1 && x.c === this.c - 1));
        const westNeighbor = elves.find(x => (x.r === this.r && x.c === this.c - 1));
        const eastNeighbor = elves.find(x => (x.r === this.r && x.c === this.c + 1));

        this.proposedRow = this.r;
        this.proposedCol = this.c;

        if (!northNeighbor && !northeastNeighbor && !northwestNeighbor &&
            !southNeighbor && !southEastNeighbor && !southWestNeighbor &&
            !westNeighbor && !eastNeighbor) {
                this.proposedRow = INVALID_POSITION;
                this.proposedCol = INVALID_POSITION;
        }

        // If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
        // If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
        // If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
        // If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.
        else if (moveOrder === 'NSWE') {
            if (!northNeighbor && !northeastNeighbor && !northwestNeighbor) { this.proposedRow = this.r - 1; }
            else if (!southNeighbor && !southEastNeighbor && !southWestNeighbor) { this.proposedRow = this.r + 1; }
            else if (!westNeighbor && !northwestNeighbor && !southWestNeighbor) { this.proposedCol = this.c - 1; }
            else if (!eastNeighbor && !northeastNeighbor && !southEastNeighbor) { this.proposedCol = this.c + 1; }
        }
        else if (moveOrder === 'SWEN') {
            if (!southNeighbor && !southEastNeighbor && !southWestNeighbor) { this.proposedRow = this.r + 1; }
            else if (!westNeighbor && !northwestNeighbor && !southWestNeighbor) { this.proposedCol = this.c - 1; }
            else if (!eastNeighbor && !northeastNeighbor && !southEastNeighbor) { this.proposedCol = this.c + 1; }
            else if (!northNeighbor && !northeastNeighbor && !northwestNeighbor) { this.proposedRow = this.r - 1; }
        }
        else if (moveOrder === 'WENS') {
            if (!westNeighbor && !northwestNeighbor && !southWestNeighbor) { this.proposedCol = this.c - 1; }
            else if (!eastNeighbor && !northeastNeighbor && !southEastNeighbor) { this.proposedCol = this.c + 1; }
            else if (!northNeighbor && !northeastNeighbor && !northwestNeighbor) { this.proposedRow = this.r - 1; }
            else if (!southNeighbor && !southEastNeighbor && !southWestNeighbor) { this.proposedRow = this.r + 1; }
        }
        else if (moveOrder === 'ENSW') {
            if (!eastNeighbor && !northeastNeighbor && !southEastNeighbor) { this.proposedCol = this.c + 1; }
            else if (!northNeighbor && !northeastNeighbor && !northwestNeighbor) { this.proposedRow = this.r - 1; }
            else if (!southNeighbor && !southEastNeighbor && !southWestNeighbor) { this.proposedRow = this.r + 1; }
            else if (!westNeighbor && !northwestNeighbor && !southWestNeighbor) { this.proposedCol = this.c - 1; }
        }

        // console.log(`Elf at ${this.r},${this.c} proposes moving to ${this.proposedRow},${this.proposedCol}`);
    }
}

const elves: Elf[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const positions = lines[i].split('');
    for (let j = 0; j < positions.length; j++) {
        if (positions[j] === '#') {
            elves.push(new Elf(i, j));
        }
    }
}

// printMap();

let moveOrder = 'NSWE';

let elfMoved = false;
let lastRound = -1;

for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < elves.length; j++) { elves[j].proposeMove(); }

    // console.log(`after proposals`);
    // console.log(elves);
    // console.log(``);

    for (let j = 0; j < elves.length; j++) {
        if (elves[j].proposedRow === INVALID_POSITION && elves[j].proposedCol === INVALID_POSITION) { continue; }

        const elvesWithSameMove: Elf[] = elves.filter(x => {
            return x.proposedRow === elves[j].proposedRow && x.proposedCol === elves[j].proposedCol;
        });

        if (elvesWithSameMove.length > 1) {
            elvesWithSameMove.forEach(x => {
                x.proposedRow = INVALID_POSITION;
                x.proposedCol = INVALID_POSITION;
            });
        }
    }

    // console.log(`after conflict resolution`);
    // console.log(elves);
    // console.log(``);

    elfMoved = false;

    for (let j = 0; j < elves.length; j++) {
        const elf = elves[j];
        if (elf.proposedRow === INVALID_POSITION && elf.proposedCol === INVALID_POSITION) { continue; }
        // console.log(`Elf at ${elf.r},${elf.c} moves to ${elf.proposedRow},${elf.proposedCol}`);

        elf.r = elf.proposedRow;
        elf.proposedRow = INVALID_POSITION;
        elf.c = elf.proposedCol;
        elf.proposedCol = INVALID_POSITION;

        elfMoved = true;
    }

    // printMap();

    moveOrder = moveOrder.substring(1) + moveOrder.substring(0,1);

    if (!elfMoved) { lastRound = i; break; }
    else { console.log(`Elf moved in round ${i + 1}...`) };
}

console.log(lastRound + 1);

// const minRow = Math.min(...elves.map(x => x.r));
// const maxRow = Math.max(...elves.map(x => x.r));
// const minCol = Math.min(...elves.map(x => x.c));
// const maxCol = Math.max(...elves.map(x => x.c));
// let numEmptyTiles = 0;
// for (let i = minRow; i <= maxRow; i++) {
//     for (let j = minCol; j <= maxCol; j++) {
//         const elfHere = elves.find(x => (x.r === i && x.c === j));
//         if (!elfHere) { numEmptyTiles++; }
//     }
// }

// console.log(numEmptyTiles);

function printMap() {
    const minRow = Math.min(...elves.map(x => x.r));
    const maxRow = Math.max(...elves.map(x => x.r));
    const minCol = Math.min(...elves.map(x => x.c));
    const maxCol = Math.max(...elves.map(x => x.c));

    for (let i = minRow - 1; i <= maxRow + 1; i++) {
        let row: string[] = [];
        for (let j = minCol - 1; j <= maxCol + 1; j++) {
            const elfHere = elves.find(x => (x.r === i && x.c === j));
            if (elfHere) { row.push('#'); }
            else         { row.push('.'); }
        }

        console.log(row.join(''));
    }

    console.log(``);
}
