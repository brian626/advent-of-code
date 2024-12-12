
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');

let diskMap = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    diskMap = lines[i];
}

console.log(`constructing map`);
const blocks: string[] = [];
let id = 0;
for (let i = 0; i < diskMap.length; i++) {
    if ((i+1) % 2 === 0) {
        for (let j = 0; j < parseInt(diskMap[i]); j++) {
            blocks.push('.');
        }
    } else {
        for (let j = 0; j < parseInt(diskMap[i]); j++) {
            blocks.push(id.toString());
        }
        id++;
    }
}
console.log(`constructed map`);

// console.log(blocks.join(''));

console.log(`defragging`);
// Defrag
while (true) {
    let moveFrom = blocks.length - 1;
    while (blocks[moveFrom] === '.') { moveFrom--; }

    let moveTo = 0;
    while (blocks[moveTo] !== '.') { moveTo++; }

    if (moveFrom < moveTo) { break; }
    const temp = blocks[moveTo];
    blocks[moveTo] = blocks[moveFrom];
    blocks[moveFrom] = temp;
}
console.log(`defragged`);


// console.log(blocks.join(''));


// Checksum
let checksum = 0;
for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== '.') {
        checksum += (i * parseInt(blocks[i]));
    }
}

console.log(checksum);


// class Block {
//     type: string; // L for file, R for free
//     size: number;
//     id: number;

//     constructor(t: string, s: number, i: number) {
//         this.type = t;
//         this.size = s;
//         this.id = i;
//     }
// }

// const blocks: Block[] = [];

// let id = 0;
// for (let i = 0; i < diskMap.length; i++) {
//     if (i % 2 === 0) {
//         blocks.push(new Block('R', parseInt(diskMap[i]), -1));
//     } else {
//         blocks.push(new Block('L', parseInt(diskMap[i]), id));
//         id++;
//     }
// }

// while (true) {
//     const
// }
