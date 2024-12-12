// --- Part Two ---

// You're worried that even with an optimal approach, the pressure released won't be enough. What if you got one of the elephants to help you?

// It would take you 4 minutes to teach an elephant how to open the right valves in the right order, leaving you with only 26 minutes to actually
// execute your plan. Would having two of you working together be better, even if it means having less time? (Assume that you teach the elephant
// before opening any valves yourself, giving you both the same full 26 minutes.)

// With you and an elephant working together for 26 minutes, what is the most pressure you could release?

import { readFileSync } from 'fs';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

class Actor {
    name: string;
    location: Valve;
    destination: Valve;
    path: Valve[];

    constructor(n: string, v: Valve) {
        this.name = n;
        this.location = this.destination = v;
        this.path = [];
    }
}

class Valve {
    name: string;
    flow: number;
    neighbors: Valve[];
    isOpen: boolean;
    costToOpen: number;
    neighborsString: string;

    constructor(n: string, f: number, s: string) {
        this.name = n;
        this.flow = f;
        this.neighborsString = s;
        this.neighbors = [];
        this.isOpen = (f === 0);
        this.costToOpen = 0;
    }

    isDeadEnd(): boolean {
        return this.neighbors.length === 1;
    }
}


const valves: Valve[] = [];
const re = new RegExp('Valve (\\w\\w) has flow rate=(\\d+); tunnel lead to valve (\\D*)');

for (let i = 0; i < lines.length; i++) {
    let scanLine = lines[i];
    if (scanLine.length === 0) { continue; }

    scanLine = scanLine.replace('tunnels', 'tunnel').replace('leads','lead').replace('valves','valve')
    const results = re.exec(scanLine);

    const v = new Valve(results[1], Number(results[2]), results[3]);
    valves.push(v);
}

for (let i = 0; i < valves.length; i++) {
    const neighborStrings = valves[i].neighborsString.split(', ');
    for (let j = 0; j < neighborStrings.length; j++) {
        const neighborValve = valves.filter(x => x.name === neighborStrings[j])[0];
        valves[i].neighbors.push(neighborValve);
    }
}

// console.log(valves);

let human: Actor = new Actor('Human', findValve('AA'));
let elephant: Actor = new Actor('Elephant', findValve('AA'));

let currentFlow = 0;
let pressureReleased = 0;
let minutesElapsed = 0;

while (minutesElapsed < 26) {
    minutesElapsed++;
    pressureReleased += currentFlow;
    console.log(`== Minute ${minutesElapsed} ==`);
    console.log(`${currentFlow} pressure is released`);

    let elephantOpenedValve = false;

    if (elephant.location && elephant.location === elephant.destination) {
        if (!elephant.location.isOpen) {
            console.log(`Elephant opens ${elephant.location.name}`);
            elephant.location.isOpen = true;
            currentFlow += elephant.location.flow;
            elephantOpenedValve = true;
        }

        scoreValves(elephant.location);
        elephant.destination = valves.filter(x => !x.isOpen).sort((x,y) => (y.flow / y.costToOpen) - (x.flow / x.costToOpen)).filter(x => x != human.destination)[0];
        console.log(`Elephant is heading to ${elephant.destination.name}`);

        if (elephant.destination) {
            elephant.path = findPath(elephant.location, elephant.destination);
            // console.log(`  via path ${elephant.path.map(x => x.name + ',')}`);
        }
    }

    if (!elephantOpenedValve) {
        elephant.location = elephant.path.shift();
        if (elephant.location) {
            console.log(`Elephant moves to ${elephant.location.name}`);
        }
    }

    let humanOpenedValve = false;

    if (human.location && human.location === human.destination) {
        if (!human.location.isOpen) {
            console.log(`Human opens ${human.location.name}`);
            human.location.isOpen = true;
            currentFlow += human.location.flow;
            humanOpenedValve = true;
        }

        scoreValves(human.location);
        human.destination = valves.filter(x => !x.isOpen).sort((x,y) => (y.flow / y.costToOpen) - (x.flow / x.costToOpen)).filter(x => x != elephant.destination)[0];
        console.log(`Human is heading to ${human.destination.name}`);

        if (human.destination) {
            human.path = findPath(human.location, human.destination);
            // console.log(`  via path ${human.path.map(x => x.name + ',')}`);
        }
    }

    if (!humanOpenedValve) {
        human.location = human.path.shift();
        if (human.location) {
            console.log(`Human moves to ${human.location.name}`);
        }
    }

    console.log(``);
}

console.log(pressureReleased);

function findValve(n: string): Valve {
    return valves.find(x => x.name === n);
}

function scoreValves(v: Valve) {
    for (let i = 0; i < valves.length; i++) { valves[i].costToOpen = 0; }
    v.costToOpen = 1;
    let valvesToScore: Valve[] = [v];

    while (valvesToScore.length > 0) {
        const valve = valvesToScore.shift();

        for (let j = 0; j < valve.neighbors.length; j++) {
            const neighbor = valve.neighbors[j];
            if (neighbor.costToOpen === 0) {
                neighbor.costToOpen = valve.costToOpen + 1;
                valvesToScore.push(neighbor);
            }
        }
    }
}

function findPath(l: Valve, d: Valve): Valve[] {
    // console.log(`finding path from ${l.name} to ${d.name}`);
    scoreValves(l);
    let path: Valve[] = [];
    let currentLocation = d;
    while (currentLocation != l) {
        let nextStep = currentLocation.neighbors.filter(x => x.costToOpen === currentLocation.costToOpen - 1)[0];
        path.unshift(nextStep);
        currentLocation = nextStep;
    }

    path.shift();
    path.push(d);

    return path;
}
