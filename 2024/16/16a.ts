
import { readFileSync } from 'fs';
import { exit } from 'process';
import { findAllPaths } from '../../common/findAllPaths';

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

const maze: number[][] = [];
for (let r = 0; r < map.length; r++) {
    maze[r] = [];

    for (let c = 0; c < map[0].length; c++) {
        if (map[r][c] === '#') {
            maze[r][c] = 1;
        } else {
            maze[r][c] = 0;
        }
    }
}

const start = [rStart, cStart];
const end = [rEnd, cEnd];

let a = calculateScore;
const allPaths = findAllPaths(maze, start, end, calculateScore, 61000);
// console.log(allPaths.length);

let minScore = Infinity;
for (const p of allPaths) {
    minScore = Math.min(minScore, calculateScore(p));
}

console.log(minScore);


function calculateScore(path: number[][]): number {
    let facing = 1;
    let score = 0;
    let rCurrent = rStart, cCurrent = cStart;
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (!node) { continue; }
        let [rNode, cNode] = [node[0], node[1]];
        if (rNode === rStart && cNode === cStart) { continue; }

        // console.log(`current node is [${rCurrent},${cCurrent}] and facing is ${facing}. heading to [${rNode},${cNode}]`);
        switch (facing) {
            case 0:
                if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    score += 1;
                } else if (rNode === rCurrent && cNode === cCurrent - 1) {
                    score += 1001;
                    facing = 3;
                } else if (rNode === rCurrent && cNode === cCurrent + 1) {
                    score += 1001;
                    facing = 1;
                }
                break;

            case 1:
                if (rNode === rCurrent && cNode === cCurrent + 1) {
                    score += 1;
                } else if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    score += 1001;
                    facing = 0;
                } else if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    score += 1001;
                    facing = 2;
                }
                break;

            case 2:
                if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    score += 1;
                } else if (rNode === rCurrent && cNode === cCurrent - 1) {
                    score += 1001;
                    facing = 3;
                } else if (rNode === rCurrent && cNode === cCurrent + 1) {
                    score += 1001;
                    facing = 1;
                }
                break;

            case 3:
                if (rNode === rCurrent && cNode === cCurrent - 1) {
                    score += 1;
                } else if (rNode === rCurrent - 1 && cNode === cCurrent) {
                    score += 1001;
                    facing = 0;
                } else if (rNode === rCurrent + 1 && cNode === cCurrent) {
                    score += 1001;
                    facing = 2;
                }
                break;
        }

        rCurrent = rNode;
        cCurrent = cNode;
    }

    // console.log(`score for path of length ${path.length} is ${score}`);
    return score;
}
