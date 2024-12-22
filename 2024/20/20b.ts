
import { readFileSync } from 'fs';
import { exit } from 'process';
import { AStar, AStarNode, Manhattan } from '../../common/astar-algorithm';

const file = readFileSync('./20.test', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

let rStart = -1, cStart = -1, rEnd = -1, cEnd = -1;
for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === 'S') {
            [rStart, cStart] = [r, c];
        } else if (map[r][c] === 'E') {
            [rEnd, cEnd] = [r, c];
        }
    }
}

const astar = new AStar();

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '#') { continue; }

        const neighbors = [];
        if (r > 0 && map[r - 1][c] !== '#') { neighbors.push({ nameOfVertex: `${r - 1},${c}`, weight: 1 }); }
        if (r < map.length - 1 && map[r + 1][c] !== '#') { neighbors.push({ nameOfVertex: `${r + 1},${c}`, weight: 1 }); }
        if (c > 0 && map[r][c - 1] !== '#') { neighbors.push({ nameOfVertex: `${r},${c - 1}`, weight: 1 }); }
        if (c < map[0].length - 1 && map[r][c + 1] !== '#') { neighbors.push({ nameOfVertex: `${r},${c + 1}`, weight: 1 }); }

        astar.addNode(new AStarNode(`${r},${c}`, r, c, neighbors));
    }
}

const shortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
// console.log(`shortest path: ${shortestPath}`);
// console.log(`shortest path: ${shortestPath.map(x => x.name)}`);
// console.log(`shortest path has weight ${shortestPath.slice(-1)[0]}`);
const shortestTimeWithNoCheats: number = shortestPath.slice(-1)[0] as unknown as number;
console.log(shortestTimeWithNoCheats);

// To enable cheats, connect every wall to every open space within 20 spaces of it
const astarCheat = new AStar();

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '#') { continue; }

        const neighborsCheat = [];
        if (r > 0 && map[r - 1][c] !== '#') { neighborsCheat.push({ nameOfVertex: `${r - 1},${c}`, weight: 1 }); }
        if (r < map.length - 1 && map[r + 1][c] !== '#') { neighborsCheat.push({ nameOfVertex: `${r + 1},${c}`, weight: 1 }); }
        if (c > 0 && map[r][c - 1] !== '#') { neighborsCheat.push({ nameOfVertex: `${r},${c - 1}`, weight: 1 }); }
        if (c < map[0].length - 1 && map[r][c + 1] !== '#') { neighborsCheat.push({ nameOfVertex: `${r},${c + 1}`, weight: 1 }); }

        astarCheat.addNode(new AStarNode(`${r},${c}`, r, c, neighborsCheat));
    }
}

for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] !== '#') { continue; }

        const neighborsCheat = [];
        for (let r2 = 0; r2 < map.length; r2++) {
            for (let c2 = 0; c2 < map[0].length; c2++) {
                if (map[r2][c2] === '#') { continue; }

                if ((Math.abs(r2 - r) + Math.abs(c2 - c)) <= 2) {
                    neighborsCheat.push({ nameOfVertex: `${r2},${c2}`, weight: 1 });
                }
            }
        }
        astarCheat.addNode(new AStarNode(`${r},${c}`, r, c, neighborsCheat));

        const shortestPathWithCheats: AStarNode[] = astarCheat.findPath(astarCheat.findNode(`${rStart},${cStart}`), astarCheat.findNode(`${rEnd},${cEnd}`), Manhattan);
        const shortestTimeWithCheats = shortestPathWithCheats.slice(-1)[0] as unknown as number;
        const timeSavings = shortestTimeWithNoCheats - shortestTimeWithCheats;
        if (timeSavings > -1) {
            console.log(shortestPathWithCheats);
            console.log(`cheating took ${shortestTimeWithCheats}, saved ${timeSavings} picoseconds`);
            // console.log(`cheating betweeen [${r},${c}] and [${r2},${c2}] saved ${timeSavings} picoseconds`);
            // fasterTimesWithCheats++;
        }

        astarCheat.nodes.delete(`${r},${c}`);
    }
}


// let fasterTimesWithCheats = 0;
// const cheats: Set<string> = new Set<string>();

// for (let r = 1; r < map.length - 1; r++) {
//     console.log(r);
//     for (let c = 1; c < map[0].length - 1; c++) {
//         if (map[r][c] !== '#') { continue; }

//         for (let r2 = 1; r2 < map.length - 1; r2++) {
//             for (let c2 = 1; c2 < map[0].length - 1; c2++) {
//                 if (map[r2][c2] !== '#' && (Math.abs(r2 - r) + Math.abs(c2 - c)) <= 20) {
//                     if (cheats.has(`${r},${c},${r2},${c2}`) || cheats.has(`${r2},${c2},${r},${c}`)) { console.log(`skipping`); continue; }

//                     let rEarly = -1, cEarly = -1;
//                     for (let r3 = Math.min(r, r2); r3 <= Math.max(r, r2); r3++) {
//                         let finishEarly = false;

//                         for (let c3 = Math.min(c, c2); c3 <= Math.max(c, c2); c3++) {
//                             if (map[r3][c3] !== '#') {
//                                 finishEarly = true;
//                                 [rEarly, cEarly] = [r3, c3];
//                                 break;
//                             }
//                         }

//                         if (finishEarly) { break; }
//                     }

//                     if (rEarly !== -1) {
//                         if (cheats.has(`${r},${c},${rEarly},${cEarly}`) || cheats.has(`${rEarly},${cEarly},${r},${c}`)) { continue; }
//                     } else {
//                         [rEarly, cEarly] = [r2, c2];
//                     }

//                     // console.log(`cheating betweeen [${r},${c}] and [${r2},${c2}]`);
//                     cheats.add(`${r},${c},${rEarly},${c2}`);

//                     const clearedWalls: number[][] = [];
//                     for (let r3 = Math.min(r, rEarly); r3 <= Math.max(r, rEarly); r3++) {
//                         for (let c3 = Math.min(c, c2); c3 <= Math.max(c, c2); c3++) {
//                             if (map[r3][c3] === '#') {
//                                 map[r3][c3] = '.';
//                                 clearedWalls.push([r3, c3]);
//                             }
//                         }
//                     }

//                     const astar = new AStar();

//                     for (let r4 = 0; r4 < map.length; r4++) {
//                         for (let c4 = 0; c4 < map[0].length; c4++) {
//                             if (map[r4][c4] === '#') { continue; }

//                             const neighbors = [];
//                             if (r4 > 0 && map[r4 - 1][c4] !== '#') { neighbors.push({ nameOfVertex: `${r4 - 1},${c4}`, weight: 1 }); }
//                             if (r4 < map.length - 1 && map[r4 + 1][c4] !== '#') { neighbors.push({ nameOfVertex: `${r4 + 1},${c4}`, weight: 1 }); }
//                             if (c4 > 0 && map[r4][c4 - 1] !== '#') { neighbors.push({ nameOfVertex: `${r4},${c4 - 1}`, weight: 1 }); }
//                             if (c4 < map[0].length - 1 && map[r4][c4 + 1] !== '#') { neighbors.push({ nameOfVertex: `${r4},${c4 + 1}`, weight: 1 }); }

//                             astar.addNode(new AStarNode(`${r4},${c4}`, r4, c4, neighbors));
//                         }
//                     }

//                     const shortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
//                     const shortestTimeWithCheats = shortestPath.slice(-1)[0] as unknown as number;
//                     const timeSavings = shortestTimeWithNoCheats - shortestTimeWithCheats;
//                     if (timeSavings >= 74) {
//                         console.log(`cheating betweeen [${r},${c}] and [${r2},${c2}] saved ${timeSavings} picoseconds`);
//                         fasterTimesWithCheats++;
//                     }

//                     for (const cw of clearedWalls) {
//                         const [cr, cc] = cw;
//                         map[cr][cc] = '#';
//                     }
//                 }
//             }
//         }
//     }
// }

// console.log(fasterTimesWithCheats);
