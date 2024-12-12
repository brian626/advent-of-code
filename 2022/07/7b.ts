// --- Part Two ---
// Now, you're ready to choose a directory to delete.

// The total disk space available to the filesystem is 70000000. To run the update, you need unused space
// of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

// In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165;
// this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by
// the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

// To achieve this, you have the following options:

// Delete directory e, which would increase unused space by 584.
// Delete directory a, which would increase unused space by 94853.
// Delete directory d, which would increase unused space by 24933642.
// Delete directory /, which would increase unused space by 48381165.

// Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are
// both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

// Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update.
// What is the total size of that directory?

import { readFileSync } from 'fs';
import { exit } from 'process';

class File {
    name: string;
    size: number;

    constructor(n: string, s: number) {
        this.name = n;
        this.size = s;
    }
}

class Directory {
    name: string;
    parent: Directory;
    files: File[];
    directories: Directory[];
    size: number;

    constructor(n: string, p: Directory) {
        this.name = n;
        this.parent = p;
        this.files = [];
        this.directories = [];
        this.size = 0;
    }
}

const file = readFileSync('./7.input', 'utf-8');

const lines = file.split('\n');

const directoryTree: Directory = new Directory('/', null);
let currentDirectory = directoryTree;
let listingContents = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.length === 0) { continue; }

    if (line.slice(0,1) === '$') {
        // console.log(`line ${i}: command`);

        const commandParts: string[] = line.slice(2).split(' ');
        const command = commandParts[0];
        const argument = commandParts[1];
        listingContents = false;

        if (command === 'cd') {
            if (argument === '..') {
                // console.log(`  moving up one directory to ${currentDirectory.parent.name}`);
                currentDirectory = currentDirectory.parent;
            } else {
                // console.log(`  changing directory to ${argument}`);
                for (let i = 0; i < currentDirectory.directories.length; i++) {
                    if (currentDirectory.directories[i].name === argument) {
                        currentDirectory = currentDirectory.directories[i];
                        break;
                    }
                }
            }
        } else if (command === 'ls') {
            // console.log(`  listing directory contents`)
            listingContents = true;
        }

    } else {
        // console.log(`line ${i}: ls output`);

        if (listingContents) {
            const listingParts = line.split(' ');
            if (listingParts[0] === 'dir') {
                // console.log(`  adding subdirectory ${listingParts[1]}`);
                const newDirectory = new Directory(listingParts[1], currentDirectory);
                currentDirectory.directories.push(newDirectory);
            } else {
                // console.log(`  adding file ${listingParts[1]} with size ${listingParts[0]}`);
                const newFile = new File(listingParts[1], parseInt(listingParts[0]));
                currentDirectory.files.push(newFile);
            }
        }
    }
}

calculateDirectorySizes(directoryTree);

const spaceNeeded = 30000000 - (70000000 - directoryTree.size);

const bigDirectories = findDirectoriesToDelete(directoryTree);

// console.log(bigDirectories);

console.log(Math.min(...bigDirectories.map(x => x.size)));


function calculateDirectorySizes(d: Directory): number {
    for (let i = 0; i < d.directories.length; i++) {
        d.size += calculateDirectorySizes(d.directories[i]);
    }

    for (let i = 0; i < d.files.length; i++) {
        d.size += d.files[i].size;
    }

    return d.size;
}


function findDirectoriesToDelete(d: Directory): Directory[] {
    let directoryList: Directory[] = [];

    for (let i = 0; i < d.directories.length; i++) {
        // console.log(`concatenating contents of ${d.name}`);
        directoryList = directoryList.concat(findDirectoriesToDelete(d.directories[i]));
        // console.log(`directory list is now`);
        // console.log(directoryList);
    }

    if (d.size > spaceNeeded) {
        // console.log(`pushing ${d.name}`);
        directoryList.push(d);
    }

    // console.log(`done with ${d.name}, returning`);
    // console.log(directoryList);
    return directoryList;
}
