
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');
const values: Map<number, number> = new Map<number, number>();

let mask = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(' ');
    if (parts[0] === 'mask') {
        mask = parts[2];
    } else {
        const address: number = parseInt(parts[0].split('[')[1].split(']')[0]);
        // const value: string = parseInt(parts[2]).toString(2).padStart(36, '0');
        const value: number = parseInt(parts[2]);
        const addresses: number[] = decode(address, mask);
        // console.log(addresses);
        // console.log();

        for (const a of addresses) {
            values.set(a, value);
        }
        // values.set(address, applyMask(value, mask));
        // console.log(`  stored value at address [${address}]`)
    }
}

// console.log(values);
let sum = 0;
values.forEach((v, k) => {
    sum += v;
});

console.log(sum);


function decode(address: number, mask: string): number[] {
    let addressString = address.toString(2).padStart(mask.length, '0');
    let result = '';

    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '0') { result += addressString[i]; }
        else if (mask[i] === '1') { result += '1'; }
        else { result += 'X'; }
    }

    // console.log(result);

    const results: number[] = [];
    const numFloats = result.split('').filter(x => x === 'X').length;
    for (let i = 0; i < Math.pow(2, numFloats); i++) {
        const replacements = i.toString(2).padStart(numFloats, '0');
        const expanded = result.split('');

        for (let j = 0; j < numFloats; j++) {
            expanded[expanded.indexOf('X')] = replacements[j];
        }

        // console.log(expanded.join(''));
        results.push(parseInt(expanded.join(''), 2));
    }

    return results;
}


// function applyMask(value: string, mask: string): number {
//     console.log(`applying mask [${mask}] to value [${value}]`);
//     let maskedValue = '';

//     for (let i = 0; i < mask.length; i++) {
//         if (mask[i] === 'X') {
//             maskedValue += value[i];
//         } else {
//             maskedValue += mask[i];
//         }
//     }

//     console.log(`  result is [${parseInt(maskedValue,2)}]`)
//     return parseInt(maskedValue, 2);
// }
