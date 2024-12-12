
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

const instructions: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    instructions.push(lines[i]);
}


const registers: Map<string, number> = new Map<string, number>();

let highestValue = -1 * Math.pow(2, 32);
for (const i of instructions) {
    const [target, operator, value, _, arg1, comparator, arg2] = i.split(' ');

    let compareResult = false;

    switch (comparator) {
        case '>':
            compareResult = getRegister(arg1) > parseInt(arg2);
            break;

        case '<':
            compareResult = getRegister(arg1) < parseInt(arg2);
            break;

        case '>=':
            compareResult = getRegister(arg1) >= parseInt(arg2);
            break;

        case '<=':
            compareResult = getRegister(arg1) <= parseInt(arg2);
            break;

        case '==':
            compareResult = getRegister(arg1) === parseInt(arg2);
            break;

        case '!=':
            compareResult = getRegister(arg1) !== parseInt(arg2);
            break;

        default:
            break;
    }

    if (compareResult) {
        changeRegister(target, operator, value);
    }

    highestValue = Math.max(highestValue, Math.max(...registers.values()));
}

console.log(registers);
console.log(highestValue);


function getRegister(r: string): number {
    if (registers.get(r)) { return registers.get(r); }
    else { return 0; }
}


function changeRegister(r: string, operator: string, value: string) {
    const prevValue = getRegister(r);
    if (operator === 'inc') {
        setRegister(r, prevValue + parseInt(value));
    } else if (operator === 'dec') {
        setRegister(r, prevValue - parseInt(value));
    }
}


function setRegister(r: string, v: number) {
    registers.set(r, v);
}
