
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

const rules: Map<string, string> = new Map<string, string>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let [input, output] = lines[i].split(' => ');
    input = input.replace(/\//g, '');
    rules.set(input, output);
    rules.set(rotate(input), output);
    rules.set(rotate(rotate(input)), output);
    rules.set(rotate(rotate(rotate(input))), output);
    rules.set(flipVert(input), output);
    rules.set(flipHoriz(input), output);
    rules.set(flipVert(rotate(input)), output);
    rules.set(flipHoriz(rotate(input)), output);
}

// console.log(rules);


let grid: string[][] = [
    ['.', '#', '.'],
    ['.', '.', '#'],
    ['#', '#', '#'],
];


console.log(`Initial state`);
console.log(grid);
console.log();

const ITERATIONS = 4;
for (let i = 0; i < ITERATIONS; i++) {
    console.log(`Iteration ${i + 1}`);

    const subsquares = divide(grid);
    console.log(`  Divided grid into ${subsquares.length} subsquares`);

    const newSubsquares: string[] = [];

    for (const ss of subsquares) {
        const output = rules.get(matrixToString(ss));
        console.log(`  Converting ${matrixToString(ss)} to ${output}`);

        // console.log(stringToMatrix(output));
        newSubsquares.push(output);
    }

    // join subsquares back into a single grid
    if (newSubsquares.length === 1) {
        grid = newSubsquares[0].split('/').map(x => x.split(''));
    } else if (newSubsquares.length === 4) {
        grid[0] = (newSubsquares[0].split('/')[0] + newSubsquares[1].split('/')[0]).split('');
        grid[1] = (newSubsquares[0].split('/')[1] + newSubsquares[1].split('/')[1]).split('');
        grid[2] = (newSubsquares[0].split('/')[2] + newSubsquares[1].split('/')[2]).split('');
        grid[3] = (newSubsquares[2].split('/')[0] + newSubsquares[3].split('/')[0]).split('');
        grid[4] = (newSubsquares[2].split('/')[1] + newSubsquares[3].split('/')[1]).split('');
        grid[5] = (newSubsquares[2].split('/')[2] + newSubsquares[3].split('/')[2]).split('');
    } else if (newSubsquares.length === 9) {
        const rowLen = newSubsquares[0].split('/')[0].length;
        for (let j = 0; j < newSubsquares.length; j++) {
            grid[j] = (newSubsquares[j].split('/')[0] + newSubsquares[j].split('/')[1] + newSubsquares[j].split('/')[2]).split('');
            console.log(grid[j]);
        }
        // grid[0] = (newSubsquares[0].split('/')[0] + newSubsquares[1].split('/')[0] + newSubsquares[2].split('/')[0]).split('');
        // grid[1] = (newSubsquares[0].split('/')[1] + newSubsquares[1].split('/')[1] + newSubsquares[2].split('/')[1]).split('');
        // grid[2] = (newSubsquares[0].split('/')[2] + newSubsquares[1].split('/')[2] + newSubsquares[2].split('/')[2]).split('');
        // grid[3] = (newSubsquares[3].split('/')[0] + newSubsquares[4].split('/')[0] + newSubsquares[5].split('/')[0]).split('');
        // grid[4] = (newSubsquares[3].split('/')[1] + newSubsquares[4].split('/')[1] + newSubsquares[5].split('/')[1]).split('');
        // grid[5] = (newSubsquares[3].split('/')[2] + newSubsquares[4].split('/')[2] + newSubsquares[5].split('/')[2]).split('');
        // grid[6] = (newSubsquares[6].split('/')[0] + newSubsquares[7].split('/')[0] + newSubsquares[8].split('/')[0]).split('');
        // grid[7] = (newSubsquares[6].split('/')[1] + newSubsquares[7].split('/')[1] + newSubsquares[8].split('/')[1]).split('');
        // grid[8] = (newSubsquares[6].split('/')[2] + newSubsquares[7].split('/')[2] + newSubsquares[8].split('/')[2]).split('');
    }

    // console.log();
    // console.log(grid);
    // console.log(countOnPixels(grid));
    // console.log();

    console.log();
    printPattern(matrixToString(grid));
    console.log(countOnPixels(grid));
    console.log();
}

// printPattern(matrixToString(grid));
console.log(countOnPixels(grid));


function countOnPixels(g: string[][]): number {
    const size = g.length;

    let count = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (g[r][c] === '#') { count++; }
        }
    }

    return count;
}

// Turns abcd into ab cd or abcdef into abc def
//       efgh      ef gh    ghijkl      ghi jkl
//       ijkl               mnopqr      mno pqr
//       mnop      ij kl    stuvwx
//                 mn op    yz1234      stu vwx
//                          567890      yz1 234
//                                      567 890
function divide(grid: string[][]): string[][][] {
    // console.log(`divide(${grid}), length = ${grid.length}`);
    if (grid.length === 3 || grid.length === 2) {
        return [grid];
    }

    const dividedGrids: string[][][] = [];

    if (grid.length % 2 === 0) {
        for (let r = 0; r < grid.length; r += 2) {
            for (let c = 0; c < grid.length; c += 2) {
                dividedGrids.push([grid[r].slice(c, c + 2), grid[r + 1].slice(c, c + 2)]);
            }
        }
    } else {
        for (let r = 0; r < grid.length; r += 3) {
            for (let c = 0; c < grid.length; c += 3) {
                dividedGrids.push([grid[r].slice(c, c + 3), grid[r + 1].slice(c, c + 3), grid[r + 2].slice(c, c + 3)]);
            }
        }
    }

    return dividedGrids;
}


// Turns 12 into 13 or 123 into 147
//       34      24    456      258
//                     789      369
function transpose(s: string): string {
    const matrix = stringToMatrix(s);

    return matrixToString(matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex])));
}


// Turns 12 into 34 or 123 into 789
//       34      12    456      456
//                     789      123
function flipVert(s: string): string {
    const matrix = stringToMatrix(s);
    return matrixToString(matrix.reverse());
}


// Turns 12 into 21 or 123 into 321
//       34      43    456      654
//                     789      987
function flipHoriz(s: string): string {
    const matrix = stringToMatrix(s);
    return matrixToString(matrix.map(row => row.reverse()));
}


// Turns 12 into 31 or 123 into 741
//       34      42    456      852
//                     789      963
function rotate(s: string): string {
    return flipHoriz(transpose(s));
}


function stringToMatrix(s: string): string[][] {
    const gridSize = getGridSize(s);
    let matrix: string[][] = [];
    let r = 0, c = 0;
    for (let i = 0; i < s.length; i++) {
        if (!matrix[r]) { matrix[r] = []; }

        matrix[r][c] = s[i];
        c++;
        if (c === gridSize) {
            c = 0;
            r++;
        }
    }

    return matrix;
}

function matrixToString(m: string[][]): string {
    return m.map(x => x.join('')).join('');
}


function printPattern(s: string) {
    const gridSize = getGridSize(s);
    let sPtr = 0;
    for (let r = 0; r < gridSize; r++) {
        let row = '';
        for (let c = 0; c < gridSize; c++) {
            row += s[sPtr];
            sPtr++;
        }

        console.log(row);
    }

    console.log();
}

function getGridSize(s: string): number {
    return Math.sqrt(s.length);
}


// let input = '123456789';
// console.log(`original input`); printPattern(input);
// console.log(`rotated 90`); printPattern(rotate(input));
// console.log(`rotated 180`); printPattern(rotate(rotate(input)));
// console.log(`rotated 270`); printPattern(rotate(rotate(rotate(input))));
// console.log(`flipped vertical`); printPattern(flipVert(input));
// console.log(`flipped horizontal`); printPattern(flipHoriz(input));
// console.log(`rotated 90, then flipped vertical`); printPattern(flipVert(rotate(input)));
// console.log(`rotated 90, then flipped horizontal`); printPattern(flipHoriz(rotate(input)));

// let grid4 = [
//     ['a', 'b', 'c', 'd'],
//     ['e', 'f', 'g', 'h'],
//     ['i', 'j', 'k', 'l'],
//     ['m', 'n', 'o', 'p'],
// ];
// console.log(divide(grid4));

// let grid6 = [
//     ['a', 'b', 'c', 'd', 'e', 'f'],
//     ['g', 'h', 'i', 'j', 'k', 'l'],
//     ['m', 'n', 'o', 'p', 'q', 'r'],
//     ['s', 't', 'u', 'v', 'w', 'x'],
//     ['y', 'z', '1', '2', '3', '4'],
//     ['5', '6', '7', '8', '9', '0'],
// ];
// console.log(divide(grid6));
