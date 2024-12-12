// --- Part Two ---
// As you finish identifying the misplaced items, the Elves come to you with another issue.

// For safety, the Elves are divided into groups of three. Every Elf carries a badge that identifies
// their group. For efficiency, within each group of three Elves, the badge is the only item type carried
// by all three Elves. That is, if a group's badge is item type B, then all three Elves will have item
// type B somewhere in their rucksack, and at most two of the Elves will be carrying any other item type.

// The problem is that someone forgot to put this year's updated authenticity sticker on the badges.
// All of the badges need to be pulled out of the rucksacks so the new authenticity stickers can be attached.

// Additionally, nobody wrote down which item type corresponds to each group's badges. The only way to tell
// which item type is the right one is by finding the one item type that is common between all three Elves in each group.

// Every set of three lines in your list corresponds to a single group, but each group can have a different badge
// item type. So, in the above example, the first group's rucksacks are the first three lines:

// vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg

// And the second group's rucksacks are the next three lines:

// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw

// In the first group, the only item type that appears in all three rucksacks is lowercase r; this must be their
// badges. In the second group, their badge item type must be Z.

// Priorities for these items must still be found to organize the sticker attachment efforts: here, they are
// 18 (r) for the first group and 52 (Z) for the second group. The sum of these is 70.

// Find the item type that corresponds to the badges of each three-Elf group. What is the sum of the priorities of those item types?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./3.input', 'utf-8');

const lines = file.split('\n');

let sumOfPriorities = 0;

function itemToPriority(x: string): number {
    const code = x.charCodeAt(0);
    if (code < 91) { return code - 38; }
    else           { return code - 96; }
}

for (let i = 0; i < lines.length; i += 3) {
    if (lines[i].length === 0) { continue; }

    const firstRucksack = lines[i];
    const secondRucksack = lines[i+1];
    const thirdRucksack = lines[i+2];

    const commonContents = new Set<string>(
        [...firstRucksack].filter(x => {
            // console.log(`   checking if second includes ${x}: ${secondRucksack.includes(x)}`);
            // console.log(`   checking if third includes ${x}: ${thirdRucksack.includes(x)}`);
            return secondRucksack.includes(x) && thirdRucksack.includes(x);
        })
    );

    // console.log(`first:  ${firstRucksack}`);
    // console.log(`second: ${secondRucksack}`);
    // console.log(`third:  ${thirdRucksack}`);
    // console.log(`  common:`);
    // console.log(commonContents);

    commonContents.forEach(x => {
        // console.log(`  adding ${itemToPriority(x)}`);
        sumOfPriorities += itemToPriority(x);
    });

    // console.log(``);
}

console.log(sumOfPriorities);
