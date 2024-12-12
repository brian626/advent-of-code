// --- Part Two ---
// Your device's communication system is correctly detecting packets, but still isn't working.
// It looks like it also needs to look for messages.

// A start-of-message marker is just like a start-of-packet marker, except it consists of 14 distinct characters rather than 4.

// Here are the first positions of start-of-message markers for all of the above examples:

// mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
// bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
// nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
// nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
// zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26

// How many characters need to be processed before the first start-of-message marker is detected?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./6.input', 'utf-8');

const lines = file.split('\n');

const line = lines[0].trim();

let startPos = 0;

while (true) {
    if (isMarker(line.slice(startPos, startPos + 14))) {
        console.log(startPos + 14);
        break;
    }
    startPos++;
}

function isMarker(s: string): boolean {
    // console.log(s);

    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j < s.length; j++) {
            if (s.charAt(i) === s.charAt(j)) {
                return false;
            }
        }
    }

    return true;
}
