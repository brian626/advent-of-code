
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

class Field {
    name: string;
    range1: number[];
    range2: number[];

    constructor(n: string, r1: number[], r2: number[]) {
        this.name = n;
        this.range1 = r1;
        this.range2 = r2;
    }
}

let scanningRanges = true;
let scanningMyTicket = false;
let scanningNearbyTickets = false;

const fields: Field[] = [];
let myTicket: number[] = [];
let nearbyTickets: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        if (scanningRanges) {
            scanningRanges = false;
            scanningMyTicket = true;
        } else if (scanningMyTicket) {
            scanningMyTicket = false;
            scanningNearbyTickets = true;
        }
        continue;
    }

    if (scanningRanges) {
        const matches = /([^:]+): ([\d-]+) or ([\d-]+)/.exec(lines[i]);
        fields.push(new Field(matches[1], matches[2].split('-').map(x => parseInt(x)), matches[3].split('-').map(x => parseInt(x))));
    } else if (scanningMyTicket) {
        if (!lines[i].startsWith('your')) {
            myTicket = lines[i].split(',').map(x => parseInt(x));
        }
    } else if (scanningNearbyTickets) {
        if (!lines[i].startsWith('nearby')) {
            const ticket = lines[i].split(',').map(x => parseInt(x));
            nearbyTickets.push(ticket);
        }
    }
}

// console.log(fields);
// console.log(myTicket);
// console.log(nearbyTickets);

let sum = 0;
for (const t of nearbyTickets) {
    sum += findInvalidValue(t);
}

console.log(sum);



function findInvalidValue(ticket: number[]): number {
    let invalidValue = 0;

    for (const v of ticket) {
        let isValid = false;
        for (const f of fields) {
            if ((v >= f.range1[0] && v <= f.range1[1]) || (v >= f.range2[0] && v <= f.range2[1])) {
                console.log(`${v} is valid for field ${f.name}, ${f.range1}, ${f.range2}`);
                invalidValue = 0;
                isValid = true;
                break;
            } else {
                console.log(`${v} is NOT valid for field ${f.name}, ${f.range1}, ${f.range2}`);
                invalidValue = v;
            }
        }

        if (invalidValue !== 0) {
            break;
        }
    }

    console.log(`returning ${invalidValue} for ticket ${ticket}`);
    console.log();

    return invalidValue;
}
