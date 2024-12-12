
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
        if (c === 'T') { return 10; }
        if (c === '9') { return 9; }
        if (c === '8') { return 8; }
        if (c === '7') { return 7; }
        if (c === '6') { return 6; }
        if (c === '5') { return 5; }
        if (c === '4') { return 4; }
        if (c === '3') { return 3; }
        if (c === '2') { return 2; }
        if (c === 'J') { return 1; }
    }

    static determineStrength(h: Hand): Strength {
        console.log(`hand is ${h.cards}`);
        let hasFiveOfAKind = false;
        let hasFourOfAKind = false;
        let hasThreeOfAKind = false;
        let hasTwoPair = false;
        let hasOnePair = false;

        let jokerCount = h.cards.filter(x => x === 1).length;
        // if (jokerCount === 5) { hasFiveOfAKind = true; }
        if (jokerCount > 0) { console.log(`  jokers: ${jokerCount}`); }

        for (let i = 2; i < 16; i++) {
            const cardCount = h.cards.filter(x => x === i).length;
            if (cardCount === 0) { continue; }
            // console.log(`  ${i} card count: ${cardCount}`);

            if (cardCount === 5) { hasFiveOfAKind = true; }
            else if (cardCount === 4) { hasFourOfAKind = true; }
            else if (cardCount === 3) {
                hasThreeOfAKind = true;
            } else if (cardCount === 2) {
                if (!hasOnePair) {
                    hasOnePair = true;
                } else {
                    hasTwoPair = true;
                }
            }
        }

        if (jokerCount === 0) {
            if (hasFiveOfAKind) {
                console.log(`  returning five of a kind`);
                return Strength.FiveOfAKind;
            } else if (hasFourOfAKind) {
                console.log(`  returning four of a kind`);
                return Strength.FourOfAKind;
            } else if (hasThreeOfAKind) {
                if (hasOnePair) {
                    console.log(`  returning full house`);
                    return Strength.FullHouse;
                } else {
                    console.log(`  returning three of a kind`);
                    return Strength.ThreeOfAKind;
                }
            }
            else if (hasTwoPair) {
                console.log(`  returning two pair`);
                return Strength.TwoPair;
            }
            else if (hasOnePair) {
                console.log(`  returning one pair`);
                return Strength.OnePair;
            }
            else {
                console.log(`  returning high card`);
                return Strength.HighCard;
            }
        } else if (jokerCount === 1) {
            if (hasFiveOfAKind || hasFourOfAKind) {
                console.log(`  returning five of a kind`);
                return Strength.FiveOfAKind;
            } else if (hasThreeOfAKind) {
                console.log(`  returning four of a kind`);
                return Strength.FourOfAKind;
            } else if (hasTwoPair) {
                console.log(`  returning full house`);
                return Strength.FullHouse;
            }
            else if (hasOnePair) {
                console.log(`  returning threeOfAKind`);
                return Strength.ThreeOfAKind;
            }
            else {
                console.log(`  returning one pair`);
                return Strength.OnePair;
            }
        } else if (jokerCount === 2) {
            if (hasFiveOfAKind || hasFourOfAKind || hasThreeOfAKind) {
                console.log(`  returning five of a kind`);
                return Strength.FiveOfAKind;
            } else if (hasOnePair) {
                console.log(`  returning four of a kind`);
                return Strength.FourOfAKind;
            } else {
                console.log(`  returning three of a kind`);
                return Strength.ThreeOfAKind;
            }
        } else if (jokerCount === 3) {
            if (hasOnePair) {
                console.log(`  returning five of a kind`);
                return Strength.FiveOfAKind;
            } else {
                console.log(`  returning four of a kind`);
                return Strength.FourOfAKind;
            }
        } else if (jokerCount === 4 || jokerCount === 5) {
            console.log(`  returning five of a kind`);
            return Strength.FiveOfAKind;
        }
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

// 248947698 is too high
// 248882247 is too low
// 248909434 is right
