
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./21.test', 'utf-8');

const lines = file.split('\n');


let password = 'decab'.split('');

let steps: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps.unshift(lines[i]);
}

// console.log(steps);

console.log(password.join(''));
console.log();

for (const s of steps) {
    console.log(`step: '${s}'`);

    if (s.startsWith('move')) {
        const matches = /move position (\d+) to position (\d+)/.exec(s);
        const [moveFrom, moveTo] = [matches[1], matches[2]].map(x => parseInt(x));
        const moveItem = password.splice(moveTo, 1);
        console.log(`moving '${moveItem}' in position ${moveTo} to position ${moveFrom}`);
        password = password.slice(0, moveFrom).concat(moveItem).concat(password.slice(moveFrom));
    } else if (s.startsWith('reverse')) {
        const matches = /reverse positions (\d+) through (\d+)/.exec(s);
        const [start, end] = [matches[1], matches[2]].map(x => parseInt(x));
        console.log(`reversing positions ${start} to ${end}`);
        // console.log(`'${password.slice(0, start)}'`);
        // console.log(`'${password.slice(start, end + 1).reverse()}'`);
        // console.log(`'${password.slice(end + 1)}'`);
        password = password.slice(0, start).concat(password.slice(start, end + 1).reverse()).concat(password.slice(end + 1));
    } else if (s.startsWith('rotate based')) {
        const matches = /rotate based on position of letter ([a-z])/.exec(s);
        const rotationIndex = password.indexOf(matches[1]);
        const rotate = 1 + rotationIndex + (rotationIndex >= 4 ? -1 : 0);
        console.log(`rotating right ${rotate} (1 + ${rotationIndex} + ${rotationIndex >= 4 ? -1 : 0}) positions based on index of '${matches[1]}'`);
        for (let i = 0; i < rotate; i++) {
            password.push(password.shift());
        }
    } else if (s.startsWith('rotate left')) {
        const matches = /rotate left (\d+) step/.exec(s);
        const rotate = parseInt(matches[1]);
        console.log(`rotating right ${rotate} positions`);
        for (let i = 0; i < rotate; i++) {
            password.unshift(password.pop());
        }
    } else if (s.startsWith('rotate right')) {
        const matches = /rotate right (\d+) step/.exec(s);
        const rotate = parseInt(matches[1]);
        console.log(`rotating left ${rotate} positions`);
        for (let i = 0; i < rotate; i++) {
            password.push(password.shift());
        }
    } else if (s.startsWith('swap letter')) {
        const matches = /swap letter ([a-z]) with letter ([a-z])/.exec(s);
        const [index1, index2] = [matches[1], matches[2]].map(x => password.indexOf(x));
        console.log(`swapping letters '${matches[1]}' and '${matches[2]}'`);
        const temp = password[index1];
        password[index1] = password[index2];
        password[index2] = temp;
    } else if (s.startsWith('swap position')) {
        const matches = /swap position (\d+) with position (\d+)/.exec(s);
        const [index1, index2] = [matches[1], matches[2]].map(x => parseInt(x));
        console.log(`swapping letters at position '${matches[1]}' and '${matches[2]}'`);
        const temp = password[index1];
        password[index1] = password[index2];
        password[index2] = temp;
    }

    console.log(`result: '${password.join('')}'`);
    console.log();
}

console.log(password.join(''));

// fcbedhga is not right
