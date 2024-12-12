
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

let steps: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    steps = lines[i].split(',');
}

class Lens {
    label: string;
    focalLength: number;

    constructor(l: string, f: string) {
        this.label = l;
        this.focalLength = parseInt(f);
    }
}

let boxes: Map<number, Lens[]> = new Map<number, Lens[]>();

for (const step of steps) {
    let label = '';
    let focalLength = '';
    let h = 0;

    if (step.includes('=')) {
        [label, focalLength] = step.split('=');
        h = hash(label);
        let lenses = boxes.get(h);
        if (lenses?.filter(x => x.label === label).length > 0) {
            console.log(`replacing existing lens in box ${h}`);
            for (let i = 0; i < lenses.length; i++) {
                const lens = lenses[i];
                if (lens.label === label) {
                    lens.focalLength = parseInt(focalLength);
                    break;
                }
            }
        } else {
            console.log(`adding new lens to box ${h}`);
            if (!lenses) { lenses = []; }
            lenses.push(new Lens(label, focalLength));
        }
        boxes.set(h, lenses);
    } else {
        [label] = step.split('-');
        h = hash(label);
        console.log(`removing lens from box ${h}`);
        let lenses = boxes.get(h)?.filter(x => x.label !== label);
        boxes.set(h, lenses);
    }
}

// console.log(boxes);

let power = 0;

for (const box of boxes) {
    const boxNumber = box[0] + 1;
    const lenses = box[1];
    for (let i = 0; i < lenses.length; i++) {
        power += boxNumber * (i+1) * lenses[i].focalLength;
    }
}

console.log(power);

function hash(s: string): number {
    let v = 0;
    const chars = s.split('');

    for (const char of chars) {
        v += char.charCodeAt(0);
        v *= 17;
        v = v % 256;
    }

    return v;
}
