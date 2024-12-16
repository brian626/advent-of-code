
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];
let movements: string[] = [];
let parsingMap = true;

const DEBUG = false;

function debug(s: string): void {
    if (DEBUG) {
        console.log(s);
    }
}

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingMap = false; continue; }

    if (parsingMap) {
        let row = '';
        for (const c of lines[i].split('')) {
            if (c === '#') {
                row += '##';
            } else if (c === 'O') {
                row += '[]';
            } else if (c === '.') {
                row += '..';
            } else {
                row += '@.';
            }
        }
        map.push(row.split(''));
    } else {
        const movementLine = lines[i].split('');
        movements = movements.concat(movementLine);
    }
}


let rRobot = 0, cRobot = 0;

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '@') {
            [rRobot, cRobot] = [r, c];
            break;
        }
    }
}

debug(`Initial state:`);
printMap();

// function countBoxes(): number {
//     let numBoxes = 0;
//     for (let r = 0; r < map.length; r++) {
//         for (let c = 0; c < map[0].length; c++) {
//             if (map[r][c] === '[') { numBoxes++; }
//         }
//     }

//     return numBoxes;
// }

for (const m of movements) {
    debug(`Move ${m}:`)
    move(m);
    printMap();
}

debug(`Final state:`);
printMap(true);

let score = 0;
for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '[') {
            score += (c + (r * 100));
        }
    }
}

console.log(score);



function move(m: string) {
    const [originalRRobot, originalCRobot] = [rRobot, cRobot];

    switch (m) {
        case '^':
            if (rRobot > 1) {
                if (map[rRobot - 1][cRobot] === '.' ||
                    (map[rRobot - 1][cRobot] === ']' && moveBox(m, rRobot - 1, cRobot - 1)) ||
                    (map[rRobot - 1][cRobot] === '[' && moveBox(m, rRobot - 1, cRobot))) {
                    rRobot -= 1;
                }
            }
            break;

        case 'v':
            if (rRobot < map.length - 1) {
                if (map[rRobot + 1][cRobot] === '.' ||
                    (map[rRobot + 1][cRobot] === ']' && moveBox(m, rRobot + 1, cRobot - 1)) ||
                    (map[rRobot + 1][cRobot] === '[' && moveBox(m, rRobot + 1, cRobot))) {
                    rRobot += 1;
                }
            }
            break

        case '<':
            if (cRobot > 1) {
                if (map[rRobot][cRobot - 1] === '.' ||
                    (map[rRobot][cRobot - 1] === ']' && moveBox(m, rRobot, cRobot - 1))) {
                    cRobot -= 1;
                }
            }
            break;

        case '>':
            if (cRobot < map[0].length - 1) {
                if (map[rRobot][cRobot + 1] === '.' ||
                    (map[rRobot][cRobot + 1] === '[' && moveBox(m, rRobot, cRobot + 1))) {
                    cRobot += 1;
                }
            }
            break;
    }

    if (originalRRobot !== rRobot || originalCRobot !== cRobot) {
        // debug(`moving robot from [${originalRRobot},${originalCRobot}] (${map[originalRRobot][originalCRobot]}) to [${rRobot},${cRobot}] (${map[rRobot][cRobot]})`);
        swap(originalRRobot, originalCRobot, rRobot, cRobot);
    }
}


function swap(r1: number, c1: number, r2: number, c2: number): void {
    const temp = map[r1][c1];
    map[r1][c1] = map[r2][c2];
    map[r2][c2] = temp;
}


function testMoveBox(m: string, r: number, c: number): boolean {
    return moveBox(m, r, c, true);
}

function moveBox(m: string, r: number, c: number, testMode: boolean = false): boolean {
    debug(`moveBox(${m}, ${r}, ${c}, ${testMode})`);
    let movedBox = false;

    switch (m) {
        case '^':
            if (map[r][c] === '[') {
                if (map[r - 1][c] === '.' && map[r - 1][c + 1] === '.') {
                    debug(`  case 1: both squares above are clear`);
                    if (!testMode) {
                        swap(r, c, r - 1, c);
                        swap(r, c + 1, r - 1, c + 1);
                    }
                    movedBox = true;
                } else if (map[r - 1][c] === ']' && map[r - 1][c + 1] === '.') {
                    debug(`  case 2: right side of a box is above`);
                    if (moveBox(m, r - 1, c - 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c + 1, r - 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === '.' && map[r - 1][c + 1] === '[') {
                    debug(`  case 3: left side of a box is above`);
                    if (moveBox(m, r - 1, c + 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c + 1, r - 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === ']' && map[r - 1][c + 1] === '[') {
                    debug(`  case 4: two boxes are above`);
                    const move1 = testMoveBox(m, r - 1, c - 1);
                    const move2 = testMoveBox(m, r - 1, c + 1);
                    if (move1 && move2) {
                        debug(`    both test moves succeeded, doing them for real`);
                        moveBox(m, r - 1, c - 1, testMode);
                        moveBox(m, r - 1, c + 1, testMode);
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c + 1, r - 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === '[' && map[r - 1][c + 1] === ']') {
                    debug(`  case 5: a box is above`);
                    if (moveBox(m, r - 1, c, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c + 1, r - 1, c + 1);
                        }
                        movedBox = true;
                    }
                }
            } else if (map[r][c] === ']') {
                if (map[r - 1][c - 1] === '.' && map[r - 1][c] === '.') {
                    debug(`  case 6: both squares above are clear`);
                    if (!testMode) {
                        swap(r, c, r - 1, c);
                        swap(r, c - 1, r - 1, c - 1);
                    }
                    movedBox = true;
                } else if (map[r - 1][c] === ']' && map[r - 1][c + 1] === '.') {
                    debug(`  case 7: right side of a box is above`);
                    if (moveBox(m, r - 1, c - 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c - 1, r - 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === '.' && map[r - 1][c + 1] === '[') {
                    debug(`  case 8: left side of a box is above`);
                    if (moveBox(m, r - 1, c + 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c - 1, r - 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === ']' && map[r - 1][c + 1] === '[') {
                    debug(`  case 9: two boxes are above`);
                    const move1 = testMoveBox(m, r - 1, c - 1);
                    const move2 = testMoveBox(m, r - 1, c + 1);
                    if (move1 && move2) {
                        debug(`    both test moves succeeded, doing them for real`);
                        moveBox(m, r - 1, c - 1, testMode);
                        moveBox(m, r - 1, c + 1, testMode);
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c - 1, r - 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r - 1][c] === '[' && map[r - 1][c + 1] === ']') {
                    debug(`  case 10: a box is above`);
                    if (moveBox(m, r - 1, c, testMode)) {
                        if (!testMode) {
                            swap(r, c, r - 1, c);
                            swap(r, c - 1, r - 1, c - 1);
                        }
                        movedBox = true;
                    }
                }
            }
            break;

        case 'v':
            if (map[r][c] === '[') {
                if (map[r + 1][c] === '.' && map[r + 1][c + 1] === '.') {
                    debug(`  case 11: both squares below are clear`);
                    if (!testMode) {
                        swap(r, c, r + 1, c);
                        swap(r, c + 1, r + 1, c + 1);
                    }
                    movedBox = true;
                } else if (map[r + 1][c] === ']' && map[r + 1][c + 1] === '.') {
                    debug(`  case 12: right side of a box is below`);
                    if (moveBox(m, r + 1, c - 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c + 1, r + 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === '.' && map[r + 1][c + 1] === '[') {
                    debug(`  case 13: left side of a box is below`);
                    if (moveBox(m, r + 1, c + 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c + 1, r + 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === ']' && map[r + 1][c + 1] === '[') {
                    debug(`  case 14: two boxes are below, testing moves`);
                    const move1 = testMoveBox(m, r + 1, c - 1);
                    const move2 = testMoveBox(m, r + 1, c + 1);
                    if (move1 && move2) {
                        debug(`    both test moves succeeded, doing them for real`);
                        moveBox(m, r + 1, c - 1, testMode);
                        moveBox(m, r + 1, c + 1, testMode);
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c + 1, r + 1, c + 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === '[' && map[r + 1][c + 1] === ']') {
                    debug(`  case 15: a box is below`);
                    if (moveBox(m, r + 1, c, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c + 1, r + 1, c + 1);
                        }
                        movedBox = true;
                    }
                }
            } else if (map[r][c] === ']') {
                debug(`case ]`);
                if (map[r + 1][c - 1] === '.' && map[r + 1][c] === '.') {
                    debug(`  case 16: both squares below are clear`);
                    if (!testMode) {
                        swap(r, c, r + 1, c);
                        swap(r, c - 1, r + 1, c - 1);
                    }
                    movedBox = true;
                } else if (map[r + 1][c] === ']' && map[r + 1][c + 1] === '.') {
                    debug(`  case 17: right side of a box is below`);
                    if (moveBox(m, r + 1, c - 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c - 1, r + 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === '.' && map[r + 1][c + 1] === '[') {
                    debug(`  case 18: left side of a box is below`);
                    if (moveBox(m, r + 1, c + 1, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c - 1, r + 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === ']' && map[r + 1][c + 1] === '[') {
                    debug(`  case 19: two boxes are below`);
                    const move1 = testMoveBox(m, r + 1, c - 1);
                    const move2 = testMoveBox(m, r + 1, c + 1);
                    if (move1 && move2) {
                        debug(`    both moves succeeded, doing them for real`);
                        moveBox(m, r + 1, c - 1, testMode);
                        moveBox(m, r + 1, c + 1, testMode);
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c - 1, r + 1, c - 1);
                        }
                        movedBox = true;
                    }
                } else if (map[r + 1][c] === '[' && map[r + 1][c + 1] === ']') {
                    debug(`  case 20: a box is below`);
                    if (moveBox(m, r + 1, c, testMode)) {
                        if (!testMode) {
                            swap(r, c, r + 1, c);
                            swap(r, c - 1, r + 1, c - 1);
                        }
                        movedBox = true;
                    }
                }
            }
            break;

        case '<':
            if (map[r][c - 2] === '.') {
                debug(`  case 21: moving box from [${r},${c}] to [${r},${c - 2}]`);
                swap(r, c - 1, r, c - 2);
                swap(r, c, r, c - 1);
                movedBox = true;
            } else if (map[r][c - 2] === ']') {
                if (moveBox(m, r, c - 2)) {
                    debug(`  case 22: `);
                    swap(r, c - 1, r, c - 2);
                    swap(r, c, r, c - 1);
                    movedBox = true;
                }
            }
            break;

        case '>':
            if (map[r][c + 2] === '.') {
                debug(`  case 23: moving box from [${r},${c}] to [${r},${c + 1}]`);
                swap(r, c + 1, r, c + 2);
                swap(r, c, r, c + 1);
                movedBox = true;
            } else if (map[r][c + 2] === '[') {
                if (moveBox(m, r, c + 2)) {
                    debug(`  case 24: `);
                    swap(r, c + 1, r, c + 2);
                    swap(r, c, r, c + 1);
                    movedBox = true;
                }
            }
            break;
    }

    if (!movedBox) {
        debug(`    failed to move box`);
    }
    return movedBox;
}


function printMap(override: boolean = false) {
    if (DEBUG || override) {
        console.clear();

        let row = '  ';
        for (let c = 0; c < map[0].length; c++) {
            row += c < 10 ? ' ' : Math.floor(c / 10);
        }
        console.log(row);
        row = '  ';
        for (let c = 0; c < map[0].length; c++) {
            row += `${c % 10}`;
        }
        console.log(row);

        for (let r = 0; r < map.length; r++) {
            let row = r < 10 ? ` ${r}` : `${Math.floor(r / 10)}${r % 10}`;
            row += map[r].join('');
            console.log(row);
        }
        console.log();

        const DELAY = 50000000;
        for (let x = 0; x < DELAY; x++) {
            ;
        }
    }
}
