
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

let scorePattern = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    scorePattern = lines[i];
}

const scores: number[] = [3, 7];

let elf1 = 0;
let elf2 = 1;

// printScores();

while (true) {
    if (scores.length % 1000 === 0) { console.log(scores.length); }

    // Combine recipes
    const newRecipe = scores[elf1] + scores[elf2];

    // Add digits
    const digits = newRecipe.toString().split('');
    for (const d of digits) {
        scores.push(parseInt(d));
    }

    // Pick new recipes
    elf1 += (1 + scores[elf1]);
    while (elf1 >= scores.length) {
        elf1 -= scores.length;
    }

    elf2 += (1 + scores[elf2]);
    while (elf2 >= scores.length) {
        elf2 -= scores.length;
    }

    // printScores();

    // console.log(`does ${scores.join('')} after ${recipesMade} recipes include '${scorePattern}'?`);
    if (scores.slice(-5).join('') === scorePattern) {
        // console.log(`  yes!`);
        break;
    }
    // console.log(`  no`);

    // if (recipesMade > 2020) { break; }
}

console.log(scores.join('').indexOf(scorePattern));


function printScores(): void {
    let str = ``;

    for (let i = 0; i < scores.length; i++) {
        if (i === elf1) { str += `(${scores[i]}) `; }
        else if (i === elf2 ) { str += `[${scores[i]}] `; }
        else { str += `${scores[i]} `; }
    }

    console.log(str);
}
