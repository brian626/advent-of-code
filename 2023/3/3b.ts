
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

function checkPartNumber(schematic: string[][], row: number, col: number): [boolean, number, number] {
    if (row > 0) {
        if (col > 0 && schematic[row-1][col-1] === '*') { return [true, row-1, col-1]; }
        if (           schematic[row-1][col] === '*')   { return [true, row-1, col]; }
        if (col < schematic[0].length - 1 && schematic[row-1][col+1] === '*') { return [true, row-1, col+1]; }
    }

    if (col > 0 && schematic[row][col-1] === '*') { return [true, row, col-1]; }
    if (col < schematic[0].length - 1 && schematic[row][col + 1] === '*') { return [true, row, col+1]; }

    if (row < schematic.length - 1) {
        if (col > 0 && schematic[row+1][col-1] === '*') { return [true, row+1, col-1]; }
        if (           schematic[row+1][col] === '*')   { return [true, row+1, col]; }
        if (col < schematic[0].length - 1 && schematic[row+1][col+1] === '*') { return [true, row+1, col+1]; }
    }

    return [false, 0, 0];
}

let partNumbers: string[] = [];
let gearNeighbors: Map<string, string[]> = new Map<string, string[]>();
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
                console.log(`checking if ${schematic[row].slice(startOfPartNumber, col).join('')} is a part number...`);

                for (let j = startOfPartNumber; j < col; j++) {
                    const [isPartNumber, gearRow, gearCol] = checkPartNumber(schematic, row, j);
                    if (isPartNumber) {
                        console.log(`  it's a part number`);
                        const partNumber = schematic[row].slice(startOfPartNumber, col).join('');
                        partNumbers.push(partNumber);

                        const gearPos = `${gearRow},${gearCol}`;
                        if (gearNeighbors.has(gearPos)) {
                            const n = gearNeighbors.get(gearPos);
                            n.push(partNumber);
                            gearNeighbors.set(gearPos, n);
                        } else {
                            gearNeighbors.set(gearPos, [partNumber]);
                        }
                        break;
                    }
                }
            }
            inPartNumber = false;
        }
    }

    // console.log('');
}

console.log(gearNeighbors);

let sum = [...gearNeighbors.entries()].filter(x => x[1].length === 2).map(x => x[1]).map(x => parseInt(x[0]) * parseInt(x[1])).reduce((x, y) => x + y);

console.log(sum);
