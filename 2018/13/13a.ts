
import { readFileSync } from 'fs';
import { exit } from 'process';

const DEBUG = false;

const file = readFileSync('./13.input', 'utf-8');

const lines = file.split('\n');

const track: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    track[i] = lines[i].split('');
}

class Cart {
    x: number;
    y: number;
    facing: string;
    nextTurn: number; // 0: left, 1: straight, 2: right

    constructor(x: number, y: number, f: string) {
        this.x = x;
        this.y = y;
        this.facing = f;
        this.nextTurn = 0;
    }
}

let carts: Cart[] = [];

let trackWidth = 0;
let trackHeight = 0;

for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
        trackWidth = Math.max(track[y].length, trackWidth);
        if (isCart(track[y][x])) {
            carts.push(new Cart(x, y, track[y][x]));
            if (track[y][x] === '>' || track[y][x] === '<') {
                track[y][x] = '-';
            } else {
                track[y][x] = '|';
            }
        }
    }
}

trackHeight = track.length;

while (true) {
    carts.sort((a, b) => {
        if (a.y === b.y) { return a.x - b.x; }
        else { return a.y - b.y; }
    });

    // Move carts
    for (const cart of carts) {
        debug(`cart starting at [${cart.x},${cart.y}] with facing '${cart.facing}'`);
        if      (cart.facing === '>') { cart.x += 1; }
        else if (cart.facing === '<') { cart.x -= 1; }
        else if (cart.facing === '^') { cart.y -= 1; }
        else if (cart.facing === 'v') { cart.y += 1; }
        debug(`cart moved to [${cart.x},${cart.y}]`);

        if (cart.x < 0 || cart.x >= trackWidth || cart.y < 0 || cart.y >= trackHeight) {
            console.log(`CART WENT OFF THE TRACK?!?!?`);
            console.log(trackWidth, trackHeight);
            console.log(cart);

            for (let r = 0; r < track.length; r++) {
                debug(track[r].join(''));
            }

            exit();
        }

        const newSpace = track[cart.y][cart.x];
        debug(`cart's new space is '${newSpace}'`);
        if (newSpace === '/') {
            if      (cart.facing === '>') { debug(`cart now facing up`); cart.facing = '^'; }
            else if (cart.facing === '<') { debug(`cart now facing down`); cart.facing = 'v'; }
            else if (cart.facing === '^') { debug(`cart now facing right`); cart.facing = '>'; }
            else if (cart.facing === 'v') { debug(`cart now facing left`); cart.facing = '<'; }
        } else if (newSpace === '\\') {
            if      (cart.facing === '>') { debug(`cart now facing down`); cart.facing = 'v'; }
            else if (cart.facing === '<') { debug(`cart now facing up`); cart.facing = '^'; }
            else if (cart.facing === '^') { debug(`cart now facing left`); cart.facing = '<'; }
            else if (cart.facing === 'v') { debug(`cart now facing right`); cart.facing = '>'; }
        } else if (newSpace === '+') {
            if (cart.nextTurn === 0) {
                if      (cart.facing === '>') { debug(`cart turning left, now facing up`); cart.facing = '^'; }
                else if (cart.facing === '<') { debug(`cart turning left, now facing down`); cart.facing = 'v'; }
                else if (cart.facing === '^') { debug(`cart turning left, now facing left`); cart.facing = '<'; }
                else if (cart.facing === 'v') { debug(`cart turning left, now facing right`); cart.facing = '>'; }

                cart.nextTurn++;
            } else if (cart.nextTurn === 1) {
                debug(`cart going straight`);
                cart.nextTurn++;
            } else if (cart.nextTurn === 2) {
                if      (cart.facing === '>') { debug(`cart turning right, now facing down`); cart.facing = 'v'; }
                else if (cart.facing === '<') { debug(`cart turning right, now facing up`); cart.facing = '^'; }
                else if (cart.facing === '^') { debug(`cart turning right, now facing right`); cart.facing = '>'; }
                else if (cart.facing === 'v') { debug(`cart turning right, now facing left`); cart.facing = '<'; }

                cart.nextTurn = 0;
            }
        }

        // Check for collisions
        for (let i = 0; i < carts.length; i++) {
            for (let j = 0; j < carts.length; j++) {
                if (i === j) { continue; }

                if (carts[i].y === carts[j].y && carts[i].x === carts[j].x) {
                    console.log(`collision at [${carts[i].x},${carts[i].y}]`);
                    exit();
                }
            }
        }
    }

    debug('');
}

// for (let r = 0; r < track.length; r++) {
//     console.log(track[r].join(''));
// }


function isCart(c: string): boolean {
    return c === '^' || c === 'v' || c === '>' || c === '<';
}

function debug(s: string): void {
    if (DEBUG) {
        console.log(s);
    }
}

// 90,16 is wrong
