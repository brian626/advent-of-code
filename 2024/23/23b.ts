
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./23.input', 'utf-8');

const lines = file.split('\n');

class Computer {
    name: string;
    connections: string[] = [];

    constructor(name: string) {
        this.name = name;
        this.connections = [];
    }

    isConnectedTo(name: string): boolean {
        return this.connections.includes(name);
    }
}

const computers: Map<string, Computer> = new Map<string, Computer>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [name, connectionName] = lines[i].split('-');

    const computer = computers.get(name) || new Computer(name);
    const connection = computers.get(connectionName) || new Computer(connectionName);
    computer.connections.push(connectionName);
    computers.set(name, computer);
    connection.connections.push(name);
    computers.set(connectionName, connection);
}

let largestSetCount = 0;
let largestSet: string[] = [];

for (const [name, computer] of computers) {
    let connectedSet: string[] = [name];
    let connections = Array.from(computer.connections);
    // console.log(`${name} is connected to ${connections}`);

    let removedConnection = true;
    while (removedConnection) {
        removedConnection = false;

        const connectionsToRemove: string[] = [];
        for (let i = 0; i < connections.length; i++) {
            for (let j = 0; j < connections.length; j++) {
                if (i === j) { continue; }

                if (countConnectedTo(connections[i], connections.filter(x => x != connections[i])) === 0) {
                    connectionsToRemove.push(connections[i]);
                }
            }
        }

        for (let i = 0; i < connectionsToRemove.length; i++) {
            removedConnection = true;
            connections = connections.filter(x => x !== connectionsToRemove[i]);
        }
    }

    connectedSet = connectedSet.concat(connections);

    if (areFullyConnected(connectedSet)) {
        // console.log(`fully-connected set is ${connectedSet}`);
        if (connectedSet.length > largestSetCount) {
            largestSetCount = connectedSet.length;
            largestSet = connectedSet;
        }
    }
    // console.log();
}


console.log(largestSet.sort((a,b) => a.localeCompare(b)).join(','));



function countConnectedTo(name: string, connections: string[]): number {
    let count = 0;

    const computer = computers.get(name);
    for (const c of connections) {
        if (computer.isConnectedTo(c)) {
            count++;
        }
    }

    // console.log(`  ${name} is connected to ${count} of [${connections}]`);
    return count;
}

function areFullyConnected(connections: string[]): boolean {
    for (let i = 0; i < connections.length; i++) {
        for (let j = 0; j < connections.length; j++) {
            if (i === j) { continue; }

            const computer = computers.get(connections[i]);

            if (!computer.isConnectedTo(connections[j])) {
                return false;
            }
        }
    }

    return true;
}
