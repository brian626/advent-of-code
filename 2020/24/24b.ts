
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.test', 'utf-8');

const lines = file.split('\n');

const SMALLNUM = Math.pow(2, 32) * -1;
const BIGNUM = Math.pow(2, 32);

let tiles: Map<string, number> = new Map<string, number>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [x, y, z] = parseMoves(lines[i]);
    let newValue = 1;
    if (tiles.has(`${x},${y},${z}`)) {
        newValue = tiles.get(`${x},${y},${z}`) === 0 ? 1 : 0;
    }
    tiles.set(`${x},${y},${z}`, newValue);
}

// console.log(tiles);

let count = 0;
// for (const [k, v] of tiles) {
//     if (v === 1) { count++; }
// }
// console.log(`Day 0: ${count}`);

const DAYS = 100;

for (let i = 0; i < DAYS; i++) {
    tiles = mutate();

    if (i < 10 || (i+1) % 10 === 0) {
        count = 0;
        for (const [k, v] of tiles) {
            if (v === 1) { count++; }
        }
        console.log(`Day ${i + 1}: ${count}`);
    }
}



function mutate(): Map<string, number> {
    const newTiles: Map<string, number> = new Map<string, number>();

    let minX = BIGNUM, minY = BIGNUM, minZ = BIGNUM;
    let maxX = SMALLNUM, maxY = SMALLNUM, maxZ = SMALLNUM;
    for (const [k, v] of tiles) {
        const [x, y, z] = k.split(',').map(x => parseInt(x));
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    }

    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let z = minZ - 1; z <= maxZ + 1; z++) {
                const v = getTile(x, y, z);
                newTiles.set(`${x},${y},${z}`, v);
                const numBlackNeighbors = countNeighbors(x, y, z);
                    // console.log(`tile ${x},${y},${z} is ${v === 1 ? 'black' : 'white'} and has ${numBlackNeighbors} black neighbors`);
                if (v === 1) {
                    if (numBlackNeighbors === 0 || numBlackNeighbors > 2) {
                        // console.log(`  flipping it to white`);
                        newTiles.set(`${x},${y},${z}`, 0);
                    }
                } else {
                    if (numBlackNeighbors === 2) {
                        // console.log(`  flipping it to black`);
                        newTiles.set(`${x},${y},${z}`, 1);
                    }
                }
            }
        }
    }

    return newTiles;
}


function countNeighbors(x: number, y: number, z: number): number {
    let count = 0;

    if (getTile(x + 1, y, z - 1) === 1) { count++; }
    if (getTile(x + 1, y - 1, z) === 1) { count++; }
    if (getTile(x, y - 1, z + 1) === 1) { count++; }
    if (getTile(x - 1, y, z + 1) === 1) { count++; }
    if (getTile(x - 1, y + 1, z) === 1) { count++; }
    if (getTile(x, y + 1, z - 1) === 1) { count++; }

    return count;
}


function getTile(x: number, y: number, z: number): number {
    return tiles.get(`${x},${y},${z}`) || 0;
}

function setTile(x: number, y: number, z: number, v: number) {
    return tiles.set(`${x},${y},${z}`, v);
}

function parseMoves(moves: string): [number, number, number] {
    let i = 0;
    let x = 0, y = 0, z = 0;
    while (i < moves.length) {
        let nextMove = moves[i];
        if (i < moves.length - 1) { nextMove += moves[i + 1]; }
        if (nextMove === 'ne' || nextMove === 'nw' || nextMove === 'se' || nextMove === 'sw') {
            switch (nextMove) {
                case 'ne': x += 1; z -= 1; break;
                case 'nw': y += 1; z -= 1; break;
                case 'se': y -= 1; z += 1; break;
                case 'sw': x -= 1; z += 1; break;
            }
            i += 2;
        } else {
            switch (nextMove[0]) {
                case 'w': x -= 1; y += 1; break;
                case 'e': x += 1; y -= 1; break;
            }
            i += 1;
        }
    }

    return [x, y, z];
}
