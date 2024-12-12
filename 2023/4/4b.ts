
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./4.input', 'utf-8');

const lines = file.split('\n');

const cardCountMap: Map<string, number> = new Map<string, number>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    const line = lines[i];
    const parts = line.split(':');
    const cardNum = parts[0].split(' ').pop().trim();
    const winningNumbers = parts[1].trim().split('|')[0].trim().split(' ').map(x => x.trim()).filter(x => x.length > 0);
    const numbersYouHave = parts[1].trim().split('|')[1].trim().split(' ').map(x => x.trim()).filter(x => x.length > 0);

    if (cardCountMap.has(cardNum)) {
        cardCountMap.set(cardNum, cardCountMap.get(cardNum) + 1);
    } else {
        cardCountMap.set(cardNum, 1);
    }

    // console.log(`Card ${cardNum}`);
    // console.log(`  Winning numbers: ${winningNumbers}`);
    // console.log(`  Numbers you have: ${numbersYouHave}`);
    // console.log();

    let numWinners = 0;
    for (const winner of winningNumbers) {
        if (numbersYouHave.includes(winner)) {
            numWinners += 1;
        }
    }

    for (let k = 0; k < cardCountMap.get(cardNum); k++) {
        for (let j = 1; j <= numWinners; j++) {
            const cardCopy = (parseInt(cardNum) + j).toString();
            if (cardCountMap.has(cardCopy)) {
                cardCountMap.set(cardCopy, cardCountMap.get(cardCopy) + 1);
            } else {
                cardCountMap.set(cardCopy, 1);
            }
        }
    }

    // console.log(cardCountMap);
    // console.log('');
}

// console.log(cardCountMap);
console.log([...cardCountMap.values()].reduce((x, y) => x + y));
