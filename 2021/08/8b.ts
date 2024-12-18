// Through a little deduction, you should now be able to determine the remaining digits.
// Consider again the first example above:

// acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

// After some careful analysis, the mapping between signal wires and segments only make sense in the following configuration:

//  dddd
// e    a
// e    a
//  ffff
// g    b
// g    b
//  cccc

// So, the unique signal patterns would correspond to the following digits:

// acedgfb: 8
// cdfbe: 5
// gcdfa: 2
// fbcad: 3
// dab: 7
// cefabd: 9
// cdfgeb: 6
// eafb: 4
// cagedb: 0
// ab: 1

// Then, the four digits of the output value can be decoded:

// cdfeb: 5
// fcadb: 3
// cdfeb: 5
// cdbaf: 3

// Therefore, the output value for this entry is 5353.

// Following this same process for each entry in the second, larger example above,
// the output value of each entry can be determined:

// fdgacbe cefdb cefbgd gcbe: 8394
// fcgedb cgb dgebacf gc: 9781
// cg cg fdcagb cbg: 1197
// efabcd cedba gadfec cb: 9361
// gecf egdcabf bgf bfgea: 4873
// gebdcfa ecba ca fadegcb: 8418
// cefg dcbef fcge gbcadfe: 4548
// ed bcgafe cdgba cbgef: 1625
// gbdfcae bgc cg cgb: 8717
// fgae cfgab fg bagce: 4315

// Adding all of the output values in this larger example produces 61229.

// For each entry, determine all of the wire/segment connections and decode the four-digit output values.
// What do you get if you add up all of the output values?

import { readFileSync } from 'fs';

const file = readFileSync('./8.input', 'utf-8');

const lines = file.split('\n');

let sum = 0;

for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split('|').filter(x => x.length > 0);
    const patterns = parts[0]?.split(' ').map(x => x.split('').sort().join('')).filter(x => x.length > 0);
    const outputs = parts[1]?.split(' ').map(x => x.split('').sort().join('')).filter(x => x.length > 0);

    if (patterns?.length > 0) {
        sum += decode(patterns, outputs);
    }
}

console.log(sum);

function decode(patterns: string[], outputs: string[]): number {
    // console.log(`decoding patterns [${patterns}] and outputs [${outputs}]`);
    const translations: Map<string, string> = new Map<string, string>();

    patterns.forEach(p => {
        if (p.length === 2) {
            translations.set('1', p);
        }
        else if (p.length === 3) {
            translations.set('7', p);
        }
        else if (p.length === 4) {
            translations.set('4', p);
        }
        else if (p.length === 7) {
            translations.set('8', p);
        }
    });

    patterns.forEach(p => {
        if (p.length === 5) {
            // 2 overlaps 1 with 1, 2 with 4, 2 with 7
            // 3 overlaps 2 with 1, 3 with 4, 3 with 7
            // 5 overlaps 1 with 1, 3 with 4, 2 with 7
            if (countOverlaps(p, translations.get('1')) === 2) {
                translations.set('3', p);
            }
            else if (countOverlaps(p, translations.get('4')) === 2) {
                translations.set('2', p);
            }
            else {
                translations.set('5', p);
            }
        }
        else if (p.length === 6) {
            // 0 overlaps 2 with 1, 3 with 4, 3 with 7
            // 6 overlaps 1 with 1, 3 with 4, 2 with 7
            // 9 overlaps 2 with 1, 4 with 4, 3 with 7
            if (countOverlaps(p, translations.get('1')) === 1) {
                translations.set('6', p);
            }
            else if (countOverlaps(p, translations.get('4')) === 4) {
                translations.set('9', p);
            }
            else {
                translations.set('0', p);
            }
        }
    });

    // console.log(translations);

    let decodes: Map<string, string> = new Map<string, string>();
    decodes.set(translations.get('0'), '0');
    decodes.set(translations.get('1'), '1');
    decodes.set(translations.get('2'), '2');
    decodes.set(translations.get('3'), '3');
    decodes.set(translations.get('4'), '4');
    decodes.set(translations.get('5'), '5');
    decodes.set(translations.get('6'), '6');
    decodes.set(translations.get('7'), '7');
    decodes.set(translations.get('8'), '8');
    decodes.set(translations.get('9'), '9');

    let result = "";
    outputs.forEach(o => {
        result += decodes.get(o);
    });

    return parseInt(result);
}

function countOverlaps(a: string, b: string): number {
    let numOverlaps = 0;
    for (let i = 0; i < b.length; i++) {
        if (a.includes(b[i])) {
            numOverlaps += 1;
        }
    }

    return numOverlaps;
}
