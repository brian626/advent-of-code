
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

class Ticket {
    values: number[];
    valid: boolean;

    constructor(v: number[]) {
        this.values = Array.from(v);
        this.valid = true;
    }
}

let scanningRanges = true;
let scanningMyTicket = false;
let scanningNearbyTickets = false;

const fields: Field[] = [];
let myTicket: Ticket = null;
let nearbyTickets: Ticket[] = [];

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
            myTicket = new Ticket(lines[i].split(',').map(x => parseInt(x)));
        }
    } else if (scanningNearbyTickets) {
        if (!lines[i].startsWith('nearby')) {
            const ticketValues = lines[i].split(',').map(x => parseInt(x));
            nearbyTickets.push(new Ticket(ticketValues));
        }
    }
}

for (const t of nearbyTickets) {
    const invalidValue = findInvalidValue(t);
    if (invalidValue !== 0) {
        t.valid = false;
    }
}

const validTickets = nearbyTickets.filter(x => x.valid);
// console.log(validTickets);


const allFields = fields.map(x => x.name);
const valueToFieldsMap: Map<number, string[]> = new Map<number, string[]>();
for (let i = 0; i < allFields.length; i++) {
    valueToFieldsMap.set(i, Array.from(allFields));
}

for (const t of validTickets) {
    for (let i = 0; i < t.values.length; i++) {
        const v = t.values[i];
        for (const f of fields) {
            if (!isValidFieldValue(f, v)) {
                // console.log(`field #${i} cannot be ${f.name}`);
                const fields = valueToFieldsMap.get(i);
                valueToFieldsMap.set(i, fields.filter(x => x !== f.name));
            }
        }
    }

    // console.log();
}

console.log(valueToFieldsMap);

while (true) {
    let foundFieldWithMultipleValues = false;
    for (const [k, v] of valueToFieldsMap) {
        if (v.length === 1) {
            removeFieldFromMap(v[0]);
        } else {
            foundFieldWithMultipleValues = true;
        }
    }

    if (!foundFieldWithMultipleValues) {
        break;
    }
}

console.log(valueToFieldsMap);


function removeFieldFromMap(f: string) {
    for (const [k, v] of valueToFieldsMap) {
        if (v.length > 1) {
            valueToFieldsMap.set(k, v.filter(x => x !== f));
        }
    }
}

let product = 1;
for (const [k, v] of valueToFieldsMap) {
    console.log(k, v);
    if (v[0].startsWith('departure')) {
        product *= myTicket.values[k];
    }
}

console.log(product);


function isValidFieldValue(f: Field, v: number): boolean {
    return ((v >= f.range1[0] && v <= f.range1[1]) || (v >= f.range2[0] && v <= f.range2[1]));
}


function findInvalidValue(ticket: Ticket): number {
    let invalidValue = 0;

    for (const v of ticket.values) {
        let isValid = false;
        for (const f of fields) {
            if ((v >= f.range1[0] && v <= f.range1[1]) || (v >= f.range2[0] && v <= f.range2[1])) {
                // console.log(`${v} is valid for field ${f.name}, ${f.range1}, ${f.range2}`);
                invalidValue = 0;
                isValid = true;
                break;
            } else {
                // console.log(`${v} is NOT valid for field ${f.name}, ${f.range1}, ${f.range2}`);
                invalidValue = v;
            }
        }

        if (invalidValue !== 0) {
            break;
        }
    }

    // console.log(`returning ${invalidValue} for ticket ${ticket}`);
    // console.log();

    return invalidValue;
}
