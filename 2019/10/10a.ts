
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.test', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map.push(lines[i].split(''));
}

console.log(map);

let maxAsteroids = 0;

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '#') {
            let asteroidsDetected = 0;
            let slopes: Set<number> = new Set<number>();

            for (let r2 = 0; r2 < map.length; r2++) {
                for (let c2 = 0; c2 < map[0].length; c2++) {
                    if ((r === r2) && (c === c2)) { continue; }

                    if (map[r2][c2] === '#') {
                        const slope = (r2 - r) / (c2 - c);
                        if (r === 2 && c === 2) {
                            console.log(`  asteroid at ${c2},${r2} has slope ${slope}`);
                        }
                        if (!slopes.has(slope)) {
                            asteroidsDetected += 1;
                            slopes.add(slope);
                        }
                    }
                }
            }

            console.log(`asteroid at ${c},${r} can see ${asteroidsDetected} asteroids\n`);
            // console.log(slopes);
            maxAsteroids = Math.max(maxAsteroids, asteroidsDetected);
        }
    }
}

console.log(maxAsteroids);
