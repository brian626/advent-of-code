// --- Part Two ---
// While it appears you validated the passwords correctly, they don't seem to be
// what the Official Toboggan Corporate Authentication System is expecting.

// The shopkeeper suddenly realizes that he just accidentally explained the password
// policy rules from his old job at the sled rental place down the street! The Official
// Toboggan Corporate Policy actually works a little differently.

// Each policy actually describes two positions in the password, where 1 means the
// first character, 2 means the second character, and so on. (Be careful; Toboggan
// Corporate Policies have no concept of "index zero"!) Exactly one of these
// positions must contain the given letter. Other occurrences of the letter are
// irrelevant for the purposes of policy enforcement.

// Given the same example list from above:

// 1-3 a: abcde is valid: position 1 contains a and position 3 does not.
// 1-3 b: cdefg is invalid: neither position 1 nor position 3 contains b.
// 2-9 c: ccccccccc is invalid: both position 2 and position 9 contain c.

// How many passwords are valid according to the new interpretation of the policies?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./2.input', 'utf-8');

const lines = file.split('\n');

let numValid = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) { continue; }

    const parts: string[] = line.split(' ');
    const firstPosition: number = parseInt(parts[0].split('-')[0]);
    const secondPosition: number = parseInt(parts[0].split('-')[1]);
    const letter: string = parts[1][0];
    const password = parts[2];

    // console.log(`${password[firstPosition - 1]} ?= ${letter}, ${password[secondPosition - 1]} ?= ${letter}`);
    if ((password[firstPosition - 1] === letter && password[secondPosition - 1] !== letter) ||
        (password[firstPosition - 1] !== letter && password[secondPosition - 1] === letter)) {
        numValid++;
    }
}

console.log(numValid);
