
import { readFileSync } from 'fs';
import { exit } from 'process';

class Layer {
    depth: number;
    range: number;
    scannerPosition: number;
    direction: number;

    constructor(d: number, r: number) {
        this.depth = d;
        this.range = r;
        this.scannerPosition = 0;
        this.direction = 1;
    }

    move(): number {
        this.scannerPosition += this.direction;
        if (this.scannerPosition === 0 || this.scannerPosition === this.range - 1) {
            this.direction *= -1;
        }

        return this.scannerPosition;
    }
}

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

const layers: Layer[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [d, r] = lines[i].split(': ').map(x => parseInt(x));
    layers[i] = new Layer(d, r);
}

// console.log(layers);

const numLayers = Math.max(...layers.map(x => x.depth)) + 1;

// console.log(numLayers);

let currentLayer = 0;
let severity = 0;

for (let i = 0; i < numLayers; i++) {
    // console.log(`Picosend ${i}: Scanners at positions [${layers.map(x => x.scannerPosition)}], packet on layer ${currentLayer}`);
    const l = layers.filter(x => x.depth === currentLayer)[0];

    if (l && l.scannerPosition === 0) {
        console.log(`caught on layer ${currentLayer}`);
        severity += currentLayer * l.range;
    }

    for (const l of layers) {
        l.move();
    }

    currentLayer++;
}

console.log(severity);
