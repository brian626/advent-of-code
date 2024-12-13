
import { readFileSync } from 'fs';
import { exit } from 'process';
import { permutations } from '../../common/permutations';

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');


const instructions: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    instructions.push(lines[i]);
}

function scramble(input: string): string {
    let s = input.split('');

    for (const instruction of instructions) {
        if (instruction.startsWith('move')) {
            const matches = /move position (\d+) to position (\d+)/.exec(instruction);
            const [moveFrom, moveTo] = [matches[1], matches[2]].map(x => parseInt(x));
            const moveItem = s.splice(moveFrom, 1);
            // console.log(`moving '${moveItem}' in position ${moveFrom} to position ${moveTo}`);
            s = s.slice(0, moveTo).concat(moveItem).concat(s.slice(moveTo));
        } else if (instruction.startsWith('reverse')) {
            const matches = /reverse positions (\d+) through (\d+)/.exec(instruction);
            const [start, end] = [matches[1], matches[2]].map(x => parseInt(x));
            // console.log(`reversing positions ${start} to ${end}`);
            s = s.slice(0, start).concat(s.slice(start, end + 1).reverse()).concat(s.slice(end + 1));
        } else if (instruction.startsWith('rotate based')) {
            const matches = /rotate based on position of letter ([a-z])/.exec(instruction);
            const rotationIndex = s.indexOf(matches[1]);
            const rotate = 1 + rotationIndex + (rotationIndex >= 4 ? 1 : 0);
            // console.log(`rotating ${rotate} positions based on index of '${matches[1]}'`);
            for (let i = 0; i < rotate; i++) {
                s.unshift(s.pop());
            }
        } else if (instruction.startsWith('rotate left')) {
            const matches = /rotate left (\d+) step/.exec(instruction);
            const rotate = parseInt(matches[1]);
            // console.log(`rotating left ${rotate} positions`);
            for (let i = 0; i < rotate; i++) {
                s.push(s.shift());
            }
        } else if (instruction.startsWith('rotate right')) {
            const matches = /rotate right (\d+) step/.exec(instruction);
            const rotate = parseInt(matches[1]);
            // console.log(`rotating right ${rotate} positions`);
            for (let i = 0; i < rotate; i++) {
                s.unshift(s.pop());
            }
        } else if (instruction.startsWith('swap letter')) {
            const matches = /swap letter ([a-z]) with letter ([a-z])/.exec(instruction);
            const [index1, index2] = [matches[1], matches[2]].map(x => s.indexOf(x));
            // console.log(`swapping letters '${matches[1]}' and '${matches[2]}'`);
            const temp = s[index1];
            s[index1] = s[index2];
            s[index2] = temp;
        } else if (instruction.startsWith('swap position')) {
            const matches = /swap position (\d+) with position (\d+)/.exec(instruction);
            const [index1, index2] = [matches[1], matches[2]].map(x => parseInt(x));
            // console.log(`swapping letters at position '${matches[1]}' and '${matches[2]}'`);
            const temp = s[index1];
            s[index1] = s[index2];
            s[index2] = temp;
        }
    }

    return s.join('');
}

// console.log(scramble('abcdefgh'));

const mySet = new Set('abcdefgh'.split(''));
const perms = permutations(mySet);
for (const p of perms) {
    if (scramble(p.join('')) === 'fbgdceah') {
        console.log(p.join(''));
        break;
    }
}
