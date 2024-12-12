export { DFSNode, Dfs }

let DEBUG = false;

class DFSNode {
    name: string;
    neighbors: string[];
    discovered: boolean;

    constructor(name: string, neighbors: string[]) {
        this.name = name;
        this.neighbors = [...neighbors];
        this.discovered = false;
    }

    toString(): string {
        return `${this.name}: ${this.neighbors.map(x => '[' + x + ']')}`;
    }
}

class Dfs {
    graph: Map<string, DFSNode>;
    path: string[];
    maxPathLength: number;

    constructor() {
        this.graph = new Map<string, DFSNode>();
        this.path = [];
        this.maxPathLength = 0;
    }

    addNode(n: DFSNode) {
        this.graph.set(n.name, n);
    }

    findNode(s: string): DFSNode | undefined {
        return this.graph.get(s);
    }

    reset() {
        for (const node of this.graph.values()) {
            node.discovered = false;
        }

        this.path = [];
    }

    DFS_iterative(current: string, finish: string): boolean {
        let S: string[] = [];

        S.push(current);
        // console.log(`pushed ${current}`);

        const pathsFound: string[][] = [];

        while (S.length > 0) {
            // console.log(S.map(x => x[0]));

            const vName = S.pop();
            // console.log(`considering [${vName}]`);
            if (vName === finish) {
                this.path.push(vName);
                this.maxPathLength = Math.max(this.maxPathLength, this.path.length);
                console.log(`finished at [${vName}] with path length ${this.path.length - 1}`);

                pathsFound.push([...this.path]);

                S = [current];
                this.path = [];

                for (const node of this.graph.values()) {
                    node.discovered = false;
                }

                console.log(`there are now ${pathsFound.length} paths found`);

                continue;
            }

            const v = this.findNode(vName);

            if (v && !v.discovered) {
                v.discovered = true;
                this.path.push(vName);

                if (v.neighbors.length < 3) {
                    for (let i = 0; i < v.neighbors.length; i++) {
                        S.push(v.neighbors[i]);
                    }
                } else {
                    console.log(`checking the multiple neighbors of [${v.name}]`);
                    for (let i = 0; i < v.neighbors.length; i++) {
                        let alreadyTravelled = false;

                        console.log(`checking to see if neighbor ${v.neighbors[i]} was on a path already`);

                        for (let j = 0; j < pathsFound.length; j++) {
                            console.log(pathsFound[j].join(' -> '));
                            if (pathsFound[j].includes(v.neighbors[i])) {
                                alreadyTravelled = true;
                                break;
                            }
                        }

                        if (!alreadyTravelled) {
                            console.log(`...nope`);
                            S.push(v.neighbors[i]);
                            console.log(`  pushed neighbor ${v.neighbors[i]}`);
                        } else {
                            console.log(`...yep`);
                        }
                    }
                }
            }
        }

        return false;
    }

    DFS_recursive(current: string, finish: string): boolean {
        if (DEBUG) { console.log(`DFS(${current}, ${finish})`); }
        if (current === finish) {
            this.path.push(current);
            this.maxPathLength = Math.max(this.maxPathLength, this.path.length);
            if (DEBUG) {
                console.log(`finished with path = ${this.path.map(x => '['+x+']').join(' -> ')}`);
                console.log();
            }
            return true;
        }

        let rv = false;

        const currentNode = this.graph.get(current);
        currentNode.discovered = true;
        if (DEBUG) { console.log(`marked ${currentNode.name} as discovered`); }
        this.path.push(current);

        for (const neighbor of currentNode.neighbors) {
            if (DEBUG) { console.log(`  looping on neighbor ${neighbor}`); }
            const w = this.findNode(neighbor);
            if (w && !w.discovered) {
                const currentPathLength = this.path.length;
                if (!rv) {
                    rv = this.DFS_recursive(w.name, finish);
                }
                // if (rv) { console.log(`found path from ${current} -> ${finish}`); return true; }

                // for (const n of this.graph.values()) {
                //     n.discovered = false;
                // }

                // this.path = this.path.slice(0, currentPathLength);

                // for (const p of this.path) {
                //     this.findNode(p).discovered = true;
                // }
            }
        }

        // console.log(`returning ${rv} from ${current} -> ${finish}`);
        return rv;
    }
}
