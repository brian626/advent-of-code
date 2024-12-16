
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];
let movements: string[] = [];
let parsingMap = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingMap = false; continue; }

    if (parsingMap) {
        map.push(lines[i].split(''));
    } else {
        const movementLine = lines[i].split('');
        movements = movements.concat(movementLine);
    }
}


// console.log(map);
// console.log(movements);

let rRobot = 0, cRobot = 0;

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '@') {
            [rRobot, cRobot] = [r, c];
            break;
        }
    }
}

// console.log(`Initial state:`);
// printMap();

for (const m of movements) {
    move(m);
    // console.log(`Move ${m}:`)
    // printMap();
}

console.log(`Final state:`);
printMap();

let score = 0;
for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === 'O') {
            // console.log(`adding ${c} + ${r*100} = ${c + r*100}`);
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
                if (map[rRobot - 1][cRobot] === '.') {
                    rRobot -= 1;
                } else if (map[rRobot - 1][cRobot] === 'O' && moveBox(m, rRobot - 1, cRobot)) {
                    rRobot -= 1;
                }
            }
            break;

        case 'v':
            if (rRobot < map.length - 1) {
                if (map[rRobot + 1][cRobot] === '.') {
                    rRobot += 1;
                } else if (map[rRobot + 1][cRobot] === 'O' && moveBox(m, rRobot + 1, cRobot)) {
                    rRobot += 1;
                }
            }
            break

        case '<':
            if (cRobot > 1) {
                if (map[rRobot][cRobot - 1] === '.') {
                    cRobot -= 1;
                } else if (map[rRobot][cRobot - 1] === 'O' && moveBox(m, rRobot, cRobot - 1)) {
                    cRobot -= 1;
                }
            }
            break;

        case '>':
            if (cRobot < map[0].length - 1) {
                if (map[rRobot][cRobot + 1] === '.') {
                    cRobot += 1;
                } else if (map[rRobot][cRobot + 1] === 'O' && moveBox(m, rRobot, cRobot + 1)) {
                    cRobot += 1;
                }
            }
            break;
    }

    console.log(`moving robot from [${originalRRobot},${originalCRobot}] (${map[originalRRobot][originalCRobot]}) to [${rRobot},${cRobot}] (${map[rRobot][cRobot]})`);
    const temp = map[originalRRobot][originalCRobot];
    map[originalRRobot][originalCRobot] = map[rRobot][cRobot];
    map[rRobot][cRobot] = temp;
    // console.log(`moved robot from [${originalRRobot},${originalCRobot}] (${map[originalRRobot][originalCRobot]}) to [${rRobot},${cRobot}] (${map[rRobot][cRobot]})`);
}


function moveBox(m: string, r: number, c: number): boolean {
    let movedBox = false;

    switch (m) {
        case '^':
            if (map[r - 1][c] === '.') {
                console.log(`moving box from [${r},${c}] to [${r - 1},${c}]`);
                const temp = map[r - 1][c];
                map[r - 1][c] = map[r][c];
                map[r][c] = temp;
                movedBox = true;
            } else if (map[r - 1][c] === 'O') {
                if (moveBox(m, r - 1, c)) {
                    const temp = map[r - 1][c];
                    map[r - 1][c] = map[r][c];
                    map[r][c] = temp;
                    movedBox = true;
                }
            }
            break;

        case 'v':
            if (map[r + 1][c] === '.') {
                console.log(`moving box from [${r},${c}] to [${r + 1},${c}]`);
                const temp = map[r + 1][c];
                map[r + 1][c] = map[r][c];
                map[r][c] = temp;
                movedBox = true;
            } else if (map[r + 1][c] === 'O') {
                if (moveBox(m, r + 1, c)) {
                    const temp = map[r + 1][c];
                    map[r + 1][c] = map[r][c];
                    map[r][c] = temp;
                    movedBox = true;
                }
            }
            break;

        case '<':
            if (map[r][c - 1] === '.') {
                console.log(`moving box from [${r},${c}] to [${r},${c - 1}]`);
                const temp = map[r][c - 1];
                map[r][c - 1] = map[r][c];
                map[r][c] = temp;
                movedBox = true;
            } else if (map[r][c - 1] === 'O') {
                if (moveBox(m, r, c - 1)) {
                    const temp = map[r][c - 1];
                    map[r][c - 1] = map[r][c];
                    map[r][c] = temp;
                    movedBox = true;
                }
            }
            break;

        case '>':
            if (map[r][c + 1] === '.') {
                console.log(`moving box from [${r},${c}] to [${r},${c + 1}]`);
                const temp = map[r][c + 1];
                map[r][c + 1] = map[r][c];
                map[r][c] = temp;
                movedBox = true;
            } else if (map[r][c + 1] === 'O') {
                if (moveBox(m, r, c + 1)) {
                    const temp = map[r][c + 1];
                    map[r][c + 1] = map[r][c];
                    map[r][c] = temp;
                    movedBox = true;
                }
            }
            break;
    }

    return movedBox;
}


function printMap() {
    for (let r = 0; r < map.length; r++) {
        console.log(map[r].join(''));
    }
    console.log();
}
