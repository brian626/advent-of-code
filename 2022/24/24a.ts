
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.test2', 'utf-8');

const lines = file.split('\n');

class Blizzard {
    rPos: number;
    cPos: number;
    facing: string;

    constructor(rPos: number, cPos: number, facing: string) {
        this.rPos = rPos;
        this.cPos = cPos;
        this.facing = facing;
    }

    move() {
        // console.log(`map.length = ${map.length}, map[0].length = ${map[0].length}`);
        let s = `blizzard at [${this.rPos},${this.cPos}] moving `;

        switch (this.facing) {
            case '^':
                s += 'up ';
                if (this.rPos > 1) { this.rPos--; }
                else { this.rPos = map.length - 2; }
                break;

            case 'v':
                s += 'down ';
                if (this.rPos < map.length - 2) { this.rPos++; }
                else { this.rPos = 1; }
                break;

            case '<':
                s += 'left ';
                if (this.cPos > 1) { this.cPos--; }
                else { this.cPos = map[0].length - 2; }
                break;

            case '>':
                s += 'right ';
                if (this.cPos < map[0].length - 2) { this.cPos++; }
                else { this.cPos = 1; }
                break;
        }

        s += `to [${this.rPos},${this.cPos}]`;

        // console.log(s);
    }
}

const map: string[][] = [];

const blizzards: Blizzard[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = [];

    for (let j = 0; j < lines[i].length; j++) {
        switch (lines[i][j]) {
            case '#':
            case '.':
                map[i][j] = lines[i][j];
                break;

            case '^':
            case 'v':
            case '<':
            case '>':
                blizzards.push(new Blizzard(i, j, lines[i][j]));
                map[i][j] = '.';
                break;
        }
    }
}

let eRow = 0, eCol = map[0].indexOf('.');
const goalRow = map.length - 1, goalCol = map[goalRow].indexOf('.');

console.log(`Initial state:`);
printMap(eRow, eCol);

let minute = 0;
while (eRow !== goalRow && eCol !== goalCol) {
    minute++;
    for (const b of blizzards) {
        b.move();
    }

    const canMoveUp = eRow > 1 &&
        map[eRow - 1][eCol] === '.' &&
        blizzards.find(x => x.rPos === eRow - 1 && x.cPos === eCol) === undefined;

    const canMoveDown = eRow < map.length - 2 &&
        map[eRow + 1][eCol] === '.' &&
        blizzards.find(x => x.rPos === eRow + 1 && x.cPos === eCol) === undefined;

    const canMoveLeft = eCol > 1 &&
        map[eRow][eCol - 1] === '.' &&
        blizzards.find(x => x.rPos === eRow && x.cPos === eCol - 1) === undefined;

    const canMoveRight = eCol < map[0].length - 2 &&
        map[eRow][eCol + 1] === '.' &&
        blizzards.find(x => x.rPos === eRow && x.cPos === eCol + 1) === undefined;

    console.log(`can expedition move? ${canMoveUp}, ${canMoveDown}, ${canMoveLeft}, ${canMoveRight}`);

    let s = `Minute ${minute}, `;
    if (canMoveDown) {
        s += 'move down:';
        eRow++;
    } else if (canMoveUp) {
        s += 'move up:';
        eRow--;
    } else if (canMoveRight) {
        s += 'move right:';
        eCol++;
    } else if (canMoveLeft) {
        s += 'move left:';
        eCol--;
    } else {
        s += 'wait:';
    }
    console.log(s);

    printMap(eRow, eCol);

    if (minute === 18) {
        break;
    }
}


function printMap(er: number, ec: number) {
    for (let r = 0; r < map.length; r++) {
        let row = '';
        for (let c = 0; c < map[0].length; c++) {
            if (r === er && c === ec) {
                row += 'E';
            } else if (blizzards.filter(x => x.rPos === r && x.cPos === c).length === 1) {
                row += blizzards.find(x => x.rPos === r && x.cPos === c).facing;
            } else if (blizzards.filter(x => x.rPos === r && x.cPos === c).length > 1) {
                row += blizzards.filter(x => x.rPos === r && x.cPos === c).length;
            } else {
                row += map[r][c];
            }
        }
        console.log(row);
    }
    console.log();
}


// There are points at which multiple moves are possible
// A heuristic-based approach (i.e. prefer down/right to up/left) doesn't seem sufficient
// May need a backtracking algorithm
