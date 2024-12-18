// --- Part Two ---
// Finish folding the transparent paper according to the instructions. The manual
// says the code is always eight capital letters.

// What code do you use to activate the infrared thermal imaging camera system?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

class Dot {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    x: number;
    y: number;
}

class Fold {
    constructor(direction: string, position: number) {
        this.direction = direction;
        this.position = position;
    }

    direction: string;
    position: number;
}

const dots: Dot[] = new Array();
const folds: Fold[] = new Array();
let xMax = 0;
let yMax = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let parts = lines[i].split(',');
    if (parts.length === 2) {
        const dot = new Dot(parseInt(parts[0]), parseInt(parts[1]));
        dots.push(dot);

        xMax = Math.max(xMax, dot.x);
        yMax = Math.max(yMax, dot.y);
    } else {
        parts = lines[i].split(' ');
        const foldParts = parts[2].split('=');
        const fold = new Fold(foldParts[0], parseInt(foldParts[1]));
        folds.push(fold);
    }
}

// Perform the first fold.
folds.forEach(f => {
    if (f.direction === 'y') {
        // Fold the bottom section up.
        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            if (dot.y > f.position) {
                dot.y = (yMax - dot.y);
            }
        }

        yMax = f.position - 1;
    } else {
        // Fold the right section to the left.
        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            if (dot.x > f.position) {
                dot.x = (xMax - dot.x);
            }
        }

        xMax = f.position - 1;
    }
})

printPaper(dots);

// Print the results.
function printPaper(dots: Dot[]) {
    const paper: string[][] = new Array();
    for (let r = 0; r <= yMax; r++) {
        paper[r] = new Array();
        for (let c = 0; c <= xMax; c++) {
            paper[r][c] = '.';
        }
    }

    dots.forEach(d => {
        paper[d.y][d.x] = '#';
    })

    paper.forEach(line => {
        console.log(line.join(''));
    })
}
