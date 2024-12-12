// --- Part Two ---
// The Elves in accounting are thankful for your help; one of them even offers
// you a starfish coin they had left over from a past vacation. They offer you a
// second one if you can find three numbers in your expense report that meet the same criteria.

// Using the above example again, the three entries that sum to 2020 are 979, 366,
// and 675. Multiplying them together produces the answer, 241861950.

// In your expense report, what is the product of the three entries that sum to 2020?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./1.input', 'utf-8');

const lines = file.split('\n');

const entries: number[] = new Array();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    entries.push(parseInt(lines[i]));
}

for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
        for (let k = j + 1; k < entries.length; k++) {
            if ((entries[i] + entries[j] + entries[k]) === 2020) {
                console.log(entries[i] * entries[j] * entries[k]);
                break;
            }
        }
    }
}
