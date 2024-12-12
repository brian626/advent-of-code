
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./7.input', 'utf-8');

const lines = file.split('\n');

enum Strength {
    'FiveOfAKind' = 7,
    'FourOfAKind' = 6,
    'FullHouse' = 5,
    'ThreeOfAKind' = 4,
    'TwoPair' = 3,
    'OnePair' = 2,
    'HighCard' = 1,
    'None' = 0
}

class Hand {
    cards: number[];
    strength: Strength;
    bid: number;

    constructor(cards: string, bid: string) {
        this.cards = cards.split('').map(x => this.cardStringToNum(x));
        this.strength = Hand.determineStrength(this);
        this.bid = parseInt(bid);
    }

    cardStringToNum(c: string): number {
        if (c === 'A') { return 15; }
        if (c === 'K') { return 14; }
        if (c === 'Q') { return 12; }
        if (c === 'J') { return 11; }
        if (c === 'T') { return 10; }
        if (c === '9') { return 9; }
        if (c === '8') { return 8; }
        if (c === '7') { return 7; }
        if (c === '6') { return 6; }
        if (c === '5') { return 5; }
        if (c === '4') { return 4; }
        if (c === '3') { return 3; }
        if (c === '2') { return 2; }
    }

    static determineStrength(h: Hand): Strength {
        let hasThreeOfAKind = false;
        let threeOfAKind = 0;
        let hasPair = false;
        let pair = 0;

        for (let i = 2; i < 16; i++) {
            const cardCount = h.cards.filter(x => x === i).length;
            if (cardCount === 5) { return Strength.FiveOfAKind; }
            else if (cardCount === 4) { return Strength.FourOfAKind; }
            else if (cardCount === 3) {
                if (hasPair) {
                    return Strength.FullHouse;
                } else {
                    hasThreeOfAKind = true;
                    threeOfAKind = i;
                }
            } else if (cardCount === 2) {
                if (hasThreeOfAKind) {
                    return Strength.FullHouse;
                } else if (!hasPair) {
                    hasPair = true;
                    pair = i;
                } else {
                    return Strength.TwoPair;
                }
            }
        }

        if (hasThreeOfAKind) { return Strength.ThreeOfAKind; }
        else if (hasPair) { return Strength.OnePair; }
        else { return Strength.HighCard; }
    }
}

const hands: Hand[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const parts = lines[i].split(' ');

    hands.push(new Hand(parts[0], parts[1]));
}

// console.log(`unsorted`);
// console.log(hands);
// console.log();

console.log(`sorted`);
hands.sort((a, b) => {
    if (a.strength !== b.strength) { return a.strength - b.strength; }

    for (let i = 0; i < a.cards.length; i++) {
        if (a.cards[i] !== b.cards[i]) {
            return a.cards[i] - b.cards[i];
        }
    }

    return 0;
});
for (let i = 0; i < hands.length; i++) { console.log(hands[i]); }
console.log();

let sum = 0;
for (let i = 0; i < hands.length; i++) {
    sum += (i + 1) * hands[i].bid;
}

console.log(sum);

// 250071122 is too low
// 250436255 is too low
// 250474325 is right
