
import { readFileSync } from 'fs';
import { exit } from 'process';
import { AStar, AStarNode, Manhattan } from '../../common/astar-algorithm';

const file = readFileSync('./20.input', 'utf-8');

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

let fasterTimesWithCheats = 0;

for (let r = 1; r < map.length - 1; r++) {
    console.log(r);
    for (let c = 1; c < map[0].length - 1; c++) {
        if (map[r][c] !== '#') { continue; }

        map[r][c] = '.';

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

        map[r][c] = '#';

        const shortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
        const shortestTimeWithCheats = shortestPath.slice(-1)[0] as unknown as number;
        const timeSavings = shortestTimeWithNoCheats - shortestTimeWithCheats;
        if (timeSavings >= 100) {
            fasterTimesWithCheats++;
        }
    }
}

console.log(fasterTimesWithCheats);
