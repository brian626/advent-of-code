
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(' ');
    const pattern = parts[0].split('');
    const sizes = parts[1];
    console.log(pattern.join(''));
    // console.log(sizes);

    const numUnknowns = pattern.filter(x => x === '?').length;
    const permutations = Math.pow(2, numUnknowns);

    for (let i = 0; i < permutations; i++) {
        const bitmap = i.toString(2).padStart(numUnknowns, '0').split('');
        // console.log(`i is ${i}, bitmap is [${bitmap}]`);

        let arrangement = '';
        for (let j = 0; j < pattern.length; j++) {
            if (pattern[j] === '?') {
                const bit = bitmap.shift();
                arrangement += (bit === '0') ? '.' : '#';
            } else {
                arrangement += pattern[j];
            }
        }

        // console.log(arrangement);

        // Test arrangement against sizes
        if (testArrangement(arrangement, sizes)) {
            sum += 1;
        }
    }

    // console.log();
}

console.log(sum);

function testArrangement(a: string, s: string): boolean {
    // console.log(a);
    const sizes = a.split('.').map(x => x.length).filter(x => x > 0).join(',');
    // console.log(`does ${sizes} === ${s}?`);
    return sizes === s;
}
// ???.###
// ....###
// ..#.###
// .#..###
// .##.###
// #...###
// #.#.###
// ##.####
// #######
