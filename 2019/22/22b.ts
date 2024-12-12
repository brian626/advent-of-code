
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

let cards: number[] = [];
for (let i = 0; i < 119315717514047; i++) {
    cards[i] = i;
}

// console.log(cards.join(''));
console.log(cards.slice(0, 10));

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('deal with')) {
        const matches = /[^\d]+ (\d+)/.exec(lines[i]);
        const increment = parseInt(matches[1]);
        dealWithIncrement(increment);
    } else if (lines[i].startsWith('deal into')) {
        cards.reverse();
    } else if (lines[i].startsWith('cut')) {
        const matches = /cut ([\d\-]+)/.exec(lines[i]);
        const cutAmt = parseInt(matches[1]);
        cut(cutAmt);
    } else {
        console.log(`unknown deal ${lines[i]}`);
        break;
    }

    // console.log(cards.join(''));
    if (cards.length < 10000) {
        console.log(lines[i]);
        console.log(cards.slice(0, 10));
        break;
    }
}

console.log(cards.slice(0, 10));
console.log(cards.indexOf(2020));


function dealWithIncrement(inc: number) {
    // console.log(`dealing with increment ${inc}`);
    const newDeck: number[] = [];
    let newDeckPtr = 0;
    for (let i = 0; i < cards.length; i++) {
        // console.log(`newDeckPtr is ${newDeckPtr}, newDeck[${newDeckPtr}] = ${cards[i]}`);
        newDeck[newDeckPtr] = cards[i];
        newDeckPtr += inc;
        while (newDeckPtr >= cards.length) {
            newDeckPtr -= cards.length;
        }
    }

    cards = newDeck;
}


function cut(amt: number) {
    // console.log(`cutting ${amt}`);
    if (amt > 0) {
        cards = cards.slice(amt).concat(cards.slice(0, amt));
    } else {
        cards = cards.slice(cards.length + amt).concat(cards.slice(0, cards.length + amt));
    }
}
