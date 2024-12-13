
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

const blockedIPs: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // if (i % 25 === 0) { console.log(i); }

    const [low, high] = lines[i].split('-').map(x => parseInt(x));
    console.log(`Considering range ${low}-${high}`);

    let addNewRange = true;

    for (let j = 0; j < blockedIPs.length; j++) {
        const [blockedLow, blockedHigh] = blockedIPs[j];

        // Case 1: New range has no overlap
        if ((low < blockedLow && high < blockedLow) ||
            (low > blockedHigh && high > blockedHigh)) {
            // console.log(`  No overlap with ${blockedLow}-${blockedHigh}`)
            continue;
        }

        // Case 2: New range overlaps entirely
        if (low >= blockedLow && high <= blockedHigh) {
            console.log(`  Overlaps entirely with ${blockedLow}-${blockedHigh} - disregard`);
            addNewRange = false;
            break;
        }

        // Case 3: New range overlaps low end of this range
        if (low < blockedLow && high > blockedLow && high <= blockedHigh) {
            console.log(`  Overlaps low end of ${blockedLow}-${blockedHigh}, extend existing range`);
            blockedIPs[j][0] = low;
            addNewRange = false;
            break;
        }

        // Case 4: New range overlaps high end of this range
        if (low <= blockedHigh && high > blockedHigh) {
            console.log(`  Overlaps high end of ${blockedLow}-${blockedHigh}, extend existing range`);
            blockedIPs[j][1] = high;
            addNewRange = false;
            break;
        }
    }

    if (addNewRange) {
        console.log(`  Adding new range ${low}-${high}`);
        blockedIPs.push([low, high]);
    }

    blockedIPs.sort((a, b) => a[0] - b[0]);
}

console.log();
console.log(blockedIPs);
console.log();

let unBlockedIP = 0;
for (let j = 0; j < blockedIPs.length; j++) {
    const [low, high] = blockedIPs[j];

    while (true) {
        if (unBlockedIP < low) {
            console.log(`first unblocked IP is ${unBlockedIP} because ${unBlockedIP} < ${low}`);
            exit();
        } else if (unBlockedIP > high) {
            // console.log(`range doesn't apply`);
            break;
        } else {
            // console.log(`${unBlockedIP} is blocked`);
        }

        unBlockedIP++;
    }
}
