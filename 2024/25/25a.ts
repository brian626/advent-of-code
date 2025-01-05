
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./25.input', 'utf-8');

const lines = file.split('\n');

const locks: number[][] = [];
const keys: number[][] = [];

let lockOrKey: string[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        if (lockOrKey[0].split('').filter(x => x === '#').length > 0) {
            const key: number[] = [];
            for (let c = 0; c < lockOrKey[0].length; c++) {
                let column = '';
                for (let r = lockOrKey.length - 1; r >= 0; r--) {
                    column += lockOrKey[r].split('')[c];
                }

                key.push(column.split('').filter(x => x === '#').length - 1);
            }

            keys.push(key);
        } else {
            const lock: number[] = [];
            for (let c = 0; c < lockOrKey[0].length; c++) {
                let column = '';
                for (let r = 0; r < lockOrKey.length; r++) {
                    column += lockOrKey[r].split('')[c];
                }

                lock.push(column.split('').filter(x => x === '#').length - 1);
            }

            locks.push(lock);
        }

        lockOrKey = [];
        continue;
    }

    lockOrKey.push(lines[i]);
}


// console.log(locks);
// console.log(keys);

let count = 0;

for (const lock of locks) {
    for (const key of keys) {
        if (fitTogether(lock, key)) {
            count++;
        }
    }
}

console.log(count);


function fitTogether(lock: number[], key: number[]): boolean {
    for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] > 5) {
            return false;
        }
    }

    return true;
}
