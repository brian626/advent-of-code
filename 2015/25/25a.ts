
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./25.test', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

}

let r = 1;
let c = 1;
let val = 20151125;
let prev = val;
let nextRow = 2;

while (true) {
    // console.log(`[${r}, ${c}]: ${val}`);
    r -= 1;
    c += 1;

    if (r <= 0) {
        r = nextRow;
        nextRow += 1;
        c = 1;
    }

    const temp = val;
    val = (val * 252533) % 33554393;
    prev = temp;

    if (r === 3010 && c === 3019) { break; }
}

console.log(val);
