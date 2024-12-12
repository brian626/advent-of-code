
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

class Stone {
    value: number;
    next: Stone;

    constructor(value: number) {
        this.value = value;
        this.next = null;
    }
}

const blinkedStonesCache25: Map<number, number> = new Map<number, number>();
const blinkedStonesCache50: Map<number, number> = new Map<number, number>();

// for (let i = 0; i < 100; i++) {
//     let blinkedStones: number[] = blink(i, 25);
//     blinkedStonesCache.set(i, blinkedStones.length);
//     for (const b of blinkedStones) {
//         // console.log(i, b);
//         if (!blinkedStonesCache.has(b)) {
//             blinkedStones = blink(b, 25);
//             blinkedStonesCache.set(b, blinkedStones.length);
//         }
//     }
// }

// console.log(blinkedStonesCache);



let stones: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    stones = lines[i].split(' ').map(x => parseInt(x));
}


let totalStones75 = 0;
for (let i = 0; i < stones.length; i++) {
    // console.log(i);
    const blinkedStones1 = blink(stones[i], 25);
    if (!blinkedStonesCache25.has(stones[i])) {
        blinkedStonesCache25.set(stones[i], blinkedStones1.length);
    }

    for (let j = 0; j < blinkedStones1.length; j++) {
        console.log(i, j);
        if (blinkedStonesCache50.has(blinkedStones1[j])) {
            totalStones75 += blinkedStonesCache50.get(blinkedStones1[j]);
        } else {
            const blinkedStones2 = blink(blinkedStones1[j], 25);
            if (!blinkedStonesCache25.has(blinkedStones1[j])) {
                blinkedStonesCache25.set(blinkedStones1[j], blinkedStones2.length);
            }

            let totalStones50 = 0;
            for (let k = 0; k < blinkedStones2.length; k++) {
                // console.log(i, j, k);
                if (!blinkedStonesCache25.has(blinkedStones2[k])) {
                    const blinkedStones3 = blink(blinkedStones2[k], 25);
                    blinkedStonesCache25.set(blinkedStones2[k], blinkedStones3.length);
                }
                totalStones75 += blinkedStonesCache25.get(blinkedStones2[k]);
                totalStones50 += blinkedStonesCache25.get(blinkedStones2[k]);
            }
            blinkedStonesCache50.set(blinkedStones1[j], totalStones50);
        }
    }
}

console.log(totalStones75);

// while (blinkedStones.length > 0) {
//     // console.log(blinkedStones.length);
//     const s = blinkedStones.shift();
//     if (!blinkedStonesCache.has(s)) {
//         const newBlinkedStones = blink(s, 5);
//         blinkedStonesCache.set(s, newBlinkedStones.length);
//     }
// }

// // console.log(blinkedStonesCache);

// blinkedStones = blink(stone, 15);
// let total = 0; // blinkedStones.length;
// for (const s of blinkedStones) {
//     total += blinkedStonesCache.get(s);
// }

// console.log(total);

function blink(stone: number, blinks: number): number[] {
    let headStone: Stone = new Stone(stone);
    let stonePtr = headStone;
    // for (let i = 1; i < stones.length; i++) {
    //     const newStone: Stone = new Stone(stones[i]);
    //     stonePtr.next = newStone;
    //     stonePtr = newStone;
    // }

    // console.log(`Initial arrangement:`);
    // let out = '';
    // stonePtr = headStone;
    // while (stonePtr) {
    //     out += stonePtr.value + ' ';
    //     stonePtr = stonePtr.next;
    // }
    // console.log(out);
    // console.log();

    let numStones = 1;

    // let s = '';
    for (let i = 0; i < blinks; i++) {
        stonePtr = headStone;
        while (stonePtr) {
            if (stonePtr.value === 0) {
                stonePtr.value = 1;
            } else if (stonePtr.value.toString().length % 2 === 0) {
                const stoneStr = stonePtr.value.toString();
                const newStone1 = parseInt(stoneStr.slice(0, stoneStr.length / 2));
                const newStone2 = parseInt(stoneStr.slice(stoneStr.length / 2));
                stonePtr.value = newStone1;
                const ns = new Stone(newStone2);
                const temp = stonePtr.next;
                stonePtr.next = ns;
                ns.next = temp;
                stonePtr = ns;
                numStones++;
            } else {
                stonePtr.value *= 2024;
            }

            stonePtr = stonePtr.next;
        }

        // console.log(`After ${i + 1} blinks:`);
        // console.log(`  There are ${numStones} stones.`);
        // console.log();

        // s += numStones + ',';
    }

    // console.log(s.slice(0, -1));
    // console.log();

    // console.log(s.slice(0, -1).split(', ').map(x => Math.log10(parseInt(x))));

    const newStones: number[] = [];
    stonePtr = headStone;
    while (stonePtr) {
        newStones.push(stonePtr.value);
        stonePtr = stonePtr.next;
    }

    return newStones;
}


// 20,037,071,607,900 is too low
