
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

const lines = file.split('\n');

let count = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (supportsTLS(lines[i])) {
        count++;
    }

    console.log();
}

console.log(count);


function supportsTLS(s: string): boolean {
    let inHypernetSequence = false;
    let t = '';
    const mustSupport: string[] = [];
    const mustNotSupport: string[] = [];

    for (let i = 0; i <= s.length; i++) {
        if (i === s.length) {
            mustSupport.push(t);
            break;
        }

        if (s[i] === '[') {
            mustSupport.push(t);
            inHypernetSequence = true;
            t = '';
        } else if (s[i] === ']') {
            mustNotSupport.push(t);
            inHypernetSequence = false;
            t = '';
        } else {
            t += s[i];
        }
    }

    if (mustSupport.map(x => hasABBA(x)).filter(x => x === true).length === 0) { return false; }
    if (mustNotSupport.map(x => hasABBA(x)).filter(x => x === true).length > 0) { return false; }

    return true;
}


function hasABBA(s: string): boolean {
    for (let i = 0; i < s.length - 3; i++) {
        // console.log(s[i], s[i+1], s[i+2], s[i+3]);
        if (s[i] === s[i+3] && s[i+1] === s[i+2] && s[i] !== s[i+1]) {
            console.log(s, true);
            return true;
        }
    }

    console.log(s, false);
    return false;
}

// 69 is wrong
// 119 is too high
