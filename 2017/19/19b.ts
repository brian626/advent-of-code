
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    grid[i] = lines[i].split('');
}

let rPos = 0, cPos = -1;
let width = grid[0].length, height = grid.length;

for (let c = 0; c < width; c++) {
    if (grid[0][c] === '|') {
        cPos = c;
        break;
    }
}

console.log(`starting at [${rPos},${cPos}]`);

let path = '';
let steps = 1;

let direction = 2; // 0: up, 1: right, 2: down, 3: left

while (true) {
    switch (direction) {
        case 0: rPos -= 1; break;
        case 1: cPos += 1; break;
        case 2: rPos += 1; break;
        case 3: cPos -= 1; break;
    }

    // console.log(`moved to [${rPos},${cPos}]`);

    let finished = false;

    switch (grid[rPos][cPos]) {
        case '|':
            // console.log(`  continuing`);
            break;

        case '-':
            // console.log(`  continuing`);
            break;

        case '+':
            if (direction === 0 || direction === 2) {
                // console.log(`  turning left or right`);
                if (/[A-Z-]/.test(grid[rPos][cPos-1])) { direction = 3; }
                else if (/[A-Z-]/.test(grid[rPos][cPos+1])) { direction = 1; }
            } else if (direction === 1 || direction === 3) {
                // console.log(`  turning up or down`);
                if (/[A-Z|]/.test(grid[rPos-1][cPos])) { direction = 0; }
                else if (/[A-Z|]/.test(grid[rPos+1][cPos])) { direction = 2; }
            } else {
                console.log('huh');
            }
            break;

        case ' ':
            steps--;
            finished = true;
            break;

        default:
            // console.log(`  picking up ${grid[rPos][cPos]}`);
            path += grid[rPos][cPos];
            break;
    }

    steps++;
    if (finished) { break; }
}

console.log(path);
console.log(steps);
