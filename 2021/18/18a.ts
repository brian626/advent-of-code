
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./18.test', 'utf-8');

const lines = file.split('\n');

// [1,1]
// [2,2]
// [3,3]
// [4,4]

// type SnailfishNumber = [SnailfishNumber, SnailfishNumber] | number;
class SnailfishNumber {
    left: number | SnailfishNumber;
    right: number | SnailfishNumber;
    parent: SnailfishNumber | null;

    constructor(array: any[], parent: SnailfishNumber | null = null) {
        // console.log(`constructor called with [${array}], ${parent}`);
        this.parent = parent;

        // console.log(`is ${array} an array?`);
        if (!Array.isArray(array)) {
            // console.log(`  no`);
            this.left = array;
        } else {
            // console.log(`  yes`);
            this.left = new SnailfishNumber(array[0], this);
            this.right = new SnailfishNumber(array[1], this);
        }
    }

    toString(): string {
        let s = '[';
        if (typeof(this.left) === 'number') {
            s += this.left;
            s += ',';
            s += this.right;
        } else {
            s += this.left.toString();
            if (this.right) {
                s += ',';
                s += this.right.toString();
            }
        }
        s += ']';
        return s;
    }
}

const numbers: SnailfishNumber[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const sfn: SnailfishNumber = new SnailfishNumber(eval(lines[i]));
    numbers.push(sfn);
}

// console.log(numbers[0]);
// console.log(numbers[0].left);
// console.log(numbers[0].right);

let sum: SnailfishNumber = numbers[0];
for (let i = 1; i < numbers.length; i++) {
    sum = add(sum, numbers[i]);
    // sum = reduce(sum);
    break;
}


console.log();
console.log(`sum is`);
// console.log(sum);
console.log(sum.toString());


function add(n1: SnailfishNumber, n2: SnailfishNumber): SnailfishNumber {
    return new SnailfishNumber([n1, n2]);
}

function reduce(n: SnailfishNumber): SnailfishNumber {
    let reduced = true;

    while (reduced) {
        [n, reduced] = explode(n);
        // if (!reduced) {
        //     [n, reduced] = split(n);
        // }
        break;
    }

    return n;
}


function explode(n: SnailfishNumber): [SnailfishNumber, boolean] {
    let exploded = false;

    let deepSfn = null;
    let depth = 0;
    let nTemp = n;
    while (true) {
        if (typeof (nTemp) === 'object') {
            depth++;
            nTemp = nTemp[0];
        } else if (typeof (nTemp) === 'number') {
            break;
        }

        if (depth === 4) {
            deepSfn = nTemp;
            break;
        }
    }

    if (deepSfn) {
        console.log(`deepsfn = `);
        console.log(deepSfn);
        exploded = true;
    }

    return [n, exploded];
}
