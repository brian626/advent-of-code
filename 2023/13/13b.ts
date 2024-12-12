
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

function linesMatch(l1: string, l2: string): [boolean, boolean] {
    if (l1 === l2) {
        console.log(`lines ${l1} and ${l2} match exactly`);
        return [true, true];
    }

    let numDifferences = 0;
    for (let i = 0; i < l1.length; i++) {
        if (l1[i] !== l2[i]) { numDifferences += 1; }
    }

    if (numDifferences === 1) {
        console.log(`lines ${l1} and ${l2} match with one smudge`);
    } else {
        console.log(`lines ${l1} and ${l2} do not match`);
    }
    return [numDifferences === 1, false];
}

function findHorizontalLine(pattern: string[][]): number {
    let line = -1;

    // Check if there is a horizontal line between rows r and (r+1)
    let usedFuzzyMatch = false;
    for (let r = 0; r < pattern.length - 1; r++) {
        let upper = r;
        let lower = r+1;

        while (upper >= 0 && lower < pattern.length) {
            const [matched, exactMatch] = linesMatch(pattern[upper].join(''), pattern[lower].join(''));
            if (!matched) {
                line = -1;
                usedFuzzyMatch = false;
                break;
            } else {
                if (!usedFuzzyMatch) {
                    usedFuzzyMatch = !exactMatch;
                }
            }

            line = r;
            upper -= 1;
            lower += 1;
        }

        if (line >= 0 && usedFuzzyMatch) {
            break;
        }
    }

    if (!usedFuzzyMatch || line === -1) {
        console.log(`  no horizontal line\n`);
        return -1;
    } else {
        console.log(`  horizontal line between rows ${line} and ${line+1}\n`);
        return line + 1;
    }
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
    let usedFuzzyMatch = false;
    for (let c = 0; c < pattern[0].length - 1; c++) {
        let left = c;
        let right = c+1;

        while (left >= 0 && right < pattern[0].length) {
            const [matched, exactMatch] = linesMatch(getColumn(pattern, left), getColumn(pattern, right));
            if (!matched) {
                line = -1;
                usedFuzzyMatch = false;
                break;
            } else {
                if (!usedFuzzyMatch) {
                    usedFuzzyMatch = !exactMatch;
                }
            }

            line = c;
            left -= 1;
            right += 1;
        }

        if (line >= 0 && usedFuzzyMatch) {
            break;
        }
    }

    if (!usedFuzzyMatch || line === -1) {
        console.log(`  no vertical line\n`);
        return -1;
    } else {
        console.log(`  vertical line between columns ${line} and ${line+1}\n`);
        return line + 1;
    }
}

function printPattern(pattern: string[][]) {
    for (let r = 0; r < pattern.length; r++) {
        console.log(pattern[r].join(''));
    }
    console.log();
}

// 29842 is too low
// 38496 is too high
