
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

const screen: string[][] = [];
const ROWS = 6;
const COLS = 50;

for (let r = 0; r < ROWS; r++) {
    screen[r] = [];

    for (let c = 0; c < COLS; c++) {
        screen[r][c] = '.';
    }
}

// printScreen();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('rect')) {
        drawRect(lines[i].slice(5));
    } else if (lines[i].startsWith('rotate column')) {
        rotateColumn(lines[i].slice(16));
    } else if (lines[i].startsWith('rotate row')) {
        rotateRow(lines[i].slice(13));
    }

    // printScreen();
}

printScreen();

let count = 0;
for (let r = 0; r < ROWS; r++) {
    count += screen[r].filter(x => x === '#').length;
}
console.log(count);


function drawRect(s: string): void {
    const [a, b] = s.split('x').map(x => parseInt(x));
    for (let r = 0; r < b; r++) {
        for (let c = 0; c < a; c++) {
            screen[r][c] = '#';
        }
    }
}


function rotateColumn(s: string): void {
    const [a, _1, b] = s.split(' ').map(x => parseInt(x));
    const columnA = screen.map(x => x[a]);
    for (let i = 0; i < b; i++) {
        columnA.unshift(columnA.pop());
    }

    for (let i = 0; i < ROWS; i++) {
        screen[i][a] = columnA[i];
    }
}


function rotateRow(s: string): void {
    const [a, _1, b] = s.split(' ').map(x => parseInt(x));
    const rowA = screen[a];
    for (let i = 0; i < b; i++) {
        rowA.unshift(rowA.pop());
    }

    for (let i = 0; i < COLS; i++) {
        screen[a][i] = rowA[i];
    }
}


function printScreen(): void {
    for (let r = 0; r < ROWS; r++) {
        console.log(screen[r].join(''));
    }

    console.log();
}
