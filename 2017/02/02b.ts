
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./02.input', 'utf-8');

const lines = file.split('\n');

let checksum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const values: number[] = lines[i].replace(/\s+/g, ' ').split(' ').map(x => parseInt(x));

    let foundPair = false;

    for (let a = 0; a < values.length; a++) {
        for (let b = a + 1; b < values.length; b++) {
            console.log(values[a], values[b]);
            if (values[a] % values[b] === 0) {
                console.log(`case 1: adding ${values[a] % values[b]}`);
                checksum += (values[a] / values[b]);
                foundPair = true;
                break;
            } else if (values[b] % values[a] === 0) {
                console.log(`case 2: adding ${values[b] % values[a]}`);
                checksum += (values[b] / values[a]);
                foundPair = true;
                break;
            }
        }

        if (foundPair) { break; }
    }
}

console.log(checksum);
