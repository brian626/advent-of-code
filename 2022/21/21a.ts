// --- Day 21: Monkey Math ---

// The monkeys are back! You're worried they're going to try to steal your stuff again, but it seems like they're
// just holding their ground and making various monkey noises at you.

// Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out,
// they overheard you talking about trying to find the grove; they can show you a shortcut if you answer their riddle.

// Each monkey is given a job: either to yell a specific number or to yell the result of a math operation. All of
// the number-yelling monkeys know their number from the start; however, the math operation monkeys need to wait for
// two other monkeys to yell a number, and those two other monkeys might also be waiting on other monkeys.

// Your job is to work out the number the monkey named root will yell before the monkeys figure it out themselves.

// Each line contains the name of a monkey, a colon, and then the job of that monkey:

// A lone number means the monkey's job is simply to yell that number.

// A job like aaaa + bbbb means the monkey waits for monkeys aaaa and bbbb to yell each of their numbers; the monkey
// then yells the sum of those two numbers.

// aaaa - bbbb means the monkey yells aaaa's number minus bbbb's number.

// Job aaaa * bbbb will yell aaaa's number multiplied by bbbb's number.

// Job aaaa / bbbb will yell aaaa's number divided by bbbb's number.

// So, in the above example, monkey drzm has to wait for monkeys hmdt and zczc to yell their numbers. Fortunately,
// both hmdt and zczc have jobs that involve simply yelling a single number, so they do this immediately: 32 and 2.
// Monkey drzm can then yell its number by finding 32 minus 2: 30.

// Then, monkey sjmn has one of its numbers (30, from monkey drzm), and already has its other number, 5, from dbpl.
// This allows it to yell its own number by finding 30 multiplied by 5: 150.

// This process continues until root yells a number: 152.

// However, your actual situation involves considerably more monkeys. What number will the monkey named root yell?

import { readFileSync } from 'fs';

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

class Monkey {
    name: string;
    result: number;
    operand1: string;
    operand2: string;
    operator: string;

    constructor(n: string) {
        this.name = n;
        this.result = 0;
        this.operand1 = this.operand2 = this.operator = '';
    }
}

// const monkeys: Set<Monkey> = new Set<Monkey>();
const monkeys: Monkey[] = [];
let rootMonkey: Monkey = null;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(': ');
    const m = new Monkey(parts[0]);

    if (parts[0] === 'root') {
        rootMonkey = m;
    }

    const operationParts = parts[1].split(' ');
    if (operationParts.length > 1) {
        m.operand1 = operationParts[0];
        m.operator = operationParts[1];
        m.operand2 = operationParts[2];
    } else {
        m.result = Number(operationParts[0]);
    }
    monkeys.push(m);
}

// console.log(monkeys);

while (rootMonkey.result === 0) {
    for (let i = 0; i < monkeys.length; i++) {
        const m: Monkey = monkeys[i];

        if (m.result === 0) {
            const result1 = findMonkey(m.operand1).result;
            const result2 = findMonkey(m.operand2).result;
            if (result1 > 0 && result2 > 0) {
                if      (m.operator === '+') { m.result = result1 + result2; }
                else if (m.operator === '-') { m.result = result1 - result2; }
                else if (m.operator === '*') { m.result = result1 * result2; }
                else if (m.operator === '/') { m.result = result1 / result2; }
            }
        }
    }
}

console.log(rootMonkey.result);


function findMonkey(name: string): Monkey {
    for (let i = 0; i < monkeys.length; i++) {
        const m: Monkey = monkeys[i];
        if (m.name === name) {
            return m;
        }
    }

    return null;
}
