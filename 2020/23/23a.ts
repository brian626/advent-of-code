
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');

let cups: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    cups = lines[i].split('');
}

let currentCupLabel = cups[0];
const lowestCup = Math.min(...cups.map(x => parseInt(x)));
const highestCup = Math.max(...cups.map(x => parseInt(x)));

const MOVES = 100;

for (let move = 0; move < MOVES; move++) {
    let currentCupIndex = cups.indexOf(currentCupLabel);
    let cupsToRemove = [currentCupIndex + 1, currentCupIndex + 2, currentCupIndex + 3];
    for (let i = 0; i < cupsToRemove.length; i++) {
        if (cupsToRemove[i] > cups.length - 1) {
            cupsToRemove[i] -= cups.length;
        }
    }

    console.log(`-- move ${move+1} --`);
    printCups();

    console.log(`pick up: ${cupsToRemove.map(x => cups[x]).join(', ')}`);

    let removedCups = [];
    for (const x of cupsToRemove.reverse()) {
        removedCups = removedCups.concat(cups.splice(cups.indexOf(cups[x]), 1));
    }
    removedCups.reverse();
    console.log(`after removal: ${cups.join('  ')}`);

    currentCupIndex = cups.indexOf(currentCupLabel);
    console.log(`currentCupLabel: ${currentCupLabel}`);
    console.log(`currentCupIndex: ${currentCupIndex}`);
    console.log(`cups[currentCupIndex]: ${cups[currentCupIndex]}`);
    console.log(``);

    let destinationLabel = (parseInt(cups[currentCupIndex]) - 1).toString();
    let destinationIndex = cups.indexOf(cups.find(x => x === destinationLabel));
    console.log(`destination label: ${destinationLabel} - ok?`);
    while (destinationIndex === -1 || removedCups.includes(destinationIndex)) {
        destinationLabel = (parseInt(destinationLabel) - 1).toString();
        if (parseInt(destinationLabel) < lowestCup) {
            destinationLabel = highestCup.toString();
        }
        console.log(`destination label: ${destinationLabel} - ok?`);
        destinationIndex = cups.indexOf(cups.find(x => x === destinationLabel));
    }

    console.log(`destination: ${destinationLabel}`);
    console.log();
    destinationIndex = cups.indexOf(cups.find(x => x === destinationLabel));


    // console.log(`rearranged = ${cups.slice(0, destinationCup + 1)} + ${removedCups} + ${cups.slice(destinationCup + 1)}`);
    currentCupIndex++;
    if (currentCupIndex > cups.length - 1) { currentCupIndex = 0; }
    currentCupLabel = cups[currentCupIndex];
    cups = cups.slice(0, destinationIndex + 1).concat(removedCups).concat(cups.slice(destinationIndex + 1));
}

console.log(`-- final --`);
printCups();

console.log();
let cupIndex = cups.indexOf('1');
cupIndex++;
if (cupIndex >= cups.length) { cupIndex = 0; }
let s = '';
for (let i = 0; i < cups.length - 1; i++) {
    s += cups[cupIndex];
    cupIndex++;
    if (cupIndex >= cups.length) { cupIndex = 0; }
}
console.log(s);

function printCups() {
    let s = 'cups: ';
    for (let i = 0; i < cups.length; i++) {
        if (cups[i] === currentCupLabel) {
            s += `(${cups[i]})`;
        } else {
            s += ` ${cups[i]} `;
        }
    }
    console.log(s);
}