
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

// console.log(computers);

const triplets: Set<string> = new Set<string>();

for (const [name1, computer1] of computers) {
    for (const [name2, computer2] of computers) {
        if (name1 === name2) { continue; }
        for (const [name3, computer3] of computers) {
            if (name1 === name3 || name2 === name3) { continue; }

            if (computer1.connections.includes(name2) &&
                computer2.connections.includes(name3) &&
                computer3.connections.includes(name1) &&
                (name1.startsWith('t') || name2.startsWith('t') || name3.startsWith('t'))) {
                const triplet = [name1, name2, name3].sort((a, b) => a.localeCompare(b));
                triplets.add(`${triplet[0]}-${triplet[1]}-${triplet[2]}`);
            }
        }
    }
}

console.log(triplets.size);
