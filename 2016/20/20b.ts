
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

let blockedIPs: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    blockedIPs.push(lines[i].split('-').map(x => parseInt(x)));
}

blockedIPs.sort((a, b) => a[0] - b[0]);


console.log(`Counting unblocked IPs...`);
const testIPs = blockedIPs.map(x => x[1] + 1);
let unblockedIPCount = 0;
for (let t of testIPs) {
    while (isUnblocked(t)) {
        // console.log(`${t} is unblocked!`)
        t++;
        unblockedIPCount++;
    }
}

console.log(`There are ${unblockedIPCount} IPs allowed.`);

function isUnblocked(n: number): boolean {
    // console.log(`testing ${n}`);
    if (n >= Math.pow(2, 32)) { return false; }

    for (const [low, high] of blockedIPs) {
        if (n >= low && n <= high) {
            return false;
        }
    }

    return true;
}
