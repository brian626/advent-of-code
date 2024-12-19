
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

const earliestTimestamp = parseInt(lines[0]);
const rawBusIDs: string[] = lines[1].split(',');

// console.log(busIDs);

const busIDs: number[] = [];
const busIndexes: Map<number, number> = new Map<number, number>();
const busDepartures: Map<number, number> = new Map<number, number>();

for (let i = 0; i < rawBusIDs.length; i++) {
    if (rawBusIDs[i] === 'x') { continue; }

    const id = parseInt(rawBusIDs[i]);
    busIDs.push(id);
    busIndexes.set(id, i);
    busDepartures.set(id, 0);
}


const HEADSTART = 103661669000126; // 100000000000000;
const busZeroTrips = Math.ceil(HEADSTART / busIDs[0]);
let busZeroHeadstart = busZeroTrips * busIDs[0];
while (busZeroHeadstart % busIDs[1] !== 0) {
    busZeroHeadstart += busIDs[0];
}
console.log(`initialized tZero to ${busZeroHeadstart} `);


let intersections: number[] = [];
let tZero = busZeroHeadstart;
while (true) {
    fillIntersections(tZero, busIDs[0], busIDs[1]);
    tZero = intersections[intersections.length - 1];

    for (let b = 2; b < busIDs.length; b++) {
        intersections = intersections.filter(x => (x + busIndexes.get(busIDs[b])) % busIDs[b] === 0);
        // console.log(`filtering for bus ${busIDs[b]}, there are ${intersections.length} times when all buses line up`);
        if (intersections.length === 0) {
            break;
        }
    }

    if (intersections.length === 1) {
        console.log(`there are ${intersections.length} times when all buses line up: ${intersections[0]}`);
        break;
    } else {
        console.log(`refilling from ${tZero}...`);
    }

    console.log();
}


function fillIntersections(tZero: number, interval0: number, interval1: number) {
    let bus0 = tZero
    let bus1 = Math.floor(tZero / interval1) * interval1;

    while (intersections.length < 500000) {
        if (bus1 === bus0 + 1) {
            // console.log(bus0, bus1);
            intersections.push(bus0);
        }
        bus0 += interval0;
        while (bus0 > bus1) {
            bus1 += interval1;
        }
    }
}

// const HEADSTART = 100000000000000;
// const busZeroTrips = Math.ceil(HEADSTART / busIDs[0]);
// const busZeroHeadstart = busZeroTrips * busIDs[0];
// busDepartures.set(busIDs[0], busZeroHeadstart);
// console.log(`initialized tZero to ${busZeroTrips} * ${busIDs[0]} `);

// for (const [id, d] of busDepartures) {
//     if (id === busIDs[0]) { continue; }
//     const busTrips = Math.ceil(HEADSTART / id);
//     let busHeadstart = busTrips * id;
//     while (busHeadstart < busZeroHeadstart) {
//         busHeadstart += id;
//     }

//     console.log(`initialized bus ${id} to ${busHeadstart} `);
//     busDepartures.set(id, busHeadstart);
// }

// // console.log(busDepartures);


// let iterations = 0;
// while (true) {
//     let tZero = busDepartures.get(busIDs[0]);

//     if (iterations % 1000000 === 0) {
//         console.log(tZero);
//     }
//     iterations++;

//     let matched = true;
//     for (let i = 1; i < busIDs.length; i++) {
//         if (busDepartures.get(busIDs[i]) !== tZero + busIndexes.get(busIDs[i])) {
//             matched = false;
//             break;
//         }
//     }

//     if (matched) {
//         break;
//     }

//     tZero += busIDs[0];
//     busDepartures.set(busIDs[0], tZero);
//     // console.log(`updated bus ${busIDs[0]} to ${tZero}`);
//     for (const [id, d] of busDepartures) {
//         if (id === busIDs[0]) { continue; }
//         while (busDepartures.get(id) < tZero) {
//             // console.log(`updated bus ${id} to ${busDepartures.get(id) + id}`);
//             busDepartures.set(id, busDepartures.get(id) + id);
//         }
//     }
// }

// console.log(busDepartures.get(busIDs[0]));

// // 100_012_903_000_011 is too low
