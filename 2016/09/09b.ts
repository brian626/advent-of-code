
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let d = lines[i];
    console.log(decompress(d));
}


function decompress(s: string): number {
    let d = '';
    let dn = 0;

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
            if (toRepeat.includes('(')) {
                dn += decompress(toRepeat) * numRepeat;
            } else {
                dn += toRepeat.length * numRepeat;
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

    return dn + d.length;
}
