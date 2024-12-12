// --- Day 16: Proboscidea Volcanium ---

// The sensors have led you to the origin of the distress signal: yet another handheld device, just like the one the Elves
// gave you. However, you don't see any Elves around; instead, the device is surrounded by elephants! They must have gotten
// lost in these tunnels, and one of the elephants apparently figured out how to turn on the distress signal.

// The ground rumbles again, much stronger this time. What kind of cave is this, exactly? You scan the cave with your
// handheld device; it reports mostly igneous rock, some ash, pockets of pressurized gas, magma... this isn't just a cave, it's a volcano!

// You need to get the elephants out of here, quickly. Your device estimates that you have 30 minutes before the volcano
// erupts, so you don't have time to go back out the way you came in.

// You scan the cave for other options and discover a network of pipes and pressure-release valves. You aren't sure how such a
// system got into a volcano, but you don't have time to complain; your device produces a report (your puzzle input) of each
// valve's flow rate if it were opened (in pressure per minute) and the tunnels you could use to move between the valves.

// There's even a valve in the room you and the elephants are currently standing in labeled AA. You estimate it will take you
// one minute to open a single valve and one minute to follow any tunnel from one valve to another. What is the most pressure you could release?

// All of the valves begin closed. You start at valve AA, but it must be damaged or jammed or something: its flow rate is 0,
// so there's no point in opening it. However, you could spend one minute moving to valve BB and another minute opening it;
// doing so would release pressure during the remaining 28 minutes at a flow rate of 13, a total eventual pressure release
// of 28 * 13 = 364. Then, you could spend your third minute moving to valve CC and your fourth minute opening it, providing
// an additional 26 minutes of eventual pressure release at a flow rate of 2, or 52 total pressure released by valve CC.

// Making your way through the tunnels like this, you could probably open many or all of the valves by the time 30 minutes
// have elapsed. However, you need to release as much pressure as possible, so you'll need to be methodical. Instead, consider this approach:

// Work out the steps to release the most pressure in 30 minutes. What is the most pressure you can release?

import { readFileSync } from 'fs';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

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
        this.isOpen = false;
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

let totalFlowRate = 0;
let minutesElapsed = 1;
let pressureReleased = 0;
let currentValve = valves[0];

while (minutesElapsed < 30) {
    resetValves();
    const nextValve = calculateNextValve(currentValve);

    if (nextValve) {
        for (let i = nextValve.costToOpen; i > 0; i--) {
            console.log(`A: minute ${minutesElapsed}: ${totalFlowRate} pressure released`);
            minutesElapsed++;
            pressureReleased += totalFlowRate;
        }

        nextValve.isOpen = true;
        totalFlowRate += nextValve.flow;
    }

    console.log(`B: minute ${minutesElapsed}: ${totalFlowRate} pressure released`);
    minutesElapsed++;
    pressureReleased += totalFlowRate;

    currentValve = nextValve;
}

console.log(pressureReleased);


function resetValves() {
    for (let i = 0; i < valves.length; i++) {
        valves[i].costToOpen = 0;
    }
}

function calculateNextValve(v: Valve): Valve {
    if (!v) { return null; }

    // console.log(`finding next valve starting from ${v.name}`);

    let valvesToVisit = [v];
    let costSoFar = 1;
    while (valvesToVisit.length > 0) {
        // console.log(`  valves to visit: ${valvesToVisit.map(x => x.name)}`);

        let newValvesToVisit: Valve[] = [];

        for (let i = 0; i < valvesToVisit.length; i++) {
            const curValve = valvesToVisit[i];
            if (curValve.costToOpen === 0) {
                // console.log(`  setting cost of valve ${curValve.name} to ${costSoFar}`);
                curValve.costToOpen = costSoFar;
            }

            newValvesToVisit.push(...curValve.neighbors.filter(x => x.costToOpen === 0));
        }

        costSoFar++;
        valvesToVisit = newValvesToVisit;
    }

    // console.log(`  done setting costs`);

    let nextValve: Valve = null;
    let highestValveValue = 0;

    for (let i = 0; i < valves.length; i++) {
        const curValve = valves[i];
        let curValveValue = curValve.flow / curValve.costToOpen;
        if (curValve.isDeadEnd()) {
            curValveValue /= 10;
        }

        if (!curValve.isOpen && (curValveValue > highestValveValue)) {
            nextValve = curValve;
            highestValveValue = curValveValue;
        }
    }

    if (nextValve) {
        console.log(`  returning valve ${nextValve.name} with value ${highestValveValue} and cost to open ${nextValve.costToOpen}`);
    } else {
        console.log(`  no next valve`);
    }

    return nextValve;
}

// 1981 is too high
