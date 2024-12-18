// --- Part Two ---
// Maybe a fancy trick shot isn't the best idea; after all, you only have one probe, so you had better not miss.

// To get the best idea of what your options are for launching the probe, you need to find every initial velocity
// that causes the probe to eventually be within the target area after any step.

// In the above example, there are 112 different initial velocity values that meet these criteria:

// 23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
// 25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
// 8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
// 26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
// 20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
// 25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
// 25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
// 8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
// 24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
// 7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
// 23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
// 27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
// 8,-2    27,-8   30,-5   24,-7

// How many distinct initial velocity values cause the probe to be within the target area after any step?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let xMin = 0;
let xMax = 0;
let yMin = 0;
let yMax = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].split(' ');
    const xParts = parts[2].split('=')[1].split('.').filter(x => x.length > 0).map(x => parseInt(x));
    xMin = xParts[0];
    xMax = xParts[1];
    const yParts = parts[3].split('=')[1].split('.').filter(x => x.length > 0).map(x => parseInt(x));
    yMin = yParts[0];
    yMax = yParts[1];
}


let probeX = 0;
let probeY = 0;
let probeVelocityX = 0;
let probeVelocityY = 0;
let maxY = -999999;
let successfulRuns = 0;

for (let initialProbeVelocityX = 1; initialProbeVelocityX <= xMax; initialProbeVelocityX++) {
    for (let initialProbeVelocityY = -2000; initialProbeVelocityY < 2000; initialProbeVelocityY++) {
        console.log(`starting with velocityX ${initialProbeVelocityX} and velocityY ${initialProbeVelocityY}`);
        probeX = 0;
        probeY = 0;
        probeVelocityX = initialProbeVelocityX;
        probeVelocityY = initialProbeVelocityY;
        let maxYThisRun = -999999;

        while (!isProbeInTarget(probeX, probeY)) {
            probeX += probeVelocityX;
            probeY += probeVelocityY;
            // console.log(`${probeX}, ${probeY}`);
            if (isProbePastTarget(probeX, probeY)) {
                maxYThisRun = -999999;
                break;
            }
            maxYThisRun = Math.max(maxYThisRun, probeY);

            if (probeVelocityX > 0) { probeVelocityX -= 1; }
            else if (probeVelocityX < 0) { probeVelocityX += 1;}

            probeVelocityY -= 1;
        }

        // maxY = Math.max(maxY, maxYThisRun);
        if (maxYThisRun > -999999) {
            successfulRuns += 1;
        }
    }
}

console.log(successfulRuns);

function isProbeInTarget(probeX: number, probeY: number): boolean {
    return (probeX >= xMin && probeX <= xMax && probeY >= yMin && probeY <= yMax);
}

function isProbePastTarget(probeX: number, probeY: number): boolean {
    return (probeX > xMax || probeY < yMin);
}
