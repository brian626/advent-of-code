
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

    toString(): string {
        return `${this.lhs} ${this.operator} ${this.rhs} -> ${this.output}`;
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


let firstNumberString = '';
for (let i = 100; i >= 0; i--) {
    const gateName = `x${i.toString().padStart(2, '0')}`;
    if (gates.has(gateName)) {
        firstNumberString += gates.get(gateName).toString();
    }
}
const firstNumber = parseInt(firstNumberString, 2);


let secondNumberString = '';
for (let i = 100; i >= 0; i--) {
    const gateName = `y${i.toString().padStart(2, '0')}`;
    if (gates.has(gateName)) {
        secondNumberString += gates.get(gateName).toString();
    }
}
const secondNumber = parseInt(secondNumberString, 2);

const expectedResult = firstNumber + secondNumber;
const expectedResultString = expectedResult.toString(2);

console.log(`${firstNumber} + ${secondNumber} = ${expectedResult}`);
console.log(`${firstNumberString} + ${secondNumberString} = ${expectedResultString}`);
console.log();
// for (let i = 0; i < expectedResultString.length; i++) {
//     console.log(`z${i.toString().padStart(2, '0')}: ${expectedResultString[expectedResultString.length - 1 - i]}`);
// }
// console.log();

let DEBUG = false;

let originalResult = runSystem();
let originalResultString = originalResult.toString(2);
console.log(expectedResultString);
console.log(originalResultString);

let comparison = '';
let wires: string[] = [];
for (let i = 0; i < expectedResultString.length; i++) {
    if (expectedResultString[i] === originalResultString[i]) { comparison += ' '; }
    else { comparison += expectedResultString[i]; wires.push(`z${i.toString().padStart(2, '0')}`); }
}
console.log(comparison);
console.log();

console.log(wires.join(', '));
console.log();

for (const wire of wires) {
    let outputRule: Rule = null;
    for (const rule of rules) {
        if (rule.lhs === wire || rule.rhs === wire || rule.output === wire) {
            outputRule = rule;
            break;
        }
    }

    let rulesToSwap: Rule[] = [];
    // const outputRule = rulesToSwap[0];
    for (const rule of rules) {
        if (rule.lhs === outputRule.lhs || rule.rhs === outputRule.lhs || rule.output === outputRule.lhs ||
            rule.lhs === outputRule.rhs || rule.rhs === outputRule.rhs || rule.output === outputRule.rhs) {
                rulesToSwap.push(rule);
            }
    }


    console.log(`rules that affect ${wire}`);
    console.log(rulesToSwap.map(x => x.toString()));
    console.log();

    // break;
}

// for (let a = 0; a < rulesToSwap.length; a++) {
//     for (let b = a + 1; b < rulesToSwap.length; b++) {
//         if (a === b) { continue; }
//         for (let c = 0; c < rulesToSwap.length; c++) {
//             if (a === c || b === c) { continue; }
//             for (let d = c + 1; d < rulesToSwap.length; d++) {
//                 if (a === d || b === d || c === d) { continue; }
//                 console.log(a, b, c, d, 'e', 'f', 'g', 'h');
//                 for (let e = 0; e < rulesToSwap.length; e++) {
//                     if (a === e || b === e || c === e || d === e) { continue; }
//                     for (let f = e + 1; f < rulesToSwap.length; f++) {
//                         if (a === f || b === f || c === f || d === f || e === f) { continue; }
//                         for (let g = 0; g < rulesToSwap.length; g++) {
//                             if (a === g || b === g || c === g || d === g || e === g || f === g) { continue; }
//                             for (let h = g + 1; h < rulesToSwap.length; h++) {
//                                 if (a === h || b === h || c === h || d === h || e === h || f === h || g === h) { continue; }

//                                 debug(`swapping ${rulesToSwap[a].toString()} with ${rulesToSwap[b].toString()} and ${rulesToSwap[c].toString()} with ${rulesToSwap[d].toString()}`);

//                                 let temp = rulesToSwap[a].output;
//                                 rulesToSwap[a].output = rulesToSwap[b].output;
//                                 rulesToSwap[b].output = temp;
//                                 temp = rulesToSwap[c].output;
//                                 rulesToSwap[c].output = rulesToSwap[d].output;
//                                 rulesToSwap[d].output = temp;
//                                 temp = rulesToSwap[e].output;
//                                 rulesToSwap[e].output = rulesToSwap[f].output;
//                                 rulesToSwap[f].output = temp;
//                                 temp = rulesToSwap[g].output;
//                                 rulesToSwap[g].output = rulesToSwap[h].output;
//                                 rulesToSwap[h].output = temp;

//                                 // run system, check output
//                                 const result = runSystem();
//                                 debug(`  produced a result of ${result}`);
//                                 debug('');

//                                 if (result === expectedResult) {
//                                     const swappedGates = [rulesToSwap[a].output,
//                                     rulesToSwap[b].output,
//                                     rulesToSwap[c].output,
//                                     rulesToSwap[d].output,
//                                     rulesToSwap[e].output,
//                                     rulesToSwap[f].output,
//                                     rulesToSwap[g].output,
//                                     rulesToSwap[h].output,
//                                     ].sort((a, b) => a.localeCompare(b));
//                                     // console.log(a, b, c, d);
//                                     // console.log();
//                                     console.log(swappedGates.join(','));
//                                     exit();
//                                 }

//                                 temp = rulesToSwap[a].output;
//                                 rulesToSwap[a].output = rulesToSwap[b].output;
//                                 rulesToSwap[b].output = temp;
//                                 temp = rulesToSwap[c].output;
//                                 rulesToSwap[c].output = rulesToSwap[d].output;
//                                 rulesToSwap[d].output = temp;
//                                 temp = rulesToSwap[e].output;
//                                 rulesToSwap[e].output = rulesToSwap[f].output;
//                                 rulesToSwap[f].output = temp;
//                                 temp = rulesToSwap[g].output;
//                                 rulesToSwap[g].output = rulesToSwap[h].output;
//                                 rulesToSwap[h].output = temp;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// console.log(gates);

// for (let a = 0; a < rules.length; a++) {
//     for (let b = a + 1; b < rules.length; b++) {
//         if (a === b) { continue; }
//         for (let c = 0; c < rules.length; c++) {
//             if (a === c || b === c) { continue; }
//             for (let d = c + 1; d < rules.length; d++) {
//                 if (a === d || b === d || c === d) { continue; }
//                 for (let e = 0; e < rules.length; e++) {
//                     if (a === e || b === e || c === e || d === e) { continue; }
//                     for (let f = e + 1; f < rules.length; f++) {
//                         if (a === f || b === f || c === f || d === f || e === f) { continue; }
//                         console.log(a, b, c, d, e, f, 'g', 'h');
//                         for (let g = 0; g < rules.length; g++) {
//                             if (a === g || b === g || c === g || d === g || e === g || f === g) { continue; }
//                             for (let h = g + 1; h < rules.length; h++) {
//                                 if (a === h || b === h || c === h || d === h || e === h || f === h || g === h) { continue; }

//                                 // DEBUG = (g === 8 && h === 132);
//                                 // if (g === 8 && h === 132) { continue; }

//                                 debug(`swapping ${rules[a].toString()} with ${rules[b].toString()} and ${rules[c].toString()} with ${rules[d].toString()}`);

//                                 let temp = rules[a].output;
//                                 rules[a].output = rules[b].output;
//                                 rules[b].output = temp;
//                                 temp = rules[c].output;
//                                 rules[c].output = rules[d].output;
//                                 rules[d].output = temp;
//                                 temp = rules[e].output;
//                                 rules[e].output = rules[f].output;
//                                 rules[f].output = temp;
//                                 temp = rules[g].output;
//                                 rules[g].output = rules[h].output;
//                                 rules[h].output = temp;

//                                 // run system, check output
//                                 const result = runSystem();
//                                 debug(`  produced a result of ${result}`);
//                                 debug('');

//                                 if (result === expectedResult) {
//                                     const swappedGates = [rules[a].output,
//                                     rules[b].output,
//                                     rules[c].output,
//                                     rules[d].output,
//                                     rules[e].output,
//                                     rules[f].output,
//                                     rules[g].output,
//                                     rules[h].output,
//                                     ].sort((a, b) => a.localeCompare(b));
//                                     // console.log(a, b, c, d);
//                                     // console.log();
//                                     console.log(swappedGates.join(','));
//                                     exit();
//                                 }

//                                 temp = rules[a].output;
//                                 rules[a].output = rules[b].output;
//                                 rules[b].output = temp;
//                                 temp = rules[c].output;
//                                 rules[c].output = rules[d].output;
//                                 rules[d].output = temp;
//                                 temp = rules[e].output;
//                                 rules[e].output = rules[f].output;
//                                 rules[f].output = temp;
//                                 temp = rules[g].output;
//                                 rules[g].output = rules[h].output;
//                                 rules[h].output = temp;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }


function runSystem(): number {
    for (const [gate, value] of gates) {
        if (gate.startsWith('z')) {
            gates.delete(gate);
        }
    }

    let iterations = 0;
    while (true) {
        let setAnOutput = false;

        for (const rule of rules) {
            debug(rule.toString());

            if (true || !gates.has(rule.output)) {
                debug(`${rule.output} has not been set`);
                if (gates.has(rule.lhs) && gates.has(rule.rhs)) {
                    const lhs = gates.get(rule.lhs);
                    const rhs = gates.get(rule.rhs);
                    let result = -1;
                    if (rule.operator === 'AND') {
                        result = lhs & rhs;
                        debug(`result = ${lhs} & ${rhs} = ${result}`);
                    } else if (rule.operator === 'OR') {
                        result = lhs | rhs;
                        debug(`result = ${lhs} | ${rhs} = ${result}`);
                    } else if (rule.operator === 'XOR') {
                        result = lhs ^ rhs;
                        debug(`result = ${lhs} & ${rhs} = ${result}`);
                    } else {
                        result = Infinity;
                    }

                    if (!gates.has(rule.output) || (gates.has(rule.output) && gates.get(rule.output) !== result)) {
                        debug(`setting ${rule.output} to ${result}`);
                        gates.set(rule.output, result);
                        setAnOutput = true;
                    }
                }

                debug('');
            }
        }

        if (!setAnOutput) {
            // console.log(`breaking after ${iterations} iterations`);
            break;
        }

        iterations++;
        if (iterations > 100) {
            break;
        }
    }

    if (DEBUG) {
        console.log(gates);
    }

    let output = '';
    for (let i = 100; i >= 0; i--) {
        const gateName = `z${i.toString().padStart(2, '0')}`;
        if (gates.has(gateName)) {
            output += gates.get(gateName).toString();
        }
    }

    debug('');
    debug(parseInt(output, 2).toString());

    return parseInt(output, 2);
}


function debug(s: string) {
    if (DEBUG) {
        console.log(s);
    }
}
