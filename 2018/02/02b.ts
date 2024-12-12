
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

const boxIds: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    boxIds.push(lines[i]);
}


for (let i = 0; i < boxIds.length; i++) {
    for (let j = i + 1; j < boxIds.length; j++) {
        if (haveOneDiff(boxIds[i], boxIds[j])) {
            console.log(boxIds[i], boxIds[j]);
            let s = '';
            for (let k = 0; k < boxIds[i].length; k++) {
                if (boxIds[j][k] === boxIds[i][k]) {
                    s += boxIds[i][k];
                }
            }

            console.log(s);
            exit();
        }
    }
}


function haveOneDiff(a: string, b: string): boolean {
    let diffs = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) { diffs++; }
        if (diffs > 1) { break; }
    }

    return diffs === 1;
}
