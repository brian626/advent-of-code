
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

const COUNT = 2000;

const buyerPrices: number[][] = [];
const buyerPriceDeltas: number[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    let secretNumber = parseInt(lines[i]);

    buyerPrices[i] = [secretNumber % 10];
    buyerPriceDeltas[i] = [secretNumber % 10];

    for (let j = 0; j < COUNT; j++) {
        const lastSecretNumber = secretNumber;
        secretNumber = nextSecretNumber(secretNumber);
        buyerPrices[i].push(secretNumber % 10);
        buyerPriceDeltas[i].push((secretNumber % 10) - (lastSecretNumber % 10));
    }
}

const priceDeltaSequencesSet: Set<string> = new Set<string>();
for (let x = 0; x < buyerPriceDeltas.length; x++) {
    const priceDeltas = buyerPriceDeltas[x];


    for (let i = 0; i < priceDeltas.length - 4; i++) {
        const priceDeltaSequence = [
            priceDeltas[i],
            priceDeltas[i + 1],
            priceDeltas[i + 2],
            priceDeltas[i + 3],
        ];

        priceDeltaSequencesSet.add(priceDeltaSequence.toString());
    }
}

let maxBananas = 0;

let iterations = 0;
for (const deltaSequence of priceDeltaSequencesSet) {
    iterations++;
    if (iterations % 100 === 0) { console.log(iterations, `of ${priceDeltaSequencesSet.size}`); }
    const priceDeltaSequence = deltaSequence.split(',').map(x => parseInt(x));
    let bananas = 0;
    // console.log(`looking for sequence [${priceDeltaSequence}], which triggers buyer #${x} at price ${bananas}`);

    for (let j = 0; j < buyerPriceDeltas.length; j++) {
        for (let k = 0; k < buyerPriceDeltas[j].length - 4; k++) {
            if (buyerPriceDeltas[j][k] === priceDeltaSequence[0] &&
                buyerPriceDeltas[j][k + 1] === priceDeltaSequence[1] &&
                buyerPriceDeltas[j][k + 2] === priceDeltaSequence[2] &&
                buyerPriceDeltas[j][k + 3] === priceDeltaSequence[3]) {
                bananas += buyerPrices[j][k + 3];
                // console.log(`  bought ${buyerPrices[j][k + 3]} bananas from buyer ${j}`);
                break;
            }
        }
    }

    // console.log(`  bought ${bananas} bananas total`);
    // console.log();

    maxBananas = Math.max(maxBananas, bananas);
}


console.log(maxBananas);


function nextSecretNumber(n: number): number {
    const b = mix(n, n * 64);
    const c = prune(b);

    const e = mix(c, Math.floor(c / 32));
    const f = prune(e);

    let h = mix(f, f * 2048);

    let i = prune(h);
    if (i < 0) {
        i += 16777216;
    }

    return i;
}

function mix(n1: number, n2: number): number {
    return n1 ^ n2;
}

function prune(n1: number): number {
    return n1 % 16777216;
}

// 1896 is too low
