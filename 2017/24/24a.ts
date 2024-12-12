
import { readFileSync } from 'fs';
import { exit } from 'process';

class Component {
    port1: number;
    port1InUse: boolean;
    port2: number;
    port2InUse: boolean;

    constructor(p1: number, p2: number) {
        this.port1 = p1;
        this.port2 = p2;
        this.port1InUse = false;
        this.port2InUse = false;
    }
}

const file = readFileSync('./24.test', 'utf-8');

const lines = file.split('\n');

// 0/2
// 2/2
// 2/3
// 3/4
// 3/5
// 0/1
// 10/1
// 9/10

const components: Component[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [p1, p2] = lines[i].split('/').map(x => parseInt(x));
    components.push(new Component(p1, p2));
}

// console.log(components);

const starts: Component[] = components.filter(x => (x.port1 === 0 || x.port2 === 0));
let bridges: Component[][] = [];
for (const s of starts) {
    if (s.port1 === 0) { s.port1InUse = true; }
    else if (s.port2 === 0) { s.port2InUse = true; }
    bridges.push([s]);
}

console.log(bridges);
printBridges();

let extendedBridge = false;

let q = 0;
do {
    q++;
    if (q > 100) { console.log(`safety`); break; }

    const b = bridges.shift();
    const bEnd = b[b.length - 1];
    console.log(`extending end of bridge:`);
    console.log(bEnd);
    if (bEnd.port1InUse) {
        bEnd.port2InUse = true;
        const nextComponents = components.filter(x => ((x.port1 === bEnd.port2) && !x.port1InUse) || ((x.port2 === bEnd.port2) && !x.port2InUse));
        console.log(`found ${nextComponents.length} matching components against port 2: ${bEnd.port2}`);
        for (const n of nextComponents) {
            if (n.port1 === bEnd.port2) { n.port1InUse = true; }
            else if (n.port2 === bEnd.port2) { n.port2InUse = true; }
            const newBridge: Component[] = b.concat(n);
            bridges.push(newBridge);
            extendedBridge = true;
        }
    } else if (bEnd.port2InUse) {
        bEnd.port1InUse = true;
        const nextComponents = components.filter(x => ((x.port1 === bEnd.port1) && !x.port1InUse) || ((x.port2 === bEnd.port1) && !x.port2InUse));
        console.log(`found ${nextComponents.length} matching components against port 1: ${bEnd.port2}`);
        for (const n of nextComponents) {
            if (n.port1 === bEnd.port1) { n.port1InUse = true; }
            else if (n.port2 === bEnd.port1) { n.port2InUse = true; }
            const newBridge: Component[] = b.concat(n);
            bridges.push(newBridge);
            extendedBridge = true;
        }
    } else {
        console.log('huh?');
    }

    if (!extendedBridge) { bridges.push(b); }

    printBridges();
} while (true);

// console.log(bridges);


function printBridges(): void {
    for (const b of bridges) {
        let s = '';
        for (const c of b) {
            s += `${c.port1}/${c.port2}--`;
        }
        console.log(s);
    }

    console.log();
}
