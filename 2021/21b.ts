// --- Part Two ---
// Now that you're warmed up, it's time to play the real game.

// A second compartment opens, this time labeled Dirac dice. Out of it falls a single three-sided die.

// As you experiment with the die, you feel a little strange. An informational brochure in the
// compartment explains that this is a quantum die: when you roll it, the universe splits into
// multiple copies, one copy for each possible outcome of the die. In this case, rolling the die
// always splits the universe into three copies: one where the outcome of the roll was 1, one
// where it was 2, and one where it was 3.

// The game is played the same as before, although to prevent things from getting too far out of
// hand, the game now ends when either player's score reaches at least 21.

// Using the same starting positions as in the example above, player 1 wins in 444356092776315
// universes, while player 2 merely wins in 341960390180808 universes.

// Using your given starting positions, determine every possible outcome. Find the player that
// wins in more universes; in how many universes does that player win?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./21.test', 'utf-8');

const lines = file.split('\n');

const player1Start = parseInt(lines[0][lines[0].length - 1]);
const player2Start = parseInt(lines[1][lines[1].length - 1]);

let dieRoll = 0;
let rolls = 0;
let player1Position = player1Start;
let player1Score = 0;
let player2Position = player2Start;
let player2Score = 0;

while (true) {
    let moves = 0;

    for (let i = 0; i < 3; i++) {
        rolls += 1;
        dieRoll += 1;
        moves += dieRoll;
    }

    player1Position += moves;
    player1Position = player1Position % 10;
    if (player1Position === 0) { player1Position = 10; }
    console.log(`player1 moved ${moves} spots to position ${player1Position}`);

    player1Score += player1Position;
    console.log(`player1 score is now ${player1Score}`);

    if (player1Score >= 1000) {
        break;
    }

    moves = 0;

    for (let i = 0; i < 3; i++) {
        rolls += 1;
        dieRoll += 1;
        moves += dieRoll;
    }

    player2Position += moves;
    player2Position = player2Position % 10;
    if (player2Position === 0) { player2Position = 10; }
    console.log(`player2 moved ${moves} spots to position ${player2Position}`);

    player2Score += player2Position;
    console.log(`player2 score is now ${player2Score}`);

    if (player2Score >= 1000) {
        break;
    }
}

console.log(rolls);
console.log(player1Score);
console.log(player2Score);
console.log(rolls * Math.min(player1Score, player2Score));
