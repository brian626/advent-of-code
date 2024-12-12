// --- Day 7: Handy Haversacks ---
// You land at the regional airport in time for your next flight. In fact, it looks like you'll
// even have time to grab some food: all flights are currently delayed due to issues in luggage processing.

// Due to recent aviation regulations, many rules (your puzzle input) are being enforced about bags
// and their contents; bags must be color-coded and must contain specific quantities of other
// color-coded bags. Apparently, nobody responsible for these regulations considered how long
// they would take to enforce!

// For example, consider the following rules:

// light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.

// These rules specify the required contents for 9 bag types. In this example, every faded blue bag
// is empty, every vibrant plum bag contains 11 bags (5 faded blue and 6 dotted black), and so on.

// You have a shiny gold bag. If you wanted to carry it in at least one other bag, how many
// different bag colors would be valid for the outermost bag? (In other words: how many colors can,
// eventually, contain at least one shiny gold bag?)

// In the above rules, the following options would be available to you:

// A bright white bag, which can hold your shiny gold bag directly.
// A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
// A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
// A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
// So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4.

// How many bag colors can eventually contain at least one shiny gold bag? (The list of rules is
// quite long; make sure you get all of it.)

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./7.input', 'utf-8');

const lines = file.split('\n');

const bagRules: Map<string, string[]> = new Map<string, string[]>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let [outerBag, innerBags] = lines[i].split(' contain ');

    const digitsRegExp = new RegExp(/[1-9]+/, 'g');
    const bagsRegExp = new RegExp(/bags/, 'g');
    const bagRegExp = new RegExp(/bag/, 'g');
    outerBag = outerBag.replace(bagsRegExp, '').trim();
    innerBags = innerBags.replace('.', '').replace(digitsRegExp, '').replace(bagsRegExp, '').replace(bagRegExp, '');
    bagRules.set(outerBag, innerBags.split(',').map(x => x.trim()));
}

// console.log(bagRules);

let numBags = 0;
[...bagRules.entries()].forEach(([k,v]) => {
    // console.log(k, v);
    if (checkBags(k)) {
        numBags += 1;
    }
});

console.log(numBags);

function checkBags(bag: string): boolean {
    if (bag === 'no other') { return false; }
    if (!bagRules.has(bag)) { console.log(`<${bag}>`); console.log('barf'); exit();}
    if (bagRules.get(bag).includes('shiny gold')) { return true; }
    else {
        const innerBags = bagRules.get(bag);
        for (let i = 0; i < innerBags.length; i++) {
            if (checkBags(innerBags[i])) { return true; }
        }
    }

    return false;
}
