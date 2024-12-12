// --- Day 22: Monkey Map ---

// The monkeys take you on a surprisingly easy trail through the jungle. They're even going in roughly the right direction according to your
// handheld device's Grove Positioning System.

// As you walk, the monkeys explain that the grove is protected by a force field. To pass through the force field, you have to enter a password;
// doing so involves tracing a specific path on a strangely-shaped board.

// At least, you're pretty sure that's what you have to do; the elephants aren't exactly fluent in monkey.

// The monkeys give you notes that they took when they last saw the password entered (your puzzle input).

// The first half of the monkeys' notes is a map of the board. It is comprised of a set of open tiles (on which you can move, drawn .) and solid
// walls (tiles which you cannot enter, drawn #).

// The second half is a description of the path you must follow. It consists of alternating numbers and letters:

// A number indicates the number of tiles to move in the direction you are facing. If you run into a wall, you stop moving forward and continue with the next instruction.

// A letter indicates whether to turn 90 degrees clockwise (R) or counterclockwise (L). Turning happens in-place; it does not change your current tile.

// So, a path like 10R5 means "go forward 10 tiles, then turn clockwise 90 degrees, then go forward 5 tiles".

// You begin the path in the leftmost open tile of the top row of tiles. Initially, you are facing to the right (from the perspective of how the map is drawn).

// If a movement instruction would take you off of the map, you wrap around to the other side of the board. In other words, if your next tile is off of
// the board, you should instead look in the direction opposite of your current facing as far as you can until you find the opposite edge of the board, then reappear there.

// It is possible for the next tile (after wrapping around) to be a wall; this still counts as there being a wall in front of you, and so movement stops
// before you actually wrap to the other side of the board.

// To finish providing the password to this strange input device, you need to determine numbers for your final row, column, and facing as your final
// position appears from the perspective of the original map. Rows start from 1 at the top and count downward; columns start from 1 at the left and count
// rightward. Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^). The final password is the sum of 1000 times the row, 4 times the column, and the facing.

// Follow the path given in the monkeys' notes. What is the final password?

import { readFileSync } from 'fs';

const file = readFileSync('./22.input', 'utf-8');

const lines = file.split('\n');

let mapWidth = 0;
let mapMode = true;
let path = '';
for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        mapMode = false;
        continue;
    }

    if (mapMode) {
        mapWidth = Math.max(mapWidth, lines[i].length);
    } else {
        path = lines[i];
    }
}

const map: string[] = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        break;
    }

    map[i] = lines[i].padEnd(mapWidth, ' ');
}

// console.log(map);
// console.log(path);

let currentRow = 0;
let currentCol = 0;
for (let i = 0; i < mapWidth; i++) {
    if (map[0][i] != ' ') {
        currentCol = i;
        break;
    }
}

// console.log(currentRow);
// console.log(currentCol);
console.log(`${currentRow}, ${currentCol}`);
console.log(``);

// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
let facing = 0;

const pathRegEx1 = new RegExp('(\\d+)(\\D+)');
const pathRegEx2 = new RegExp('(\\d+)');
while (path.length > 0) {
    // console.log(`path is ${path}`);
    const results1 = pathRegEx1.exec(path);
    let distance = 0;
    let direction = '';
    if (results1) {
        distance = Number(results1[1]);
        direction = results1[2];

        path = path.slice(results1[1].length + results1[2].length);
    } else {
        const results2 = pathRegEx2.exec(path);

        distance = Number(results2[1]);
        direction = '';

        path = path.slice(results2[1].length);
    }

    console.log(`Go forward ${distance} tiles`);
    if (facing === 0) {
        console.log('  Moving right');
        let tempCol = -1;
        while (distance > 0) {
            let nextCol = currentCol + 1;
            if (nextCol >= mapWidth) { nextCol = 0; }
            const nextStep = map[currentRow][nextCol];
            console.log(`  Next step is ${nextStep}`);
            if (nextStep === '.') {
                if (tempCol != -1) { tempCol = -1; }
                currentCol = nextCol;
                distance--;
            } else if (nextStep === ' ') {
                if (tempCol === -1) { tempCol = currentCol; }
                currentCol = nextCol;
            } else if (nextStep === '#') {
                if (tempCol != -1) { currentCol = tempCol; }
                break;
            }
        }
    } else if (facing === 1) {
        console.log('  Moving down');
        let tempRow = -1;
        while (distance > 0) {
            let nextRow = currentRow + 1;
            if (nextRow >= map.length) { nextRow = 0; }
            const nextStep = map[nextRow][currentCol];
            console.log(`  Next step is ${nextStep}`);
            if (nextStep === '.') {
                if (tempRow != -1) { tempRow = -1; }
                currentRow = nextRow;
                distance--;
            } else if (nextStep === ' ') {
                if (tempRow === -1) { tempRow = currentRow; }
                currentRow = nextRow;
            } else if (nextStep === '#') {
                if (tempRow != -1) { currentRow = tempRow; }
                break;
            }
        }
    } else if (facing === 2) {
        console.log('  Moving left');
        let tempCol = -1;
        while (distance > 0) {
            let nextCol = currentCol - 1;
            if (nextCol < 0) { nextCol = mapWidth - 1; }
            const nextStep = map[currentRow][nextCol];
            console.log(`  Next step is ${nextStep}`);
            if (nextStep === '.') {
                if (tempCol != -1) { tempCol = -1; }
                currentCol = nextCol;
                distance--;
            } else if (nextStep === ' ') {
                if (tempCol === -1) { tempCol = currentCol; }
                currentCol = nextCol;
            } else if (nextStep === '#') {
                if (tempCol != -1) { currentCol = tempCol; }
                break;
            }
        }
    } else if (facing === 3) {
        console.log('  Moving up');
        let tempRow = -1;
        while (distance > 0) {
            let nextRow = currentRow - 1;
            if (nextRow < 0) { nextRow = map.length - 1; }
            const nextStep = map[nextRow][currentCol];
            console.log(`  Next step is ${nextStep}`);
            if (nextStep === '.') {
                if (tempRow != -1) { tempRow = -1; }
                currentRow = nextRow;
                distance--;
            } else if (nextStep === ' ') {
                if (tempRow === -1) { tempRow = currentRow; }
                currentRow = nextRow;
            } else if (nextStep === '#') {
                if (tempRow != -1) { currentRow = tempRow; }
                break;
            }
        }
    }

    if (direction.length > 0) {
        console.log(`Then turn ${direction}`);
        if (facing === 0) {
            if (direction === 'R') { facing = 1;}
            else                   { facing = 3; }
        } else if (facing === 1) {
            if (direction === 'R') { facing = 2;}
            else                   { facing = 0; }
        } else if (facing === 2) {
            if (direction === 'R') { facing = 3;}
            else                   { facing = 1; }
        } else if (facing === 3) {
            if (direction === 'R') { facing = 0;}
            else                   { facing = 2; }
        }

        console.log(`Now facing ${facing}`);
    }

    console.log(`${currentRow}, ${currentCol}`);
    console.log(``);
}

console.log((currentRow + 1) * 1000 + (currentCol + 1) * 4 + facing);
