import { MapWithDefault, DEFAULT } from './mapWithDefault';

export { AStar, AStarNode, Manhattan }

// const astar = new AStar();

// astar.addNode(new AStarNode('A', 0, 0, [{nameOfVertex: 'B', weight: 1}, {nameOfVertex: 'C', weight: 5}]));
// astar.addNode(new AStarNode('B', 2, 0, [{nameOfVertex: 'A', weight: 1}, {nameOfVertex: 'D', weight: 7}]));
// astar.addNode(new AStarNode('C', 0, 2, [{nameOfVertex: 'A', weight: 5}, {nameOfVertex: 'E', weight: 8}]));
// astar.addNode(new AStarNode('D', 2, 3, [{nameOfVertex: 'B', weight: 7}, {nameOfVertex: 'E', weight: 10}]));
// astar.addNode(new AStarNode('E', 1, 4, [{nameOfVertex: 'C', weight: 8}, {nameOfVertex: 'D', weight: 10}]));

// const shortestPath: AStarNode[] = astar.findPath(astar.findNode('A'), astar.findNode('E'), Manhattan);
// console.log(`shortest path: ${shortestPath.map(x => x.name)}`);
// console.log(`shortest path has weight ${shortestPath.slice(-1)[0]}`);

class NodeVertex {
    nameOfVertex: string;
    weight: number;
}

class AStarNode {
    name: string;
    row: number;
    col: number;

    f: number;
    g: number;

    neighbors: NodeVertex[];

    constructor(n: string, r: number, c: number, neighbors: NodeVertex[]) {
        this.name = n;
        this.row = r;
        this.col = c;
        this.f = 0;
        this.g = 0;
        this.neighbors = neighbors;
    }

    toString(): string {
        const neighborNames = this.neighbors.map(x => `'${x.nameOfVertex}'`);
        return `AStarNode { name: '${this.name}', neighbors: [${neighborNames}] }`;
    }
}

function Manhattan(a: AStarNode, b: AStarNode): number {
    return Math.abs(b?.row - a?.row) + Math.abs(b?.col - a?.col);
}

class AStar {
    nodes: Map<string, AStarNode>;
    constructor() {
        this.nodes = new Map<string, AStarNode>();
    }

    addNode(n: AStarNode) {
        this.nodes.set(n.name, n);
    }

    reconstructPath(cameFrom: Map<AStarNode, [AStarNode, number]>, current: AStarNode): any[] {
        const totalPath: any[] = [current];
        let weight = 0;
        let totalWeight = 0;

        while (cameFrom.get(current)) {
            [current, weight] = cameFrom.get(current);
            totalWeight += weight;
            totalPath.unshift(current);
        }

        totalPath.push(totalWeight);
        return totalPath;
    }

    findNode(s: string): AStarNode {
        return this.nodes.get(s);
    }

    // A* finds a path from start to goal.
    // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
    findPath(start: AStarNode, goal: AStarNode, h: (nodeA: AStarNode, nodeB: AStarNode) => number): any[] {
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        const openSet: AStarNode[] = [start];

        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
        // to n currently known.
        const cameFrom: Map<AStarNode, [AStarNode, number]> = new Map<AStarNode, [AStarNode, number]>();

        // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
        const gScore = new MapWithDefault<AStarNode, number>([[DEFAULT, Infinity]]);
        gScore.set(start, 0);

        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how cheap a path could be from start to finish if it goes through n.
        const fScore = new MapWithDefault<AStarNode, number>([[DEFAULT, Infinity]]);
        fScore.set(start, h(start, goal));

        while (openSet.length > 0) {
            // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
            const current = openSet.sort((a, b) => a.f - b.f)[0];
            if (current === goal) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.shift();

            for (const n of current.neighbors) {
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current
                const neighbor = this.findNode(n.nameOfVertex);
                const tentative_gScore = gScore.get(current) + n.weight;

                if (tentative_gScore < gScore.get(neighbor)) {
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom.set(neighbor, [current, n.weight]);
                    gScore.set(neighbor, tentative_gScore);
                    fScore.set(neighbor, tentative_gScore + h(neighbor, goal));

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return [];
    }
}
