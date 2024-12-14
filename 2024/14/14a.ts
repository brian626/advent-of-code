
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./14.input', 'utf-8');

const lines = file.split('\n');

class Robot {
    xPos: number;
    yPos: number;
    xVel: number;
    yVel: number;

    constructor(xPos, yPos, xVel, yVel) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = xVel;
        this.yVel = yVel;
    }

    move() {
        this.xPos += this.xVel;
        if (this.xPos < 0) {
            this.xPos += WIDTH;
        } else if (this.xPos > WIDTH - 1) {
            this.xPos -= WIDTH;
        }

        this.yPos += this.yVel;
        if (this.yPos < 0) {
            this.yPos += HEIGHT;
        } else if (this.yPos > HEIGHT - 1) {
            this.yPos -= HEIGHT;
        }
    }
}

const robots: Robot[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const matches = /p=([\d-]+),([\d-]+) v=([\d-]+),([\d-]+)/.exec(lines[i]);
    robots.push(new Robot(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])));
}

// console.log(robots[0]);

const WIDTH = 101;
const HEIGHT = 103;
const TIME = 100;

// printGrid();

for (let i = 0; i < TIME; i++) {
    for (let r = 0; r < robots.length; r++) {
        robots[r].move();
    }
}

// printGrid();

const quadCount: number[] = [0, 0, 0, 0];
for (let r = 0; r < robots.length; r++) {
    const robot = robots[r];
    const quad = quadrant(robot);
    if (quad !== -1) {
        // console.log(`robot at [${robot.yPos},${robot.xPos}] is in quadrant ${quadrant(robot)}`);
        quadCount[quadrant(robot)] += 1;
    }
}

console.log(quadCount);
console.log(quadCount.reduce((a, b) => a * b, 1));

function quadrant(r: Robot): number {
    if (r.xPos < Math.floor(WIDTH / 2) && r.yPos < Math.floor(HEIGHT / 2)) { return 0; }
    if (r.xPos > Math.floor(WIDTH / 2) && r.yPos < Math.floor(HEIGHT / 2)) { return 1; }
    if (r.xPos < Math.floor(WIDTH / 2) && r.yPos > Math.floor(HEIGHT / 2)) { return 2; }
    if (r.xPos > Math.floor(WIDTH / 2) && r.yPos > Math.floor(HEIGHT / 2)) { return 3; }
    return -1;
}


function printGrid() {
    for (let r = 0; r < HEIGHT; r++) {
        let row = '';
        for (let c = 0; c < WIDTH; c++) {
            let robotCount = 0;
            for (const robot of robots) {
                if (robot.xPos === c && robot.yPos === r) { robotCount++; }
            }
            row += robotCount === 0 ? '.' : robotCount.toString();
        }
        console.log(row);
    }
    console.log();
}
