
import { readFileSync } from 'fs';
import { exit } from 'process';

let DEBUG = false;

const file = readFileSync('./22.input', 'utf-8');

class Block {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
    name: string
    testDisintegration: boolean;
    z1_original: number;
    z2_original: number;

    constructor(s: string) {
        const [end1, end2] = s.split('~');
        const [x1, y1, z1] = end1.split(',').map(x => parseInt(x));
        const [x2, y2, z2] = end2.split(',').map(x => parseInt(x));

        if (z1 <= z2) {
            [this.x1, this.y1, this.z1] = [x1, y1, z1];
            [this.x2, this.y2, this.z2] = [x2, y2, z2];
        } else {
            [this.x1, this.y1, this.z1] = [x2, y2, z2];
            [this.x2, this.y2, this.z2] = [x1, y1, z1];
        }

        this.name = '';
        this.testDisintegration = false;
    }
}


const lines = file.split('\n');

const blocks: Block[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const block = new Block(lines[i]);
    block.name = `${i+1}`; // String.fromCharCode('A'.charCodeAt(0) + i);
    blocks.push(block);
}

blocks.sort((x, y) => Math.min(x.z1, x.z2) - Math.min(y.z1, y.z2));
// console.log(blocks.map(x => `${x.name}: (${x.x1},${x.y1},${x.z1}),(${x.x2},${x.y2},${x.z2})`));

// Simulate blocks falling
let blockMoved = true;

while (blockMoved) {
    blockMoved = false;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.z1 === 1 || block.z2 === 1) { continue; }

        if (!blockBelow(blocks, block)) {
            blockMoved = true;
            block.z1 -= 1;
            block.z2 -= 1;
        }
    }
}

for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    block.z1_original = block.z1;
    block.z2_original = block.z2;
}

console.log();
console.log(`blocks have fallen`);
console.log();
// console.log(blocks.map(x => `${x.name}: (${x.x1},${x.y1},${x.z1}),(${x.x2},${x.y2},${x.z2})`));

// Find blocks that cannot be disintegrated
DEBUG = false;
let unsafeBlockIndicies: number[] = [];
for (let i = 0; i < blocks.length; i++) {
    // console.log(`testing block ${blocks[i].name} for disintegrationability`);
    blocks[i].testDisintegration = true;

    let canBeDisintegrated = true;
    for (let j = i + 1; j < blocks.length; j++) {
        if (Math.min(blocks[j].z1, blocks[j].z2) !== Math.max(blocks[i].z1, blocks[i].z2) + 1) { continue; }

        if (!blockBelow(blocks, blocks[j])) {
            // console.log(`  ${blocks[j].name} is unsafe`);
            canBeDisintegrated = false;
            unsafeBlockIndicies.push(i);
            break;
        }
    }

    if (canBeDisintegrated) {
        // console.log(`  safe!`);
    }

    blocks[i].testDisintegration = false;
}

// console.log(unsafeBlockIndicies);
// console.log(unsafeBlockIndicies.map(x => blocks[x]).map(x => `${x.name}: (${x.x1},${x.y1},${x.z1}),(${x.x2},${x.y2},${x.z2})`));
console.log(`${unsafeBlockIndicies.length} blocks are unsafe to disintegrate`);
console.log();

// Count how many blocks would fall if we disintegrate all the unsafe blocks
// DEBUG = true;
let blocksThatWouldFall = 0;
// for (let i = 0; i < unsafeBlockIndicies.length; i++) {
for (let i = 0; i < blocks.length; i++) {
    const blockToDisintegrate = blocks[i];
    // const blockToDisintegrate = blocks[unsafeBlockIndicies[i]];
    console.log(`testing disintegration of block ${blocks[i].name}`);
    // console.log(`testing disintegration of block ${blocks[unsafeBlockIndicies[i]].name}`);
    blockToDisintegrate.testDisintegration = true;

    let blocksThatFell: Set<number> = new Set<number>();
    let blockMoved = true;
    while (blockMoved) {
        blockMoved = false;
        for (let j = i + 1; j < blocks.length; j++) {
        // for (let j = unsafeBlockIndicies[i] + 1; j < blocks.length; j++) {
            if (blocks[j].z1 === 1 || blocks[j].z2 === 1) { continue; }
            if (!blockBelow(blocks, blocks[j])) {
                // blocks[j].testDisintegration = true;
                blocks[j].z1 -= 1;
                blocks[j].z2 -= 1;
                // console.log(`block ${blocks[j].name} fell to ${blocks[j].z1}`);
                blocksThatFell.add(j);
                blockMoved = true;
            }
        }
    }
    blocksThatWouldFall += blocksThatFell.size;
    console.log(`  disintegrating block ${blocks[i].name} would cause ${blocksThatFell.size} blocks to fall (${blocksThatWouldFall} so far)`);
    // console.log(`  disintegrating block ${blocks[unsafeBlockIndicies[i]].name} would cause ${blocksThatFell.size} blocks to fall (${blocksThatWouldFall} so far)`);

    for (let j = 0; j < blocks.length; j++) {
        blocks[j].z1 = blocks[j].z1_original;
        blocks[j].z2 = blocks[j].z2_original;
        blocks[j].testDisintegration = false;
    }
}

console.log(blocksThatWouldFall);


function blockBelow(blocks: Block[], block: Block): boolean {
    let canMove = true;

    const lowerBlocks: Block[] = blocks.filter(x => Math.max(x.z1, x.z2) === Math.min(block.z1, block.z2) - 1).filter(x => !x.testDisintegration).reverse();
    if (lowerBlocks.length > 0) {
        for (const nextLowerBlock of lowerBlocks) {
            if (DEBUG) {
                console.log(`block that is next lower than block ${block.name}: ${nextLowerBlock.name}`);
            }

            const upperUnits: string[] = [];
            for (let x = Math.min(block.x1, block.x2); x <= Math.max(block.x1, block.x2); x++) {
                for (let y = Math.min(block.y1, block.y2); y <= Math.max(block.y1, block.y2); y++) {
                    upperUnits.push(`${x},${y}`);
                }
            }

            const lowerUnits: string[] = [];
            for (let x = Math.min(nextLowerBlock.x1, nextLowerBlock.x2); x <= Math.max(nextLowerBlock.x1, nextLowerBlock.x2); x++) {
                for (let y = Math.min(nextLowerBlock.y1, nextLowerBlock.y2); y <= Math.max(nextLowerBlock.y1, nextLowerBlock.y2); y++) {
                    lowerUnits.push(`${x},${y}`);
                }
            }

            for (const upperUnit of upperUnits) {
                if (lowerUnits.includes(upperUnit)) {
                    // console.log(`  found a conflict at ${upperUnit}`);
                    canMove = false;
                    break;
                }
            }

            // console.log();
        }
    }
    // else {
    //     console.log(`there are no lower blocks`);
    // }

    return !canMove;
}

// 68429 is too low
// 97013 is too high
