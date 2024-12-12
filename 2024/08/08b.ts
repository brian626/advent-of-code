
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./08.input', 'utf-8');

const lines = file.split('\n');

const grid: string[][] = [];
const antennas: Map<string, number[][]> = new Map<string, number[][]>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    grid[i] = lines[i].split('');
}

const HEIGHT = grid.length;
const WIDTH = grid[0].length;

for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
        if (/[A-Za-z\d]/.test(grid[r][c])) {
            const locations: number[][] = antennas.get(grid[r][c]) || [];
            locations.push([r, c]);
            antennas.set(grid[r][c], locations);
        }
    }
}

// console.log(antennas);

const antinodes: Set<string> = new Set<string>();

for (const [freq, locations] of antennas) {
    for (let i = 0; i < locations.length; i++) {
        for (let j = 0; j < locations.length; j++) {
            if (i === j) { continue; }
            const loc1 = locations[i];
            const loc2 = locations[j];
            const dist = getDistance(loc1, loc2);
            const slope = getSlope(loc1, loc2);

            for (let r = 0; r < HEIGHT; r++) {
                for (let c = 0; c < WIDTH; c++) {
                    if (getSlope(loc1, [r, c]) === slope) {
                        // // console.log(`[${r},${c}] is a possible antinode`);
                        // const dist2 = getDistance(loc1, [r, c]);
                        // const dist3 = getDistance(loc2, [r, c]);
                        // if (dist2 === 0 || dist3 === 0) { continue; }
                        // if ((dist2 === dist && dist3 === (dist * 2)) ||
                        //     (dist3 === dist && dist2 === (dist * 2))) {
                        //     console.log(`[${r},${c}] is an antinode of ${freq} antennas at [${loc1}] and [${loc2}]`);
                        //     console.log(`  dist: ${dist}, slope: ${slope}, dist2: ${dist2}, dist3: ${dist3}`);
                            antinodes.add(`${r},${c}`);
                        // }
                    }
                }
            }
        }
    }
}

printGrid();

console.log(antinodes.size);

function getSlope(loc1: number[], loc2: number[]): number {
    return (loc2[1] - loc1[1]) / (loc2[0] - loc1[0]);
}

function inline(loc1: number[], loc2: number[], loc3: number[]): boolean {
    const slope12 = (loc2[1] - loc1[1]) / (loc2[0] - loc1[0]);
    const slope13 = (loc3[1] - loc1[1]) / (loc3[0] - loc1[0]);
    return slope12 === slope13;
}

function getDistance(loc1: number[], loc2: number[]): number {
    // return (loc2[1] - loc1[1]) + (loc2[0] - loc1[0]);
    // d = √((x2 - x1)² + (y2 - y1)²)
    return Math.sqrt(Math.pow(loc2[0] - loc1[0], 2) + Math.pow(loc2[1] - loc1[1], 2));
}

function printGrid(): void {
    for (let r = 0; r < HEIGHT; r++) {
        let row = '';
        for (let c = 0; c < WIDTH; c++) {
            if (antinodes.has(`${r},${c}`) && grid[r][c] === '.') {
                row += '#';
            } else {
                row += grid[r][c];
            }
        }
        console.log(row);
    }
    console.log();
}
