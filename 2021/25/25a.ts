
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

let map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

// console.log(`Initial state:`);
// printMap();

let STEPS = 1000;
let stopStep = -1;
for (let i = 0; i < STEPS; i++) {
    let newMap: string[][] = [];
    let moved = false;

    for (let r = 0; r < map.length; r++) {
        newMap[r] = [];
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] === '>') {
                if (c < map[0].length - 1) {
                    if (map[r][c + 1] === '.') {
                        newMap[r][c] = '.';
                        newMap[r][c + 1] = '>';
                        moved = true;
                    } else {
                        newMap[r][c] = map[r][c];
                    }
                } else {
                    if (map[r][0] === '.') {
                        newMap[r][c] = '.';
                        newMap[r][0] = '>';
                        moved = true;
                    } else {
                        newMap[r][c] = map[r][c];
                    }
                }
            } else {
                if (!newMap[r][c]) {
                    newMap[r][c] = map[r][c];
                }
            }
        }
    }

    map = newMap;
    newMap = [];

    for (let r = 0; r < map.length; r++) {
        newMap[r] = [];
    }

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] === 'v') {
                if (r < map.length - 1) {
                    if (map[r + 1][c] === '.') {
                        newMap[r][c] = '.'
                        newMap[r + 1][c] = 'v'
                        moved = true;
                    } else {
                        newMap[r][c] = map[r][c];
                    }
                } else {
                    if (map[0][c] === '.') {
                        newMap[r][c] = '.'
                        newMap[0][c] = 'v'
                        moved = true;
                    } else {
                        newMap[r][c] = map[r][c];
                    }
                }
            } else {
                if (!newMap[r][c]) {
                    newMap[r][c] = map[r][c];
                }
            }
        }
    }

    map = newMap;

    console.log(`After ${i + 1} steps:`);
    // printMap();

    if (!moved) { stopStep = i; break; }
}

console.log(stopStep + 1);


function printMap() {
    for (let r = 0; r < map.length; r++) {
        console.log(map[r].join(''));
    }
    console.log();
}
