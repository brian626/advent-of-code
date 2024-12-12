
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./20.input', 'utf-8');

const lines = file.split('\n');

enum ModuleType { Button, Broadcaster, FlipFlop, Conjunction, None }

class Module {
    name: string;
    type: ModuleType;
    destinations: string[];
    flipFlopState: boolean;
    conjunctionMemory: Map<string, PulseType>;

    constructor(n: string, d: string) {
        if (n[0] === '%') {
            this.name = n.slice(1);
            this.type = ModuleType.FlipFlop;
        } else if (n[0] === '&') {
            this.name = n.slice(1);
            this.type = ModuleType.Conjunction;
        } else if (n === 'broadcaster') {
            this.name = n;
            this.type = ModuleType.Broadcaster;
        } else if (n === 'button') {
            this.name = n;
            this.type = ModuleType.Button;
        } else {
            this.name = n;
            this.type = ModuleType.None;
        }

        this.destinations = d.split(',').map(x => x.trim());

        this.flipFlopState = false;

        // for (const d of this.destinations) {
        //     this.conjunctionMemory[d] = PulseType.Low;
        // }
        this.conjunctionMemory = new Map<string, PulseType>();
    }
}

function findModule(n: string): Module {
    return modules.find(x => x.name === n);
}

enum PulseType { Low, High };

class Pulse {
    type: PulseType;
    source: Module;
    destination: Module;

    constructor(t: PulseType, s: string, d: string) {
        this.type = t;
        this.source = findModule(s);
        this.destination = findModule(d);
        // console.log(`pulse constructor(${t}, ${d})`);
        // console.log(this);
        // console.log();
    }
}

// Flip-flop modules (prefix %) are either on or off; they are initially off.
// If a flip-flop module receives a high pulse, it is ignored and nothing happens.
// However, if a flip-flop module receives a low pulse, it flips between on and off.
// If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.

// Conjunction modules (prefix &) remember the type of the most recent pulse received
// from each of their connected input modules; they initially default to remembering a
// low pulse for each input. When a pulse is received, the conjunction module first updates
// its memory for that input. Then, if it remembers high pulses for all inputs, it sends a
// low pulse; otherwise, it sends a high pulse.

// There is a single broadcast module (named broadcaster). When it receives a pulse, it
// sends the same pulse to all of its destination modules.

// The module configuration (your puzzle input) lists each module. The name of the module is
// preceded by a symbol identifying its type, if any. The name is then followed by an arrow
// and a list of its destination modules.

const modules: Module[] = [new Module('button', 'broadcaster')];
const pulses: Pulse[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [typeAndName, destinationList] = lines[i].split(' -> ');

    modules.push(new Module(typeAndName, destinationList));
}

// Make sure all destination modules are created
for (const m of modules) {
    for (const d of m.destinations) {
        const destinationModule = findModule(d);
        if (!destinationModule) {
            modules.push(new Module(d, ''));
        }
    }
}

// Hook up conjunction inputs
for (const m of modules) {
    for (const d of m.destinations) {
        const destinationModule = findModule(d);
        if (destinationModule.type === ModuleType.Conjunction) {
            destinationModule.conjunctionMemory.set(m.name, PulseType.Low);
        }
    }
}

// console.log(modules);

const BUTTON_PUSHES = 1000;
let lowPulses = 0;
let highPulses = 0;

for (let i = 0; i < BUTTON_PUSHES; i++) {
    lowPulses += 1;
    pulses.push(new Pulse(PulseType.Low, 'button', 'broadcaster'));

    while (pulses.length > 0) {
        const p = pulses.shift();
        console.log(`processing pulse: ${p.type === PulseType.High ? 'high' : 'low'} to ${p.destination.name}`);

        if (p.destination.type === ModuleType.FlipFlop) {
            if (p.type === PulseType.High) {
                console.log(`  high pulsed ignored by ${p.destination.name}`);
                continue;
            } else {
                if (p.destination.flipFlopState) {
                    for (const d of p.destination.destinations) {
                        console.log(`  ${p.destination.name} -low-> ${d}`);
                        lowPulses += 1;
                        pulses.push(new Pulse(PulseType.Low, p.destination.name, d));
                    }
                } else {
                    for (const d of p.destination.destinations) {
                        console.log(`  ${p.destination.name} -high-> ${d}`);
                        highPulses += 1;
                        pulses.push(new Pulse(PulseType.High, p.destination.name, d));
                    }
                }

                console.log(`  ${p.destination.name} flipping to ${!p.destination.flipFlopState}`);
                p.destination.flipFlopState = !p.destination.flipFlopState;
            }
        } else if (p.destination.type === ModuleType.Conjunction) {
            console.log(`  ${p.destination.name} setting input memory for ${p.source.name} to ${p.type === PulseType.High ? 'high' : 'low'}`);
            p.destination.conjunctionMemory.set(p.source.name, p.type);
            console.log(`  conjunction memory (length ${p.destination.conjunctionMemory.size}) ->>>`);
            console.log(p.destination.conjunctionMemory);
            if ([...p.destination.conjunctionMemory.values()].filter(x => x === PulseType.High).length === p.destination.conjunctionMemory.size) {
                console.log(`  sending low pulse because ${[...p.destination.conjunctionMemory.values()].filter(x => x === PulseType.High).length} === ${p.destination.conjunctionMemory.size}`);
                for (const d of p.destination.destinations) {
                    console.log(`  ${p.destination.name} -low-> ${d}`);
                    lowPulses += 1;
                    pulses.push(new Pulse(PulseType.Low, p.destination.name, d));
                }
            } else {
                console.log(`  sending highpulse because ${[...p.destination.conjunctionMemory.values()].filter(x => x === PulseType.High).length} !== ${p.destination.conjunctionMemory.size}`);
                for (const d of p.destination.destinations) {
                    console.log(`  ${p.destination.name} -high-> ${d}`);
                    highPulses += 1;
                    pulses.push(new Pulse(PulseType.High, p.destination.name, d));
                }
            }
        } else if (p.destination.type === ModuleType.Broadcaster) {
            for (const d of p.destination.destinations) {
                if (p.type === PulseType.Low) {
                    console.log(`  ${p.destination.name} -low-> ${d}`);
                    lowPulses += 1;
                    pulses.push(new Pulse(PulseType.Low, p.destination.name, d));
                } else {
                    console.log(`  ${p.destination.name} -high-> ${d}`);
                    highPulses += 1;
                    pulses.push(new Pulse(PulseType.High, p.destination.name, d));
                }
            }
        }
    }

    console.log();
}

console.log(`${lowPulses} * ${highPulses}`);
console.log(lowPulses * highPulses);
