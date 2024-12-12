
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./3.input', 'utf-8');

const lines = file.split('\n');

function isDigit(c: string): boolean {
    return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
}

function isSymbol(c: string): boolean {
    // console.log(`isSymbol(${c})`);
    return !isDigit(c) && c !== '.';
}

function checkPartNumber(schematic: string[][], row: number, col: number): boolean {
    const neighbors: string[] = [];
    // console.log(`  row: ${row}, col: ${col}: ${schematic[row][col]}`);

    if (row > 0) {
        // console.log(`  schematic row-1: ${schematic[row-1].join('')}`);
        if (col > 0) { neighbors.push(schematic[row-1][col-1]); }
        neighbors.push(schematic[row-1][col]);
        if (col < schematic[0].length - 1) { neighbors.push(schematic[row-1][col+1]); }
    }

    // console.log(`  schematic row  : ${schematic[row].join('')}`);
    if (col > 0) { neighbors.push(schematic[row][col-1]); }
    if (col < schematic[0].length - 1) { neighbors.push(schematic[row][col + 1]); }

    if (row < schematic.length - 1) {
        // console.log(`  schematic row+1: ${schematic[row+1].join('')}`);
        if (col > 0) { neighbors.push(schematic[row+1][col-1]); }
        neighbors.push(schematic[row+1][col]);
        if (col < schematic[0].length - 1) { neighbors.push(schematic[row+1][col+1]); }
    }

    // console.log('neighbors: ' + neighbors.join(''));

    return neighbors.filter(x => isSymbol(x)).length > 0;
}

let sum = 0;
let schematic: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    schematic[i] = lines[i].split('');
}

for (let row = 0; row < schematic.length; row++) {
    // if (row > 0)                    { console.log(`row - 1: ${schematic[row-1].join('')}`); }
    //                                   console.log(`row    : ${schematic[row].join('')}`);
    // if (row < schematic.length - 1) { console.log(`row + 1: ${schematic[row+1].join('')}`); }

    let inPartNumber = false;

    let startOfPartNumber = -1;
    for (let col = 0; col <= schematic[0].length; col++) {
        if (col < schematic[0].length && isDigit(schematic[row][col])) {
            if (!inPartNumber) {
                inPartNumber = true;
                startOfPartNumber = col;
            }
        } else {
            if (inPartNumber) {
                // console.log(`checking if ${schematic[row].slice(startOfPartNumber, col).join('')} is a part number...`);

                for (let j = startOfPartNumber; j < col; j++) {
                    if (checkPartNumber(schematic, row, j)) {
                        // console.log(`  it's a part number`);
                        sum += parseInt(schematic[row].slice(startOfPartNumber, col).join(''));
                        break;
                    }
                }
            }
            inPartNumber = false;
        }
    }

    // console.log('');
}

console.log(sum);
