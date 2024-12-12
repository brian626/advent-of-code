
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./07.test', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(i);

    if (canBeTrue(lines[i])) {
        const parts = lines[i].split(': ');
        sum += parseInt(parts[0]);
    }

}


console.log(sum);



function canBeTrue(s: string): boolean {
    // console.log(`canBeTrue(${s})`);
    const [answerStr, termsStr] = s.split(': ');
    const answer = parseInt(answerStr);

    // In ternary, 0 is +, 1 is *, and 2 is || (concat)
    for (let i = 0; i < Math.pow(3, (termsStr.split(' ').length - 1)); i++) {
        const terms = termsStr.split(' ').map(x => parseInt(x));
        const b = i.toString(3).padStart(terms.length, '0').split('').reverse();
        let result = terms.shift();
        // console.log(`result starts as ${result}, b is ${b}, terms are [${terms}]`);
        for (const t of terms) {
            const operator = b.shift();
            if (operator === '0') {
                // console.log(`result += ${t}`);
                result += t;
            } else if (operator === '1') {
                // console.log(`result *= ${t}`);
                result *= t;
            } else {
                // console.log(`result ||= ${t}`);
                result = parseInt(result.toString() + t.toString());
            }

            if (result > answer) {
                break;
            }
        }

        // console.log(`result is ${result}`);
        if (result === answer) {
            // console.log(`success!`);
            // console.log();
            return true;
        }
    }

    // console.log(`failure`);
    // console.log();
    return false;
}
