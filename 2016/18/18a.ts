
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

let firstRow: string = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    firstRow = lines[i];
}

const rows: string[] = [firstRow];

while (rows.length < 40) {
    const lastRow = rows[rows.length - 1];
    let nextRow: string[] = [];

    nextRow[0] = isTrap('', lastRow[0], lastRow[1]);

    for (let i = 1; i < rows[0].length - 1; i++) {
        nextRow[i] = isTrap(lastRow[i-1], lastRow[i], lastRow[i+1]);
    }

    nextRow[rows[0].length - 1] = isTrap(lastRow[rows[0].length - 2], lastRow[rows[0].length - 1], '');

    rows.push(nextRow.join(''));
}

// printMap(rows);

let count = 0;

for (const r of rows) {
    count += r.split('').filter(x => x === '.').length;
}

console.log(count);


function isTrap(l: string, c: string, r: string): string {
    if ((l === '^' && c === '^' && r !== '^') ||
        (c === '^' && r === '^' && l !== '^') ||
        (l === '^' && c !== '^' && r !== '^') ||
        (l !== '^' && c !== '^' && r === '^')) {
            return '^';
        }

    return '.';
}


function printMap(rows: string[]): void {
    for (const r of rows) {
        console.log(r);
    }

    console.log();
}
