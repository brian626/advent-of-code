
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

class Component {
    port1: number;
    port2: number;

    constructor(c: string = '') {
        if (c) {
            [this.port1, this.port2] = c.split('/').map(x => parseInt(x));
        } else {
            this.port1 = -1;
            this.port2 = -1;
        }
    }

    print(): string {
        return `${this.port1}/${this.port2}`;
    }
}

const components: Component[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    components.push(new Component(lines[i]));
}

// console.log(components);

class Bridge {
    components: Component[];

    constructor() {
        this.components = [];
    }

    addComponent(c: Component) {
        const [newPort1, newPort2] = [c.port1, c.port2];

        const lastComponent = this.components.slice(-1)[0];
        const newComp = new Component();
        newComp.port1 = newPort1;
        newComp.port2 = newPort2;

        if (this.components.length === 0) {
            // newComp.port1 = newPort1;
            // newComp.port2 = newPort2;
        } else if (this.components.length === 1) {
            const lastPort2 = lastComponent.port1 === 0 ? lastComponent.port2 : lastComponent.port1;
            if (newPort1 === lastPort2) {
                // newComp.port1 = newPort1;
                // newComp.port2 = newPort2;
            } else {
                newComp.port1 = newPort2;
                newComp.port2 = newPort1;
            }
        } else {
            const lastPort2 = lastComponent.port2;
            if (newPort1 === lastPort2) {
                // newComp.port1 = newPort1;
                // newComp.port2 = newPort2;
            } else {
                newComp.port1 = newPort2;
                newComp.port2 = newPort1;
            }
        }

        this.components.push(newComp);
    }

    getLastPort(): number {
        return this.components.slice(-1)[0].port2;
    }

    toString(): string {
        let s = '';
        for (let i = 0; i < this.components.length; i++) {
            const c = this.components[i];
            s += `${c.port1}/${c.port2}`;
            if (i < this.components.length - 1) {
                s += '--';
            }
        }
        return s;
    }

    duplicate(): Bridge {
        const newBridge = new Bridge();
        for (const c of this.components) {
            newBridge.addComponent(c);
        }
        return newBridge;
    }

    hasComponent(c: Component): boolean {
        for (const comp of this.components) {
            if ((c.port1 === comp.port1 && c.port2 === comp.port2) ||
                (c.port2 === comp.port1 && c.port1 === comp.port2)) {
                return true;
            }
        }
        return false;
    }

    getStrength(): number {
        let strength = 0;
        for (const c of this.components) {
            strength += c.port1;
            strength += c.port2;
        }
        return strength;
    }

    getLength(): number {
        return this.components.length;
    }
}

const bridges: Bridge[] = [];

for (const c of components) {
    if (c.port1 === 0 || c.port2 === 0) {
        const b = new Bridge;
        b.addComponent(c);
        bridges.push(b);
    }
}

// console.log(bridges.map(x => x.toString()));

const completedBridges: Bridge[] = [];

let iterations = 0;
while (bridges.length > 0) {
    iterations++;
    // if (iterations > 500000) { console.log(`SAFETY!`); break; }

    const b = bridges.shift();
    // console.log(`Considering bridge ${b.toString()} (${bridges.length} in progress, ${completedBridges.length} completed)`);
    if (iterations % 5000 === 0) {
        console.log(`${bridges.length} in progress, ${completedBridges.length} completed`);
    }

    const connections = components.filter(x => x.port1 === b.getLastPort() || x.port2 === b.getLastPort());
    let extendedBridge = false;

    for (const c of connections) {
        if (!b.hasComponent(c)) {
            // console.log(`  It's possible to add component ${c.port1}/${c.port2} to bridge ${b.toString()}`);
            const newBridge = b.duplicate();
            newBridge.addComponent(c);
            bridges.push(newBridge);
            extendedBridge = true;
        } else {
            // console.log(`  It's NOT possible to add component ${c.port1}/${c.port2} to bridge ${b.toString()}`);
        }
    }

    if (!extendedBridge) { completedBridges.push(b); }

    // console.log();
}

// console.log(completedBridges.map(x => x.toString()));

let maxLength = 0;
for (const b of completedBridges) {
    maxLength = Math.max(b.getLength(), maxLength);
}
// console.log(maxLength);

const longestBridges: Bridge[] = completedBridges.filter(x => x.getLength() === maxLength);
console.log(longestBridges.map(x => x.toString()));
console.log(Math.max(...longestBridges.map(x => x.getStrength())));
// for (const b of longestBridges) {
//     console.log(b.getStrength());
// }
