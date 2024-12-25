
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

let parsingInputs = true;

const gates: Map<string, number> = new Map<string, number>();

class Rule {
    lhs: string;
    operator: string;
    rhs: string;
    output: string;

    constructor(s: string) {
        const [lhs, operator, rhs, _, output] = s.split(' ');
        this.lhs = lhs;
        this.operator = operator;
        this.rhs = rhs;
        this.output = output;
    }
}

const rules: Rule[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingInputs = false; continue; }

    if (parsingInputs) {
        const [gate, input] = lines[i].split(': ');
        gates.set(gate, parseInt(input));
    } else {
        rules.push(new Rule(lines[i]));
    }
}

let iterations = 0;

while (true) {
    let setAnOutput = false;

    for (const rule of rules) {
        console.log(rule);

        if (true || !gates.has(rule.output)) {
            console.log(`${rule.output} has not been set`);
            if (gates.has(rule.lhs) && gates.has(rule.rhs)) {
                const lhs = gates.get(rule.lhs);
                const rhs = gates.get(rule.rhs);
                let result = -1;
                if (rule.operator === 'AND') {
                    result = lhs & rhs;
                    console.log(`result = ${lhs} & ${rhs} = ${result}`);
                } else if (rule.operator === 'OR') {
                    result = lhs | rhs;
                    console.log(`result = ${lhs} | ${rhs} = ${result}`);
                } else if (rule.operator === 'XOR') {
                    result = lhs ^ rhs;
                    console.log(`result = ${lhs} & ${rhs} = ${result}`);
                } else {
                    result = Infinity;
                }

                if (!gates.has(rule.output) || (gates.has(rule.output) && gates.get(rule.output) !== result)) {
                    console.log(`setting ${rule.output} to ${result}`);
                    gates.set(rule.output, result);
                    setAnOutput = true;
                }
            }

            console.log();
        }
    }

    if (!setAnOutput) { break; }
    // iterations++;
    // if (iterations === 100) { break; }
}

console.log(gates);
let output = '';
for (let i = 100; i >= 0; i--) {
    const gateName = `z${i.toString().padStart(2, '0')}`;
    if (gates.has(gateName)) {
        output += gates.get(gateName).toString();
    }
}

console.log();
console.log(parseInt(output, 2));
