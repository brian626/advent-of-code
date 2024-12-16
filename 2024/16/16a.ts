
import { readFileSync } from 'fs';
import { exit } from 'process';
import { AStar, AStarNode, Manhattan } from '../../common/astar-algorithm';


const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const map: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    map[i] = lines[i].split('');
}

let rStart = 0, cStart = 0, rEnd = 0, cEnd = 0;

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

        let neighbors = [];
        if (r > 0 && map[r - 1][c] !== '#') { neighbors.push({ nameOfVertex: `${r - 1},${c}`, weight: 1 }); }
        if (r < map.length - 1 && map[r + 1][c] !== '#') { neighbors.push({ nameOfVertex: `${r + 1},${c}`, weight: 1 }); }
        if (c > 0 && map[r][c - 1] !== '#') { neighbors.push({ nameOfVertex: `${r},${c - 1}`, weight: 1 }); }
        if (c < map[0].length - 1 && map[r][c + 1] !== '#') { neighbors.push({ nameOfVertex: `${r},${c + 1}`, weight: 1 }); }

        astar.addNode(new AStarNode(`${r},${c}`, r, c, neighbors));
    }
}

// for (const [k,v] of astar.nodes) {
//     console.log(v.name);
//     console.log(v.neighbors);
//     console.log();
// }


let shortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
// console.log(`shortest path: ${shortestPath.map(x => x.name).join(' -> ')}`);
let minCost = calculateScore(shortestPath);
console.log(`shortest path has a cost of ${minCost}`);
// console.log();

// for (const [name, node] of astar.nodes) {
//     for (let i = 0; i < node.neighbors.length; i++) {
//         const removedNeighbor = node.neighbors.shift();

//         const nextShortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
//         const score = calculateScore(nextShortestPath);
//         if (score > 0) {
//             minCost = Math.min(minCost, score);
//             console.log(`removed ${name}: next shortest path has a cost of ${score}`);
//         }

//         node.neighbors.push(removedNeighbor);
//     }
// }
for (let i = 1; i < shortestPath.length - 1; i++) {
    const path1 = shortestPath[i].name;
    const path2 = shortestPath[i+1].name;

    const node1 = astar.findNode(path1);
    // console.log(`remove ${path2} from ${neighbors.map(x => x.nameOfVertex)}`);

    let indexOfPath2 = -1;
    for (let j = 0; j < node1.neighbors.length; j++) {
        if (node1.neighbors[j].nameOfVertex === path2) {
            indexOfPath2 = j;
            break;
        }
    }
    const removedNeighbor = node1.neighbors.splice(indexOfPath2, 1)[0];

    const nextShortestPath: AStarNode[] = astar.findPath(astar.findNode(`${rStart},${cStart}`), astar.findNode(`${rEnd},${cEnd}`), Manhattan);
    // console.log(`next shortest path: ${nextShortestPath.map(x => x.name).join(' -> ')}`);
    const score = calculateScore(nextShortestPath);
    if (score > 0) {
        minCost = Math.min(minCost, score);
        console.log(`next shortest path has a cost of ${score}`);
        // console.log();
    }

    node1.neighbors.push(removedNeighbor);
}


console.log(minCost);


function calculateScore(path: AStarNode[]): number {
    let facing = 1;
    let cost = 0;
    let rCurrent = rStart, cCurrent = cStart;
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (!node || !node.name) { continue; }
        let [rNode, cNode] = node.name.split(',').map(x => parseInt(x));

        // console.log(`current node is [${rCurrent},${cCurrent}] and facing is ${facing}. heading to [${rNode},${cNode}]`);
        switch (facing) {
            case 0:
                if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    cost += 1;
                } else if (rNode === rCurrent && cNode === cCurrent - 1) {
                    cost += 1001;
                    facing = 3;
                } else if (rNode === rCurrent && cNode === cCurrent + 1) {
                    cost += 1001;
                    facing = 1;
                }
                break;

            case 1:
                if (rNode === rCurrent && cNode === cCurrent + 1) {
                    cost += 1;
                } else if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    cost += 1001;
                    facing = 0;
                } else if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    cost += 1001;
                    facing = 2;
                }
                break;

            case 2:
                if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    cost += 1;
                } else if (rNode === rCurrent && cNode === cCurrent - 1) {
                    cost += 1001;
                    facing = 3;
                } else if (rNode === rCurrent && cNode === cCurrent + 1) {
                    cost += 1001;
                    facing = 1;
                }
                break;

            case 3:
                if (rNode === rCurrent && cNode === cCurrent - 1) {
                    cost += 1;
                } else if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    cost += 1001;
                    facing = 0;
                } else if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    cost += 1001;
                    facing = 2;
                }
                break;
        }

        rCurrent = rNode;
        cCurrent = cNode;
    }

    return cost;
}

// 78392 is too high
