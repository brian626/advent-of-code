
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

const decksSeen: Set<string> = new Set<string>();

let gameNum = 1;
playGame(gameNum, deck1, deck2);

console.log();
console.log(`== Post-game results ==`);
console.log(`Player 1's deck: ${deck1.join(', ')}`);
console.log(`Player 2's deck: ${deck2.join(', ')}`);

if (deck1.length > 0) { console.log(score(deck1)); }
else { console.log(score(deck2)); }


function score(deck: string[]): number {
    let s = 0;

    for (let i = 0; i < deck.length; i++) {
        s += (parseInt(deck[i]) * (deck.length - i));
    }

    return s;
}


function playGame(game: number, deck1: string[], deck2: string[]): number {
    console.log(`playGame(${game})`);

    // console.log(`=== Game ${game} ===`);
    // console.log();

    let winner = 0;

    let rounds = 1;
    while (deck1.length > 0 && deck2.length > 0) {
        // console.log(`-- Round ${rounds} (Game ${game}) --`);
        // console.log(`Player 1's deck: ${deck1.join(', ')}`);
        // console.log(`Player 2's deck: ${deck2.join(', ')}`);
        if (decksSeen.has(`${game}|${deck1}|${deck2}`)) {
            // console.log(`Already seen these decks, Player 1 wins!`);
            break;
        } else {
            decksSeen.add(`${game}|${deck1}|${deck2}`);
        }

        const card1 = deck1.shift();
        const card2 = deck2.shift();
        // console.log(`Player 1 plays: ${card1}`);
        // console.log(`Player 2 plays: ${card2}`);

        if (deck1.length >= parseInt(card1) && deck2.length >= parseInt(card2)) {
            // console.log(`Playing a sub-game to determine the winner...`);
            // console.log();

            gameNum++;
            const subWinner = playGame(gameNum, Array.from(deck1).slice(0, parseInt(card1)), Array.from(deck2).slice(0, parseInt(card2)));
            // console.log(`...anyway, back to game ${game}.`);
            // console.log(`Player ${subWinner} wins round ${rounds} of game ${game}!`);

            if (subWinner === 1) {
                deck1.push(card1);
                deck1.push(card2);
            } else {
                deck2.push(card2);
                deck2.push(card1);
            }
        } else {
            if (parseInt(card1) > parseInt(card2)) {
                // console.log(`Player 1 wins round ${rounds} of game ${game}!`);
                deck1.push(card1);
                deck1.push(card2);
            } else {
                // console.log(`Player 2 wins round ${rounds} of game ${game}!`);
                deck2.push(card2);
                deck2.push(card1);
            }
        }

        // if (deck1.length > 0 && deck2.length > 0) {
        //     console.log();
        // }

        // rounds++;
        // if (rounds > 1000) { break; }
    }

    winner = deck1.length === 0 ? 2 : 1;
    // console.log(`The winner of game ${game} is player ${winner}!`)
    // console.log();

    return winner;
}
