
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./03.test', 'utf-8');

const lines = file.split('\n');

const dataSquares: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    dataSquares.push(parseInt(lines[i]));
}

for (const dataSquare of dataSquares) {
    let ring = 0;
    for (let i = 0; i < 1000; i++) {
        const lr = Math.pow((2 * i) + 1, 2);
        if (lr > dataSquare) {
            console.log(`data square ${dataSquare} can be found in ring ${i}`);
            ring = i;
            break;
        }
    }

    let steps = ring * 2;
    const lr = Math.pow((2 * ring) + 1, 2);
    const ll = 4 * Math.pow((ring + 1), 2) - (6 * (ring + 1)) + 3;
    const ul = 4 * Math.pow(ring, 2) + 1;
    const ur = 4 * Math.pow((ring + 1), 2) - (10 * (ring + 1)) + 7;

    if (dataSquare <= ur) {
        const fakeLR = Math.pow((2 * (ring - 1)) + 1, 2);
        console.log(`right side, dataSquare is ${dataSquare}, upper right is ${ur}, lower right is ${fakeLR}`);
        if (dataSquare > ((ur + fakeLR) / 2)) {
            steps -= (ur - dataSquare);
        } else {
            steps -= (dataSquare - fakeLR);
        }
    } else if (dataSquare >= ur && dataSquare <= ul) {
        console.log(`top side, dataSquare is ${dataSquare}, upper left is ${ul}, upper right is ${ur}`);
        if (dataSquare > ((ul + ur) / 2)) {
            steps -= (ul - dataSquare);
        } else {
            steps -= (dataSquare - ur);
        }
    } else if (dataSquare >= ul && dataSquare <= ll) {
        console.log(`left side, dataSquare is ${dataSquare}, lower left is ${ll}, upper left is ${ul}`);
        if (dataSquare !== ul) {
            if (dataSquare > ((ll + ul) / 2)) {
                steps -= (ll - dataSquare);
            } else {
                steps -= (dataSquare - ul);
            }
        }
    } else if (dataSquare >= ll && dataSquare <= lr) {
        console.log(`bottom side, dataSquare is ${dataSquare}, lower right is ${lr}, lower left is ${ll}`);
        if (dataSquare > ((lr + ll) / 2)) {
            steps -= (lr - dataSquare);
        } else {
            steps -= (dataSquare - ll);
        }
    }

    console.log(steps);
    console.log();
}
