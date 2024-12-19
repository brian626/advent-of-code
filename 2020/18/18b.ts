
// algorithm from https://faculty.cs.niu.edu/~hutchins/csci241/eval.htm

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.input', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const result = calculate(lines[i]);

    // console.log(`${lines[i]} becomes ${result}.`);

    sum += result;
}

console.log(sum);


function calculate(s: string): number {
    // Convert to postfix notation
    const Q = tokenize(s);
    // console.log(`Q is`);
    // console.log(Q.join(' '));
    // console.log();

    const P = convertToPostfix(Q);
    // console.log(`P is`)
    // console.log(P.join(' '));
    // console.log();

    // Evaluate
    const result = evaluate(P);

    return result;
}


function tokenize(s: string): string[] {
    const tokens: string[] = [];

    let numericToken = '';

    for (let i = 0; i < s.length; i++) {
        if (/[0-9]/.test(s[i])) {
            numericToken += s[i];
        } else if (s[i] === '(') {
            tokens.push(s[i]);
        } else if (s[i] === ')') {
            if (numericToken.length > 0) {
                tokens.push(numericToken);
                numericToken = '';
            }
            tokens.push(s[i]);
        } else if (s[i] === ' ') {
            if (numericToken.length > 0) {
                tokens.push(numericToken);
                numericToken = '';
            }
        } else if (s[i] === '+' || s[i] === '*') {
            tokens.push(s[i]);
        } else {
            console.log(`unknown char ${s[i]}`);
        }
    }

    if (numericToken.length > 0) {
        tokens.push(numericToken);
    }

    return tokens;
}


function convertToPostfix(Q: string[]): string[] {
    const stack: string[] = [];

    const P: string[] = [];

    while (Q.length > 0) {
        const term = Q.shift();

        if (/[0-9]+/.test(term)) {
            P.push(term);
        }

        if (term === '(') {
            stack.unshift(term);
        }

        if (term === ')') {
            while (stack.length > 0 && stack[0] !== '(') {
                P.push(stack.shift());
            }

            stack.shift();
        }

        if (term === '+' || term === '*') {
            if (stack.length === 0 || stack[0] === '(') {
                stack.unshift(term);
            } else {
                while (stack.length > 0 && stack[0] !== '(' && getPrecedence(term) <= getPrecedence(stack[0])) {
                    P.push(stack.shift());
                }

                stack.unshift(term);
            }
        }
    }

    while (stack.length > 0) {
        P.push(stack.shift());
    }

    return P;
}


function evaluate(P: string[]): number {
    const stack: string[] = [];

    while (P.length > 0) {
        const term = P.shift();
        // console.log(`term is ${term}`);

        if (/[\d]+/.test(term)) {
            stack.unshift(term);
            // console.log(`  pushed onto stack: [${stack.join(' ')}]`);
        }

        else if (term === '+' || term === '*') {
            const A = parseInt(stack.shift());
            const B = parseInt(stack.shift());

            // console.log(`  evaluating ${A} ${term} ${B}`);

            let result = 0;
            if (term === '+') { result = A + B; }
            else if (term === '*') { result = A * B; }

            stack.unshift(result.toString());
            // console.log(`  pushing ${result} onto the stack: [${stack.join(' ')}]`);
        }

        // console.log();
    }

    // console.log(`final value is ${stack[0]}`);

    const result = parseInt(stack.pop());

    return result;
}


function getPrecedence(operator: string): number {
    if (operator === '+') { return 1; }
    else if (operator === '*') { return 0; }
}
