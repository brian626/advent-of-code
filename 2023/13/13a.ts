
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

let pattern: string[][] = [];
let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        // Analyze pattern
        printPattern(pattern);

        const horizontalLine = findHorizontalLine(pattern);
        if (horizontalLine > 0) {
            sum += (horizontalLine * 100);
        } else {
            const verticalLine = findVerticalLine(pattern);
            if (verticalLine > 0) {
                sum += verticalLine;
            }
        }

        pattern = [];
    } else {
        pattern.push(lines[i].split(''));
    }
}

console.log(sum);

function findHorizontalLine(pattern: string[][]): number {
    let line = -1;

    // Check if there is a horizontal line between rows r and (r+1)
    for (let r = 0; r < pattern.length - 1; r++) {
        let upper = r;
        let lower = r+1;
        // console.log(`findHorizontal starting with upper ${upper} and lower ${lower}`);
        while (upper >= 0 && lower < pattern.length) {
            // console.log(`  checking ${pattern[upper].join('')} against ${pattern[lower].join('')}`);
            if (pattern[upper].join('') !== pattern[lower].join('')) {
                // console.log(`    no match`);
                line = -1;
                break;
            }

            // console.log(`    match`);
            line = r;
            upper -= 1;
            lower += 1;
        }

        if (line >= 0) {
            break;
        }
    }

    if (line === -1) {
        console.log(`  no horizontal line`);
    } else {
        console.log(`  horizontal line between rows ${line} and ${line+1}`);
    }
    console.log();

    return line + 1;
}

function getColumn(pattern: string[][], c: number): string {
    let s = '';

    for (let r = 0; r < pattern.length; r++) {
        s += pattern[r][c];
    }

    return s;
}

function findVerticalLine(pattern: string[][]): number {
    let line = -1;

    // Check if there is a vertical line between columns c and (c+1)
    for (let c = 0; c < pattern[0].length - 1; c++) {
        let left = c;
        let right = c+1;
        // console.log(`findVertical starting with left ${left} and right ${right}`);
        while (left >= 0 && right < pattern[0].length) {
            // console.log(`  checking ${getColumn(pattern, left)} against ${getColumn(pattern, right)}`);
            if (getColumn(pattern, left) !== getColumn(pattern, right)) {
                // console.log(`    no match`);
                line = -1;
                break;
            }

            // console.log(`    match`);
            line = c;
            left -= 1;
            right += 1;
        }

        if (line >= 0) {
            break;
        }
    }

    if (line === -1) {
        console.log(`  no vertical line`);
    } else {
        console.log(`  vertical line between columns ${line} and ${line+1}`);
    }
    console.log();

    return line + 1;
}

function printPattern(pattern: string[][]) {
    for (let r = 0; r < pattern.length; r++) {
        console.log(pattern[r].join(''));
    }
    console.log();
}
