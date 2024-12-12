
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const basePattern = [0, 1, 0, -1];

let signal: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    signal = lines[i].split('').map(x => parseInt(x));
}

const PHASES = 100;

for (let i = 0; i < PHASES; i++) {
    for (let j = 0; j < signal.length; j++) {
        signal[j] = fft(signal, j+1);
    }
}

console.log(`After ${PHASES} phases: ${signal.join('').slice(0,8)}`);


function fft(signal: number[], j: number): number {
    const pattern: number[] = [];
    for (let x = 0; x < basePattern.length; x++) {
        for (let i = 0; i < j; i++) {
            pattern.push(basePattern[x]);
        }
    }

    // console.log(`applying pattern ${pattern} to ${signal.join('')}`);
    let o = 0;
    let patternIndex = 1;
    for (let i = 0; i < signal.length; i++) {
        // console.log(`  adding ${signal[i]} * ${pattern[patternIndex]}`);
        o += signal[i] * pattern[patternIndex];
        patternIndex++;
        if (patternIndex === pattern.length) { patternIndex = 0; }
    }

    // console.log(`returning ${Math.abs(o % 10)}`);
    // console.log();
    return Math.abs(o % 10);
}
