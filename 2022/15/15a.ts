// --- Day 15: Beacon Exclusion Zone ---

// You feel the ground rumble again as the distress signal leads you to a large network of subterranean tunnels.
// You don't have time to search them all, but you don't need to: your pack contains a set of deployable sensors
// that you imagine were originally built to locate lost Elves.

// The sensors aren't very powerful, but that's okay; your handheld device indicates that you're close enough to
// the source of the distress signal to use them. You pull the emergency sensor system out of your pack, hit the big
// button on top, and the sensors zoom off down the tunnels.

// Once a sensor finds a spot it thinks will give it a good reading, it attaches itself to a hard surface and begins
// monitoring for the nearest signal source beacon. Sensors and beacons always exist at integer coordinates. Each sensor
// knows its own position and can determine the position of a beacon precisely; however, sensors can only lock on to the
// one beacon closest to the sensor as measured by the Manhattan distance. (There is never a tie where two beacons are the
// same distance to a sensor.)

// It doesn't take long for the sensors to report back their positions and closest beacons (your puzzle input). For example:

// None of the detected beacons seem to be producing the distress signal, so you'll need to work out where the distress beacon
// is by working out where it isn't. For now, keep things simple by counting the positions where a beacon cannot possibly be
// along just a single row.

// So, suppose you have an arrangement of beacons and sensors like in the example above and, just in the row where y=10, you'd
// like to count the number of positions a beacon cannot possibly exist. The coverage from all sensors near that row looks like this:

// In this example, in the row where y=10, there are 26 positions where a beacon cannot be present.

// Consult the report from the sensors you just deployed. In the row where y=2000000, how many positions cannot contain a beacon?


import { readFileSync } from 'fs';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

const GRID_SIZE = 20000000;
// const GRID_SIZE = 75;
const OFFSET = 2000000;
// const OFFSET = 25;
const MAGIC_ROW = 2000000;
// const MAGIC_ROW = 10;

const grid: string[][] = [];
// for (let i = 0; i < GRID_SIZE; i++) { grid[i] = []; }
grid[MAGIC_ROW + OFFSET] = [];

// for (let y = 0; y < GRID_SIZE; y++) {
//     for (let x = 0; x < GRID_SIZE; x++) {
//         grid[y][x] = '·';
//     }
// }

for (let x = 0; x < GRID_SIZE; x++) {
    grid[MAGIC_ROW + OFFSET][x] = '·';
}


const re = new RegExp('Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.+)');

class Sensor {
    x: number;
    y: number;
    beaconX: number;
    beaconY: number;
    sensorRange: number;

    constructor(x: number, y: number, bx: number, by: number) {
        this.x = x;
        this.y = y;
        this.beaconX = bx;
        this.beaconY = by;
        this.sensorRange = Math.abs(x - bx) + Math.abs(y - by);
    }
}

const sensors: Sensor[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const results = re.exec(lines[i]);
    // console.log(lines[i]);
    // console.log(results);

    sensors.push(new Sensor(Number(results[1]), Number(results[2]), Number(results[3]), Number(results[4])));
}

// console.log(sensors);

for (let i = 0; i < sensors.length; i++) {
    console.log(i);
    const sensor = sensors[i];
    if (sensor.y === MAGIC_ROW) {
        grid[sensor.y + OFFSET][sensor.x + OFFSET] = 'S';
    }
    if (sensor.beaconY === MAGIC_ROW) {
        grid[sensor.beaconY + OFFSET][sensor.beaconX + OFFSET] = 'B';
    }

    if ((sensor.y - sensor.sensorRange <= MAGIC_ROW) && (sensor.y >= MAGIC_ROW)) {
        for (let y = sensor.y; y >= sensor.y - sensor.sensorRange; y--) {
            if (y === MAGIC_ROW) {
                for (let x = sensor.x - sensor.sensorRange + (sensor.y - y); x <= sensor.x + sensor.sensorRange - (sensor.y - y); x++) {
                    if (grid[y + OFFSET][x + OFFSET] === '·') {
                        grid[y + OFFSET][x + OFFSET] = '#';
                    }
                }
            }
        }
    }

    if ((sensor.y <= MAGIC_ROW) && (sensor.y + sensor.sensorRange >= MAGIC_ROW)) {
        for (let y = sensor.y; y <= sensor.y + sensor.sensorRange; y++) {
            if (y === MAGIC_ROW) {
                for (let x = sensor.x - sensor.sensorRange - (sensor.y - y); x <= sensor.x + sensor.sensorRange + (sensor.y - y); x++) {
                    if (grid[y + OFFSET][x + OFFSET] === '·') {
                        grid[y + OFFSET][x + OFFSET] = '#';
                    }
                }
            }
        }
    }
}

// printGrid();

console.log(grid[MAGIC_ROW + OFFSET].filter(x => (x != '·' && x != 'B')).length);

function printGrid() {
    for (let y = 0; y < GRID_SIZE; y++) {
        console.log(grid[y].join(''));
    }
    console.log(``);
}

// 4737112 is too low
//  4886370
