
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

let key = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    key = lines[i];
}

// console.log(key);

const SIZE = 128;

let grid: string[][] = [];

for (let r = 0; r < SIZE; r++) {
    // grid[r] = [];

    const hashInput = `${key}-${r}`;
    // console.log(hashInput);
    const hash = knotHash(hashInput);
    // console.log(hash);
    const bits = hash.split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0'));
    // console.log(bits);
    let row = '';
    for (let c = 0; c < SIZE; c++) {
        row += bits[c];
    }
    grid[r] = row.split('');
    // console.log(row.slice(0, SIZE));
}

for (let i = 0; i < 8; i++) {
    console.log(grid[i].slice(0, 8).join(''));
}

let regions = 0;
for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === '1') {
            regions++;
            markRegion(r, c);
        }
    }
}

console.log(regions);

function markRegion(r: number, c: number): void {
    grid[r][c] = '2';

    if (r > 0) {
        if (grid[r-1][c] === '1') { markRegion(r-1, c); }
    }
    if (r < grid.length - 1) {
        if (grid[r+1][c] === '1') { markRegion(r+1, c); }
    }
    if (c > 0) {
        if (grid[r][c-1] === '1') { markRegion(r, c-1); }
    }
    if (c < grid[0].length - 1) {
        if (grid[r][c+1] === '1') { markRegion(r, c+1); }
    }
}


function knotHash(s: string): string {
    let inputLengths: number[] = s.split('').map(x => x.charCodeAt(0));

    inputLengths = inputLengths.concat([17, 31, 73, 47, 23]);
    // debug(inputLengths.toString());

    let list: number[] = [];
    for (let i = 0; i < 256; i++) {
        list.push(i);
    }

    // debug(list.toString());

    let currentPosition = 0;
    let skipSize = 0;
    for (let x = 0; x < 64; x++) {
        for (let y = 0; y < inputLengths.length; y++) {
            const length = inputLengths[y];
            // debug(`reverse ${length} elements starting at position ${currentPosition}`);

            // Left-shift the list so that the rotation doesn't wrap
            for (let i = 0; i < currentPosition; i++) {
                list.push(list.shift());
            }
            // debug(`  left-shifted: ${list}`);

            list = list.slice(0, length).reverse().concat(list.slice(length));
            // debug(`  left-shifted and rotated: ${list}`);

            // Shift the list back
            for (let i = 0; i < currentPosition; i++) {
                list.unshift(list.pop());
            }
            // debug(`  rotated: ${list}`);

            currentPosition += (length + skipSize);
            while (currentPosition > list.length) {
                currentPosition -= list.length;
            }
            skipSize++;

            // debug(list.toString());
        }
    }

    // Convert list to dense hash
    let denseHash: number[] = [];
    for (let i = 0; i < 16; i++) {
        let dh = list[i * 16];
        for (let j = 1; j < 16; j++) {
            dh = dh ^ list[(i * 16) + j];
        }

        denseHash[i] = dh;
    }

    // Convert dense hash to ASCII
    let output = '';
    for (const d of denseHash) {
        let a = d.toString(16);
        if (a.length === 1) { a = '0' + a; }
        output += a;
    }

    return output;
}
