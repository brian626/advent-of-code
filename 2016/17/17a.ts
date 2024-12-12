
import { readFileSync } from 'fs';
import { exit } from 'process';
import * as crypto from 'crypto';
export const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest("hex");

const file = readFileSync('./17.input', 'utf-8');

const lines = file.split('\n');

let passcode = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    passcode = lines[i];
}

const encodedPaths: string[] = [`0,0,0`];
const completePaths: string[] = [];

while (encodedPaths.length > 0) {
    const encodedPath = encodedPaths.shift();
    const [x, y, p] = encodedPath.split(',');
    const xPos = parseInt(x);
    const yPos = parseInt(y);
    const path = (p === '0') ? '' : p;

    if (xPos === 3 && yPos === 3) {
        // console.log(`found a complete path: ${path}`);
        completePaths.push(path);
        break;
    }

    const openDoors = getOpenDoors(path);
    // console.log(path, openDoors);

    if (openDoors[0] && yPos > 0) {
        // console.log(`adding '${xPos},${yPos - 1},${path + 'U'}'`);
        encodedPaths.push(`${xPos},${yPos - 1},${path + 'U'}`);
    }
    if (openDoors[1] && yPos < 3) {
        // console.log(`adding '${xPos},${yPos + 1},${path + 'D'}'`);
        encodedPaths.push(`${xPos},${yPos + 1},${path + 'D'}`);
    }
    if (openDoors[2] && xPos > 0) {
        // console.log(`adding '${xPos - 1},${yPos},${path + 'L'}'`);
        encodedPaths.push(`${xPos - 1},${yPos},${path + 'L'}`);
    }
    if (openDoors[3] && xPos < 3) {
        // console.log(`adding '${xPos + 1},${yPos},${path + 'R'}'`);
        encodedPaths.push(`${xPos + 1},${yPos},${path + 'R'}`);
    }
}

console.log(completePaths);


function getOpenDoors(s: string): [boolean, boolean, boolean, boolean] {
    const hash = getShortHash(s);
    return [isOpenDoor(hash[0]), isOpenDoor(hash[1]), isOpenDoor(hash[2]), isOpenDoor(hash[3])];
}

function isOpenDoor(s: string): boolean {
    return s === 'b' || s === 'c' || s === 'd' || s === 'e' || s === 'f';
}

function getShortHash(s: string): string {
    return md5(passcode + s).slice(0, 4);
}
