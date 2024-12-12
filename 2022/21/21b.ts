// --- Part Two ---

// Due to some kind of monkey-elephant-human mistranslation, you seem to have misunderstood a few key details about the riddle.

// First, you got the wrong job for the monkey named root; specifically, you got the wrong math operation. The correct operation
// for monkey root should be =, which means that it still listens for two numbers (from the same two monkeys as before), but now
// checks that the two numbers match.

// Second, you got the wrong monkey for the job starting with humn:. It isn't a monkey - it's you. Actually, you got the job wrong,
// too: you need to figure out what number you need to yell so that root's equality check passes. (The number that appears after
// humn: in your input is now irrelevant.)

// In the above example, the number you need to yell to pass root's equality test is 301. (This causes root to get the same number,
// 150, from both of its monkeys.)

// What number do you yell to pass root's equality test?

import { readFileSync } from 'fs';

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

class Monkey {
    name: string;
    result: number;
    operand1: string;
    operand2: string;
    operator: string;

    constructor(n: string, r: number = 0, op1: string = '', op2: string = '', operator: string = '') {
        this.name = n;
        this.result = r;
        this.operand1 = op1;
        this.operand2 = op2;
        this.operator = operator;
    }
}

const monkeys: Monkey[] = [];
let rootMonkey: Monkey = null;
let human: Monkey = null;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(': ');
    const m = new Monkey(parts[0]);

    const operationParts = parts[1].split(' ');
    if (operationParts.length > 1) {
        m.operand1 = operationParts[0];
        m.operator = operationParts[1];
        m.operand2 = operationParts[2];
    } else {
        m.result = Number(operationParts[0]);
    }
    monkeys.push(m);

    if (parts[0] === 'root') {
        rootMonkey = m;
        rootMonkey.operator = '=';
    }
    if (parts[0] === 'humn') {
        human = m;
        human.operand1 = '';
        human.operand2 = '';
        human.operator = '';
        human.result = null;
    }
}

// console.log(monkeys);

let runCount = 0;

while (rootMonkey.result === 0) {
    for (let i = 0; i < monkeys.length; i++) {
        const m: Monkey = monkeys[i];

        if (m.result === 0) {
            const result1 = findMonkey(monkeys, m.operand1).result;
            const result2 = findMonkey(monkeys, m.operand2).result;
            if (result1 > 0 && result2 > 0) {
                if      (m.operator === '+') { m.result = result1 + result2; }
                else if (m.operator === '-') { m.result = result1 - result2; }
                else if (m.operator === '*') { m.result = result1 * result2; }
                else if (m.operator === '/') { m.result = result1 / result2; }
            }
        }
    }

    runCount++;
    if (runCount > 1000) {
        break;
    }
}

// for (let i = 0; i < monkeys.length; i++) {
//     const m = monkeys[i];
//     if (m.result > 0) {
//         console.log(`${m.name}: ${m.result}`);
//     } else {
//         console.log(`${m.name}: ${m.operand1} ${m.operator} ${m.operand2}`);
//     }
// }
// console.log(`=======================================================`);

let monkey1 = findMonkey(monkeys, rootMonkey.operand1);
let expression1 = `${monkey1.name}`;
while (true) {
    // console.log(expression1);
    let newExpression1 = simplifyExpression(expression1);
    // console.log(`  simplified <<<${expression1}>>> to <<<${newExpression1}>>>`);
    if (newExpression1 === expression1) {
        break;
    } else {
        expression1 = newExpression1;
    }
}

// console.log(``);

let monkey2 = findMonkey(monkeys, rootMonkey.operand2);
let expression2 = `${monkey2.name}`;
while (true) {
    // console.log(expression2);
    let newExpression2 = simplifyExpression(expression2);
    // console.log(`  simplified <<<${expression1}>>> to <<<${newExpression1}>>>`);
    if (newExpression2 === expression2) {
        break;
    } else {
        expression2 = newExpression2;
    }
}

console.log(``);
console.log(`${expression1} = ${expression2}`);


function simplifyExpression(e: string): string {
    const monkeyNameRe = new RegExp('([a-z]{4})');

    // e will contain the name of one or more monkeys. Find the first one and replace it with its operands.
    const results = monkeyNameRe.exec(e);
    if (results) {
        const monkey = findMonkey(monkeys, results[1]);
        if (monkey.name === 'humn') {
            return e.replace(monkey.name, 'hum');
        } else if (monkey.result > 0) {
            return e.replace(monkey.name, monkey.result.toString());
        } else {
            return e.replace(monkey.name, `(${monkey.operand1} ${monkey.operator} ${monkey.operand2})`);
        }
    } else {
        return e;
    }
}


function findMonkey(monkeys: Monkey[], name: string): Monkey {
    for (let i = 0; i < monkeys.length; i++) {
        const m: Monkey = monkeys[i];
        if (m.name === name) {
            return m;
        }
    }

    return null;
}
