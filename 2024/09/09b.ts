
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
let moveFromEnd = blocks.length - 1;
while (moveFromEnd > 0) {
    while (blocks[moveFromEnd] === '.') { moveFromEnd--; }
    let moveFromStart = moveFromEnd;
    while (blocks[moveFromStart] === blocks[moveFromEnd]) { moveFromStart--; }
    moveFromStart++;
    const spaceNeeded = moveFromEnd - moveFromStart + 1;

    let moveToStart = 0;
    let moveToEnd = 0;
    let spaceAvailable = moveToEnd - moveToStart;
    while (moveToStart < blocks.length) {
        while (blocks[moveToStart] !== '.') { moveToStart++; }
        moveToEnd = moveToStart;
        while (blocks[moveToEnd] === blocks[moveToStart]) { moveToEnd++; }
        spaceAvailable = moveToEnd - moveToStart;
        if (moveToStart > moveFromStart) { spaceAvailable = 0; break; }

        if (spaceAvailable >= spaceNeeded) { break; }
        else { moveToStart = moveToEnd; }
    }

    if (spaceAvailable >= spaceNeeded) {
        // console.log(`Want to move blocks from ${moveFromStart} to ${moveFromEnd} (size ${spaceNeeded})`);
        // console.log(`  to blocks from ${moveToStart} to ${moveToEnd} (size ${spaceAvailable})`);
        for (let i = 0; i < spaceNeeded; i++) {
            // console.log(`    swapping ${blocks[moveToStart + i]} and ${blocks[moveFromStart + i]}`);
            const temp = blocks[moveToStart + i];
            blocks[moveToStart + i] = blocks[moveFromStart + i];
            blocks[moveFromStart + i] = temp;
        }
    }
    moveFromEnd = moveFromStart - 1;

    // console.log(blocks.join(''));
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
