// --- Part Two ---

// Your handheld device indicates that the distress signal is coming from a beacon nearby. The distress beacon is
// not detected by any sensor, but the distress beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.

// To isolate the distress beacon's signal, you need to determine its tuning frequency, which can be found by multiplying
// its x coordinate by 4000000 and then adding its y coordinate.

// In the example above, the search space is smaller: instead, the x and y coordinates can each be at most 20. With this
// reduced search area, there is only a single position that could have a beacon: x=14, y=11. The tuning frequency for this
// distress beacon is 56000011.

// Find the only possible position for the distress beacon. What is its tuning frequency?

import { readFileSync } from 'fs';

const file = readFileSync('./15.test', 'utf-8');

const lines = file.split('\n');

// const GRID_SIZE = 20000000;
const GRID_SIZE = 75;
// const OFFSET = 2000000;
const OFFSET = 25;
// const MAGIC_ROW = 2000000;
const MAGIC_ROW = 10;

const grid: string[][] = [];
for (let i = 0; i < GRID_SIZE; i++) { grid[i] = []; }
// grid[MAGIC_ROW + OFFSET] = [];

for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
        grid[y][x] = '·';
    }
}

// for (let x = 0; x < GRID_SIZE; x++) {
//     grid[MAGIC_ROW + OFFSET][x] = '·';
// }


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
    // if (sensor.y === MAGIC_ROW) {
        grid[sensor.y + OFFSET][sensor.x + OFFSET] = 'S';
    // }
    // if (sensor.beaconY === MAGIC_ROW) {
        grid[sensor.beaconY + OFFSET][sensor.beaconX + OFFSET] = 'B';
    // }

    // if ((sensor.y - sensor.sensorRange <= MAGIC_ROW) && (sensor.y >= MAGIC_ROW)) {
        for (let y = sensor.y; y >= sensor.y - sensor.sensorRange; y--) {
            // if (y === MAGIC_ROW) {
                for (let x = sensor.x - sensor.sensorRange + (sensor.y - y); x <= sensor.x + sensor.sensorRange - (sensor.y - y); x++) {
                    if (grid[y + OFFSET][x + OFFSET] === '·') {
                        grid[y + OFFSET][x + OFFSET] = '#';
                    }
                }
            // }
        }
    // }

    // if ((sensor.y <= MAGIC_ROW) && (sensor.y + sensor.sensorRange >= MAGIC_ROW)) {
        for (let y = sensor.y; y <= sensor.y + sensor.sensorRange; y++) {
            // if (y === MAGIC_ROW) {
                for (let x = sensor.x - sensor.sensorRange - (sensor.y - y); x <= sensor.x + sensor.sensorRange + (sensor.y - y); x++) {
                    if (grid[y + OFFSET][x + OFFSET] === '·') {
                        grid[y + OFFSET][x + OFFSET] = '#';
                    }
                }
            // }
        }
    // }
}

printGrid();

for (let y = 0; y <= 20; y++) {
    for (let x = 0; x <= 20; x++) {
        if (grid[y + OFFSET][x + OFFSET] === '·') {
            console.log(x * 4000000 + y);
            break;
        }
    }
}

function printGrid() {
    for (let y = 0; y < GRID_SIZE; y++) {
        console.log(grid[y].join(''));
    }
    console.log(``);
}
