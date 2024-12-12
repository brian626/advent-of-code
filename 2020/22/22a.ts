
import { read, readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

const deck1: string[] = [];
const deck2: string[] = [];

let readingPlayer1 = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { readingPlayer1 = false; continue; }
    if (lines[i].startsWith('Player')) { continue; }

    if (readingPlayer1) {
        deck1.push(lines[i]);
    } else {
        deck2.push(lines[i]);
    }
}

const WINNER = deck1.length * 2;

let rounds = 1;
while (deck1.length < WINNER && deck2.length < WINNER) {
    console.log(`-- Round ${rounds} --`);
    console.log(`Player 1's deck: ${deck1}`);
    console.log(`Player 2's deck: ${deck2}`);
    const card1 = deck1.shift();
    const card2 = deck2.shift();
    console.log(`Player 1 plays: ${card1}`);
    console.log(`Player 2 plays: ${card2}`);

    if (parseInt(card1) > parseInt(card2)) {
        console.log(`Player 1 wins the round!`);
        deck1.push(card1);
        deck1.push(card2);
    } else {
        console.log(`Player 2 wins the round!`);
        deck2.push(card2);
        deck2.push(card1);
    }

    console.log();
    rounds++;
    if (rounds > 1000) { break; }
}

if (deck1.length > 0) { console.log(score(deck1)); }
else { console.log(score(deck2)); }


function score(deck: string[]): number {
    let s = 0;

    for (let i = 0; i < deck.length; i++) {
        s += (parseInt(deck[i]) * (deck.length - i));
    }

    return s;
}
