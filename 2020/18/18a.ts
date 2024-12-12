
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.test', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(calculate(lines[i]));

    break;
}


function calculate(s: string): number {
    let result = 0;

    let terms = termify(s);
    // let parenDepth = 0;

    while (true) {
        let done = true;

        for (let i = 0; i < terms.length; i++) {
            if (terms[i].includes('(')) {
                done = false;
                // parenDepth++;
                const subExpression = termify(terms[i].slice(1, -1));
                if (subExpression.filter(x => x.includes('(')).length > 0) {
                    console.log(`termified, replaced term #${i} '${terms[i]}' with ${subExpression}`);
                    terms = terms.slice(0, i).concat(['(', ...subExpression, ')']).concat(terms.slice(i + 1));
                    terms = termify(terms.join(' '));
                    console.log(terms);
                    console.log();
                    break;
                } else {
                    // parenDepth--;
                    const result = evaluate(subExpression.join(' '));
                    console.log(`evaluated '${subExpression}', replaced term #${i} '${terms[i]}' with ${result}`);
                    terms = terms.slice(0, i).concat([result.toString()]).concat(terms.slice(i + 1));
                    console.log(terms);
                    console.log();
                    break;
                }
            }
        }

        if (done) { console.log(`breaking`); break; }
    }

    console.log(`final terms`);
    console.log(terms);

    return evaluate(terms.join(' '));
}


function termify(s: string): string[] {
    const terms: string[] = [];

    let parenDepth = 0;
    let parenStart: number[] = [];

    for (let i = 0; i < s.length; i++) {
        if (s[i] === ' ') {
            continue;
        } else if (s[i] === '(') {
            parenDepth++;
            parenStart[parenDepth] = i + 1;
        } else if (s[i] === ')') {
            if (parenDepth === 1) {
                const subExpression = s.slice(parenStart[parenDepth], i);
                terms.push('(' + subExpression + ')');
            }
            parenStart[parenDepth] = -1;
            parenDepth--;
        } else { // if ((s[i] === '+') || s[i] === '*') {
            if (parenDepth === 0) {
                terms.push(s[i]);
            }
        }
    }

    console.log(`termify(${s}) returning [${terms}]`);
    return terms;
}


function evaluate(s: string): number {
    const terms = s.split(' ');

    let result = parseInt(terms.shift());

    while (terms.length > 0) {
        const [operator, nextTerm] = [terms.shift(), parseInt(terms.shift())];
        if (operator === '+') {
            result += nextTerm;
        } else if (operator === '*') {
            result *= nextTerm;
        }
    }

    console.log(`evaluate(${s}) returning ${result}`);
    return result;
}
