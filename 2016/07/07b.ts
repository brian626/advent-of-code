
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.input', 'utf-8');

const lines = file.split('\n');

let count = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (supportsSSL(lines[i])) {
        count++;
    }

    console.log();
}

console.log(count);


function supportsSSL(s: string): boolean {
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

    // console.log(mustSupport);
    // console.log(mustNotSupport);
    const ABAs = findABAs(mustSupport);
    const BABs = findABAs(mustNotSupport);
    console.log(ABAs);
    console.log(BABs);

    for (const ABA of ABAs) {
        console.log(`does ${BABs} include ${switcheroo(ABA)}?`);
        if (BABs.includes(switcheroo(ABA))) {
            console.log('returning true');
            return true;
        }
    }

    console.log('returning false');
    return false;
}


function findABAs(words: string[]): string[] {
    const ABAs: string[] = [];

    for (const word of words) {
        for (let i = 0; i < word.length - 2; i++) {
            // console.log(word[i], word[i+1], word[i+2]);
            if (word[i] === word[i+2] && word[i] !== word[i+1]) {
                ABAs.push(word.slice(i, i+3));
            }
        }
    }

    return ABAs;
}


function switcheroo(s: string): string {
    return s[1] + s[0] + s[1];
}
