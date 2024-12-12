
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./4.input', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    const line = lines[i];
    const parts = line.split(':');
    const cardNum = parts[0].split(' ')[0];
    const winningNumbers = parts[1].trim().split('|')[0].trim().split(' ').map(x => x.trim()).filter(x => x.length > 0);
    const numbersYouHave = parts[1].trim().split('|')[1].trim().split(' ').map(x => x.trim()).filter(x => x.length > 0);

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

    if (numWinners > 0) {
        sum += Math.pow(2, numWinners - 1);
    }
}

console.log(sum);
