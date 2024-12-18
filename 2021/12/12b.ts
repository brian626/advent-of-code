// --- Part Two ---
// After reviewing the available paths, you realize you might have time to visit a
// single small cave twice. Specifically, big caves can be visited any number of times,
// a single small cave can be visited at most twice, and the remaining small caves can
// be visited at most once. However, the caves named start and end can only be visited
// exactly once each: once you leave the start cave, you may not return to it, and once
// you reach the end cave, the path must end immediately.

// Now, the 36 possible paths through the first example above are:

// start,A,b,A,b,A,c,A,end
// start,A,b,A,b,A,end
// start,A,b,A,b,end
// start,A,b,A,c,A,b,A,end
// start,A,b,A,c,A,b,end
// start,A,b,A,c,A,c,A,end
// start,A,b,A,c,A,end
// start,A,b,A,end
// start,A,b,d,b,A,c,A,end
// start,A,b,d,b,A,end
// start,A,b,d,b,end
// start,A,b,end
// start,A,c,A,b,A,b,A,end
// start,A,c,A,b,A,b,end
// start,A,c,A,b,A,c,A,end
// start,A,c,A,b,A,end
// start,A,c,A,b,d,b,A,end
// start,A,c,A,b,d,b,end
// start,A,c,A,b,end
// start,A,c,A,c,A,b,A,end
// start,A,c,A,c,A,b,end
// start,A,c,A,c,A,end
// start,A,c,A,end
// start,A,end
// start,b,A,b,A,c,A,end
// start,b,A,b,A,end
// start,b,A,b,end
// start,b,A,c,A,b,A,end
// start,b,A,c,A,b,end
// start,b,A,c,A,c,A,end
// start,b,A,c,A,end
// start,b,A,end
// start,b,d,b,A,c,A,end
// start,b,d,b,A,end
// start,b,d,b,end
// start,b,end

// The slightly larger example above now has 103 paths through it, and the even
// larger example now has 3509 paths through it.

// Given these new rules, how many paths through this cave system are there?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./12.input', 'utf-8');

const lines = file.split('\n');

class Cave {
    constructor(name: string) {
        this.name = name;
        this.connections = new Array();
    }

    isSmall(): boolean {
        return this.name[0] !== this.name[0].toUpperCase();
    }

    name: string;
    connections: Cave[];
}

function findOrCreateCave(name: string): Cave {
    for (let i = 0; i < caveList.length; i++) {
        if (caveList[i].name === name) {
            return caveList[i];
        }
    }

    const retCave = new Cave(name);
    caveList.push(retCave);
    return retCave;
}


const caveList: Cave[] = new Array();
caveList.push(new Cave('start'));
caveList.push(new Cave('end'));

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const caves: string[] = lines[i].split('-');

    const cave1 = findOrCreateCave(caves[0]);
    const cave2 = findOrCreateCave(caves[1]);

    cave1.connections.push(cave2);
    cave2.connections.push(cave1);
}


const currentPath: string[] = new Array();
const simplePaths: string[][] = new Array();

DFS('start', 'end');

// console.log(simplePaths);
console.log(simplePaths.length);

function DFS(u: string, v: string) {
    // console.log(`DFS(${u}, ${v}) with currentPath [${currentPath}]`);

    const currentCave = findOrCreateCave(u);

    currentPath.push(currentCave.name);

    if (currentCave.name === v) {
        // console.log(`  found a path`);
        simplePaths.push(Array.from(currentPath));
        currentPath.pop();
        return;
    }

    for (let i = 0; i < currentCave.connections.length; i++) {
        const nextCave = currentCave.connections[i];
        if (nextCave.isSmall()) {
            if (currentPath.includes(nextCave.name)) {
                if (nextCave.name === 'start' || nextCave.name === 'end') { continue; }

                const smallCavesInPath = currentPath.filter(x => x !== x.toUpperCase());
                const map = smallCavesInPath.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
                if ([...map.values()].filter(x => x > 1).length > 0) {
                    continue;
                }
            }
        }

        DFS(nextCave.name, v);
    }

    currentPath.pop();
}
