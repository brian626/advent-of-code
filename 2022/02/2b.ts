// --- Part Two ---
// The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column
// says how the round needs to end: X means you need to lose, Y means you need to end the round in a
// draw, and Z means you need to win. Good luck!"

// The total score is still calculated in the same way, but now you need to figure out what shape
// to choose so the round ends as indicated. The example above now goes like this:

// In the first round, your opponent will choose Rock (A), and you need the round to end in a
// draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.

// In the second round, your opponent will choose Paper (B), and you choose Rock so you lose
// (X) with a score of 1 + 0 = 1.

// In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.

// Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

// Following the Elf's instructions for the second column, what would your total score be if everything
// goes exactly according to your strategy guide?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./2.input', 'utf-8');

const lines = file.split('\n');

let score = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const choices = lines[i].split(' ');

    if (choices[0] === 'A') {
        if      (choices[1] === 'X') { score += (3 + 0); } // rock vs scissors = lose
        else if (choices[1] === 'Y') { score += (1 + 3); } // rock vs rock = draw
        else if (choices[1] === 'Z') { score += (2 + 6); } // rock vs paper = win
    } else if (choices[0] === 'B') {
        if      (choices[1] === 'X') { score += (1 + 0); } // paper vs rock = lose
        else if (choices[1] === 'Y') { score += (2 + 3); } // paper vs paper = draw
        else if (choices[1] === 'Z') { score += (3 + 6); } // paper vs scissors = win
    } else if (choices[0] === 'C') {
        if      (choices[1] === 'X') { score += (2 + 0); } // scissors vs paper = lose
        else if (choices[1] === 'Y') { score += (3 + 3); } // scissors vs scissors = draw
        else if (choices[1] === 'Z') { score += (1 + 6); } // scissors vs rock = win
    }
}

console.log(score);
