
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

const tiles: Map<string, number> = new Map<string, number>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [x, y, z] = parseMoves(lines[i]);
    let newValue = 1;
    if (tiles.has(`${x},${y},${z}`)) {
        newValue = tiles.get(`${x},${y},${z}`) === 0 ? 1 : 0;
    }
    tiles.set(`${x},${y},${z}`, newValue);
}

console.log(tiles);
let count = 0;
for (const [k, v] of tiles) {
    if (v === 1) { count++; }
}
console.log(count);

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
