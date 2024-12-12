
import { readFileSync } from 'fs';
import { exit } from 'process';

// const file = readFileSync('./11.test', 'utf-8');

// const lines = file.split('\n');

// for (let i = 0; i < lines.length; i++) {
//     if (lines[i].length === 0) { continue; }

// }

// The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
// The second floor contains a hydrogen generator.
// The third floor contains a lithium generator.
// The fourth floor contains nothing relevant.

// Parsing seems like a nightmare - maybe just hardcode?

const Floor4 = [''];
const Floor3 = ['LG'];
const Floor2 = ['HG'];
const Floor1 = ['HM', 'LM'];

let steps = 0;
while (Floor4.length < 4) {
    // Can we move anything from floor 1?
}

console.log(steps);
