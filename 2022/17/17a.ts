
import { readFileSync } from 'fs';
import { exit } from 'process';

const ROCKS: string[][] = [
    ['####'],

    ['.#.',
        '###',
        '.#.'],

    ['..#',
        '..#',
        '###'],

    ['#',
        '#',
        '#',
        '#'],

    ['##',
        '##']
];

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let jetPattern = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    jetPattern = lines[i];
}

class Rock {
    pattern: string[];
    ulPos: number[];
    width: number;
    height: number;

    constructor(patternNum: number) {
        this.pattern = Array.from(ROCKS[patternNum]);
        this.ulPos = [0, 0];
        this.width = 0;
        for (let i = 0; i < this.pattern.length; i++) {
            this.width = Math.max(this.width, this.pattern[i].lastIndexOf('#') + 1);
        }
        this.height = this.pattern.length;
    }
}

const chamber: string[][] = [
    '|.......|'.split(''),
    '|.......|'.split(''),
    '|.......|'.split(''),
    '|.......|'.split(''),
    '|.......|'.split(''),
    '|.......|'.split(''),
    '+-------+'.split(''),
].reverse();

let rockType = 0;
let jetPos = 0;
let highestRock = 0;


let rounds = 0;
let needToAddRock = true;
let numRocks = 0;
while (numRocks <= 2022) {

    // Let the rock fall until it stops
    if (needToAddRock) {
        if (numRocks % 100 === 0) { console.log(numRocks); }
        // console.log(`A new rock begins falling:`);
        const newRock = new Rock(rockType);
        newRock.ulPos = [highestRock + 3 + newRock.height, 3];
        numRocks++;
        // console.log(newRock);
        addRockToChamber(newRock);
        // printChamber();
        needToAddRock = false;

        rockType++;
        if (rockType === ROCKS.length) { rockType = 0; }
    }

    // Jet pushes rock
    const jetDirection = jetPattern[jetPos];
    jetPos++;
    if (jetPos === jetPattern.length) { jetPos = 0; }

    let cantMoveHoriz = false;
    if (jetDirection === '>') {
        for (let r = chamber.length - 1; r >= 0; r--) {
            if (cantMoveHoriz) { break; }
            for (let c = chamber[0].length - 1; c >= 0; c--) {
                if (chamber[r][c] === '@') {
                    if (chamber[r][c + 1] === '|' || chamber[r][c + 1] === '#') {
                        cantMoveHoriz = true;
                        break;
                    }
                }
            }
        }
        if (cantMoveHoriz) {
            // console.log(`Jet of gas pushes rock right, but nothing happens:`);
        } else {
            // console.log(`Jet of gas pushes rock right:`);
            for (let r = chamber.length - 1; r >= 0; r--) {
                for (let c = chamber[0].length - 2; c > 0; c--) {
                    if (chamber[r][c] === '@') {
                        chamber[r][c + 1] = '@';
                        chamber[r][c] = '.';
                    }
                }
            }
        }
    } else {
        for (let r = chamber.length - 1; r >= 0; r--) {
            if (cantMoveHoriz) { break; }
            for (let c = 0; c < chamber[0].length; c++) {
                if (chamber[r][c] === '@') {
                    if (chamber[r][c - 1] === '|' || chamber[r][c - 1] === '#') {
                        cantMoveHoriz = true;
                        break;
                    }
                }
            }
        }
        if (cantMoveHoriz) {
            // console.log(`Jet of gas pushes rock left, but nothing happens:`);
        } else {
            // console.log(`Jet of gas pushes rock left:`);
            for (let r = chamber.length - 1; r >= 0; r--) {
                for (let c = 1; c < chamber[0].length - 1; c++) {
                    if (chamber[r][c] === '@') {
                        chamber[r][c - 1] = '@';
                        chamber[r][c] = '.';
                    }
                }
            }
        }
    }

    // printChamber();

    // Rock falls
    let cantMoveVert = false;
    for (let r = 1; r < chamber.length; r++) {
        if (cantMoveVert) { break; }
        for (let c = 1; c < chamber[0].length - 1; c++) {
            if (chamber[r][c] === '@') {
                if (chamber[r - 1][c] === '#' || chamber[r - 1][c] === '-') {
                    cantMoveVert = true;
                    break;
                }
            }
        }
    }
    if (cantMoveVert) {
        // console.log(`Rock falls 1 unit, causing it to come to rest:`);
        for (let r = 1; r < chamber.length; r++) {
            if (!(chamber[r].includes('@') || chamber[r].includes('#'))) {
                break;
            }
            for (let c = 1; c < chamber[0].length - 1; c++) {
                if (chamber[r][c] === '@') {
                    // console.log(`range is 0 to ${chamber.length - 1}, highestRock is ${highestRock}, flipped on row ${r}`);
                    chamber[r][c] = '#';
                    highestRock = Math.max(highestRock, r);
                } else {
                    // console.log(`range is 0 to ${chamber.length - 1}, highestRock is ${highestRock}, didn't flip on row ${r}`);
                }
            }
        }
        needToAddRock = true;
    } else {
        // console.log(`Rock falls 1 unit:`);
        let breakOnNextRowWithoutARock = false;
        for (let r = 1; r < chamber.length; r++) {
            if (breakOnNextRowWithoutARock) {
                if (!chamber[r].includes('@')) {
                    break;
                }
            }
            for (let c = 1; c < chamber[0].length - 1; c++) {
                if (chamber[r][c] === '@') {
                    breakOnNextRowWithoutARock = true;
                    chamber[r - 1][c] = '@';
                    chamber[r][c] = '.';
                }
            }
        }
    }

    // printChamber();

    // rounds++;
    // if (rounds >= 100) {
    //     break;
    // }
}

// printChamber();
console.log();
console.log(highestRock);


function addRockToChamber(rock: Rock) {
    for (let r = 0; r < rock.height; r++) {
        if (chamber[rock.ulPos[0] - r] === undefined) { chamber[rock.ulPos[0] - r] = '|.......|'.split(''); }
        for (let c = 0; c < rock.width; c++) {
            // console.log(`setting chamber[${rock.ulPos[0]},${rock.ulPos[1] + c}] to ${rock.pattern[r][c] === '#' ? '@' : '.'}`);
            chamber[rock.ulPos[0] - r][rock.ulPos[1] + c] = rock.pattern[r][c] === '#' ? '@' : '.';
        }
    }
}


function printChamber() {
    for (let r = chamber.length - 1; r >= 0; r--) {
        console.log(chamber[r].join(''));
    }
    console.log();
}
