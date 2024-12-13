
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

const allowedIPs: number[] = [];

for (let i = 0; i < lines.length; i++) {
    console.log(i);
    if (lines[i].length === 0) { continue; }

    const [low, high] = lines[i].split('-').map(x => parseInt(x));
    // console.log(`considering blacklist ${low}-${high}`);

    for (let i = low; i <= high; i++) {
        allowedIPs[i] = 0;
    }
}

for (let i = 0; i < Math.pow(2,32); i++) {
    if (allowedIPs[i] === undefined) {
        console.log(`${i} is the lowest unblocked IP`);
        break;
    }
}
