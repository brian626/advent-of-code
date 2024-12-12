
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

class Layer {
    data: number[][];

    constructor() {
        this.data = [];
    }
}

const layers: Layer[] = [];
const WIDTH = 25;
const HEIGHT = 6;

let pixelData: string = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    pixelData = lines[i];
}

const numLayers = pixelData.length / (WIDTH * HEIGHT);
// console.log(numLayers);

for (let i = 0; i < numLayers; i++) {
    const l = new Layer();

    for (let r = 0; r < HEIGHT; r++) {
        l.data[r] = [];
        for (let c = 0; c < WIDTH; c++) {
            l.data[r][c] = parseInt(pixelData[(r * WIDTH) + (i * (WIDTH * HEIGHT)) + c]);
        }
    }

    layers.push(l);
}

// console.log(layers[0]);
// console.log(layers[1]);

const decoded: number[][] = [];

for (let r = 0; r < HEIGHT; r++) {
    decoded[r] = [];
    for (let c = 0; c < WIDTH; c++) {
        let value = -1;
        for (let l = 0; l < layers.length; l++) {
            if (layers[l].data[r][c] != 2) {
                decoded[r][c] = layers[l].data[r][c];
                break;
            }
        }
    }
}

for (let i = 0; i < decoded.length; i++) {
    console.log(decoded[i].map(x => x === 0 ? ' ' : x).join(''));
}
