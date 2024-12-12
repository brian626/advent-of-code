
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(decompress(lines[i]));
    console.log(decompress(lines[i]).length);
}


function decompress(s: string): string {
    let d = '';

    let i = 0;
    let inMarker = false;
    let marker = '';
    while (i < s.length) {
        if (s[i] === '(') {
            inMarker = true;
        } else if (s[i] === ')') {
            inMarker = false;
            const [numChars, numRepeat] = marker.split('x').map(x => parseInt(x));
            const toRepeat = s.slice(i+1, i+1+numChars);
            for (let j = 0; j < numRepeat; j++) {
                d += toRepeat;
            }
            i += numChars;
            marker = '';
        } else if (inMarker) {
            marker += s[i];
        } else {
            d += s[i];
        }

        i++;
    }

    return d;
}
