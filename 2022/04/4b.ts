// --- Part Two ---
// It seems like there is still quite a bit of duplicate work planned. Instead, the Elves would
// like to know the number of pairs that overlap at all.

// In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't overlap, while the remaining
// four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and 2-6,4-8) do overlap:

// 5-7,7-9 overlaps in a single section, 7.
// 2-8,3-7 overlaps all of the sections 3 through 7.
// 6-6,4-6 overlaps in a single section, 6.
// 2-6,4-8 overlaps in sections 4, 5, and 6.

// So, in this example, the number of overlapping assignment pairs is 4.

// In how many assignment pairs do the ranges overlap?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./4.input', 'utf-8');

const lines = file.split('\n');

let overlappingPairs = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const ranges = lines[i].split(',').sort();
    const firstLow = parseInt(ranges[0].split('-')[0]);
    const firstHigh = parseInt(ranges[0].split('-')[1]);
    const secondLow = parseInt(ranges[1].split('-')[0]);
    const secondHigh = parseInt(ranges[1].split('-')[1]);

    if (secondLow <= firstHigh && secondHigh >= firstLow) {
        // console.log(`${ranges} overlap because ${secondLow} <= ${firstHigh}`);
        overlappingPairs++;
    }
}

console.log(overlappingPairs);
