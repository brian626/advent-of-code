
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

// type Layer = number[][];
class Layer {
    data: number[][];

    constructor() {
        this.data = [];
    }
}

const layers: Layer[] = [];
const width = 25;
const height = 6;

let pixelData: string = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    pixelData = lines[i];
}

const numLayers = pixelData.length / (width * height);
// console.log(numLayers);

for (let i = 0; i < numLayers; i++) {
    const l = new Layer();

    for (let r = 0; r < height; r++) {
        l.data[r] = [];
        for (let c = 0; c < width; c++) {
            l.data[r][c] = parseInt(pixelData[(r * width) + (i * (width * height)) + c]);
        }
    }

    layers.push(l);
}

// console.log(layers[0]);
// console.log(layers[1]);

let layerWithFewestZeroes = -1;
let fewestZeroes = Math.pow(2, 32);
for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    let numZeroes = 0;
    for (let r = 0; r < l.data.length; r++) {
        numZeroes += l.data[r].filter(x => x === 0).length;
    }

    if (numZeroes < fewestZeroes) {
        fewestZeroes = numZeroes;
        layerWithFewestZeroes = i;
    }
}

// console.log(layerWithFewestZeroes);

const l = layers[layerWithFewestZeroes];
let numOnes = 0;
let numTwos = 0;
for (let r = 0; r < l.data.length; r++) {
    numOnes += l.data[r].filter(x => x === 1).length;
    numTwos += l.data[r].filter(x => x === 2).length;
}

console.log(numOnes * numTwos);
