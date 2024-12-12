
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.test', 'utf-8');

const lines = file.split('\n');

const basePattern = [0, 1, 0, -1];

let signal: string = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    signal = lines[i];
}

const offset = parseInt(signal.slice(0,7));

for (let i = 0; i < 10000; i++) {
    signal = signal.concat(signal);
}

const PHASES = 1;

for (let i = 0; i < PHASES; i++) {
    for (let j = 0; j < signal.length; j++) {
        // signal[j] = fft(signal, j+1);
        signal = signal.slice(0, j) + fft(signal, j+1) + signal.slice(j + 1);
    }
}

console.log(`After ${PHASES} phases: ${signal.slice(offset, offset + 8)}`);


function fft(signal: string, j: number): string {
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
        o += parseInt(signal[i]) * pattern[patternIndex];
        patternIndex++;
        if (patternIndex === pattern.length) { patternIndex = 0; }
    }

    // console.log(`returning ${Math.abs(o % 10)}`);
    // console.log();
    return (Math.abs(o % 10)).toString();
}
