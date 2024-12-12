
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const sum = calculate(lines[i]);

    // console.log(`sum of ${lines[i]} is ${sum}`);
    console.log(`sum is ${sum}`);
}


function calculate(s: string): number {
    const j = JSON.parse(s);

    return loopThroughJSON(j);
}


function loopThroughJSON(obj: any): number {
    let sum = 0;

    // console.log(`considering obj ${obj}`);
    let addedFromKeys = false;
    for (const key in obj) {
        addedFromKeys = true;
        // console.log(`  considering key ${obj[key]}`);
        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                // console.log(`    ${obj[key]} is array`);
                // loop through array
                for (let i = 0; i < obj[key].length; i++) {
                    // console.log(`      looping on ${obj[key][i]}`);
                    sum += loopThroughJSON(obj[key][i]);
                }
            } else {
                // console.log(`    ${obj[key]} is object`);
                // call function recursively for object
                sum += loopThroughJSON(obj[key]);
            }
        } else {
            const v = parseInt(obj[key]);
            if (!isNaN(v)) {
                console.log(`  adding ${v}`);
                sum += v;
            } else {
                // console.log(`  not adding ${obj.toString()}`);
            }
        }
    }

    if (!addedFromKeys) {
        const v = parseInt(obj);
        if (!isNaN(v)) {
            console.log(`  adding ${v}`);
            sum += v;
        } else {
            // console.log(`  not adding ${obj.toString()}`);
        }
    }

    return sum;
}

// 127429 is too low
// 199412 is too high
