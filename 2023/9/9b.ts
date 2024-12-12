
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./9.input', 'utf-8');

const lines = file.split('\n');

const histories: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    histories[i] = lines[i].split(' ').map(x => parseInt(x));
}

const predictions: number[][][] = [];
for (let i = 0; i < histories.length; i++) {
    predictions[i] = [];
    predictions[i][0] = histories[i];
}

while (true) {
    let done: boolean[] = [];
    for (let i = 0; i < predictions.length; i++) {
        done[i] = false;
    }

    for (let i = 0; i < predictions.length; i++) {
        const lastPrediction = predictions[i].slice(-1)[0];
        if (lastPrediction.reduce((x, y) => x + y) === 0) { done[i] = true; continue; }

        const nextPrediction: number[] = [];
        for (let j = lastPrediction.length - 1; j > 0; j--) {
            nextPrediction.unshift(lastPrediction[j] - lastPrediction[j-1]);
        }

        predictions[i].push(nextPrediction);
    }

    if (done.filter(x => !x).length === 0) { break; }
}

// console.log(`predictions[2] before`);
// console.log(predictions[2]);
// console.log('');

const extrapolations: number[] = [];

for (let i = 0; i < predictions.length; i++) {
    predictions[i].slice(-1)[0].unshift(0);

    let prevVal = 0;
    for (let j = predictions[i].length - 2; j >= 0; j--) {
        // console.log(predictions[i][j]);
        predictions[i][j].unshift(predictions[i][j][0] - predictions[i][j+1][0]);
        prevVal += predictions[i][j][0] - predictions[i][j+1][0];
    }
    extrapolations.unshift(prevVal);
}

// console.log(`predictions[2] after`);
// console.log(predictions[2]);
// console.log('');


// console.log(extrapolations);
console.log(extrapolations.reduce((x, y) => x + y, 0));
