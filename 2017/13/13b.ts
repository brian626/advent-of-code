
import { readFileSync } from 'fs';
import { exit } from 'process';

class Layer {
    depth: number;
    range: number;
    cycle: number[];
    cyclePtr: number;

    constructor(d: number, r: number) {
        this.depth = d;
        this.range = r;
        this.cycle = [];
        for (let i = 0; i < this.range; i++) { this.cycle.push(i); }
        for (let i = this.range - 2; i > 0; i--) { this.cycle.push(i); }
        this.cyclePtr = 0;
    }

    move(s: number = 1): void {
        this.cyclePtr += s;
        this.cyclePtr = this.cyclePtr % (this.cycle.length);
        // for (let i = 0; i < s; i++) {
        //     this.cycle.push(this.cycle.shift());
        // }
    }

    reset(): void {
        this.cyclePtr = 0;
        // this.cycle = [];
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

let shortestDelay = -1;
for (let DELAY = 0; DELAY < 10000000; DELAY++) {
    for (const l of layers) { l.reset(); }

    // console.log(`moving all layers by ${DELAY} steps`);
    for (const l of layers) { l.move(DELAY); }
    for (let i = 0; i < layers.length; i++) {
        if (layers[i]) {
            // console.log(`moving layer ${i} by ${layers[i].depth} more steps`);
            layers[i].move(layers[i].depth);
        }
    }

    // console.log(`After ${DELAY} delay, state is`);
    // console.log(layers);
    // console.log();

    let caught = false;

    for (let i = 0; i < numLayers; i++) {
        if (layers[i] && layers[i].cycle[layers[i].cyclePtr] === 0) {
            if (DELAY % 1001 === 0) {
                console.log(`Caught on layer ${i} with ${DELAY} delay`);
                // console.log();
                // console.log();
            }
            caught = true;
            break;
        }
    }

    if (!caught) {
        shortestDelay = DELAY;
        break;
    }
}

console.log(shortestDelay);
