// --- Part Two ---

// You're worried you might not ever get your items back. So worried, in fact, that your relief that a monkey's inspection
// didn't damage an item no longer causes your worry level to be divided by three.

// Unfortunately, that relief was all that was keeping your worry levels from reaching ridiculous levels. You'll need to
// find another way to keep your worry levels manageable.

// At this rate, you might be putting up with these monkeys for a very long time - possibly 10000 rounds!

// After 10000 rounds, the two most active monkeys inspected items 52166 and 52013 times. Multiplying these together,
// the level of monkey business in this situation is now 2713310158.

// Worry levels are no longer divided by three after each item is inspected; you'll need to find another way to keep your
// worry levels manageable. Starting again from the initial state in your puzzle input, what is the level of monkey business after 10000 rounds?


import { readFileSync } from 'fs';

const file = readFileSync('./11.input', 'utf-8');

const lines = file.split('\n');

class Monkey {
    items: number[];
    operation: string;
    operand: string;
    divisor: number;
    ifTrue: number;
    ifFalse: number;
    numberOfInspections: number;

    constructor() {
        this.items = [];
        this.numberOfInspections = 0;
    }
}

const monkeys: Monkey[] = [];
let currentMonkey = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const parts = lines[i].trim().split(' ');

    if (parts[0] === 'Monkey') {
        const m = new Monkey();
        monkeys.push(m);
        currentMonkey++;
    } else if (parts[0] === 'Starting') {
        for (let j = 2; j < parts.length; j++) {
            const item = Number(parts[j].replace(',',''));
            monkeys[currentMonkey].items.push(item);
        }
    } else if (parts[0] === 'Operation:') {
        monkeys[currentMonkey].operation = parts[4];
        monkeys[currentMonkey].operand = parts[5];

    } else if (parts[0] === 'Test:') {
        monkeys[currentMonkey].divisor = Number(parts[3]);
    } else if (parts[0] === 'If') {
        if (parts[1] === 'true:') {
            monkeys[currentMonkey].ifTrue = Number(parts[5]);
        } else if (parts[1] === 'false:') {
            monkeys[currentMonkey].ifFalse = Number(parts[5]);
        }
    }
}

// for (let i = 0; i < monkeys.length; i++) {
//     console.log(`Monkey ${i}:`);
//     console.log(monkeys[i]);
//     console.log(``);
// }

const mod = monkeys.map(x => x.divisor).reduce((a,b) => a * b, 1);
// console.log(mod);

const ROUNDS = 10000;

for (let i = 0; i < ROUNDS; i++) {
    for (let j = 0; j < monkeys.length; j++) {
        const monkey = monkeys[j];

        // console.log(`Monkey ${j}:`);

        for (let k = 0; k < monkey.items.length; k++) {
            let item = monkey.items[k];
            monkey.numberOfInspections++;
            // console.log(`  Monkey inspects an item with a worry level of ${item}.`);

            if (monkey.operation === '*') {
                if (monkey.operand === 'old') {
                    item *= item;
                } else {
                    item *= Number(monkey.operand);
                }
            } else if (monkey.operation === '+') {
                item += Number(monkey.operand);
            }
            // console.log(`    Worry level is ${monkey.operation} by ${monkey.operand} to ${item}.`);

            item = item % mod;

            if (item % monkey.divisor === 0) {
                // console.log(`    Current worry level is divisible by ${monkey.divisor}`);
                // console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.ifTrue}.`);
                monkeys[monkey.ifTrue].items.push(item);
            } else {
                // console.log(`    Current worry level is not divisible by ${monkey.divisor}`);
                // console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.ifFalse}.`);
                monkeys[monkey.ifFalse].items.push(item);
            }
        }

        monkey.items.length = 0;
    }

    // for (let i = 0; i < monkeys.length; i++) {
    //     console.log(`Monkey ${i}: ${monkeys[i].items.join(', ')}`);
    // }
    // console.log(``);
}

for (let i = 0; i < monkeys.length; i++) {
    console.log(`Monkey ${i} inspected items ${monkeys[i].numberOfInspections} times.`);
}

console.log(monkeys.sort((x,y) => y.numberOfInspections - x.numberOfInspections).slice(0,2).reduce((a,b) => a * b.numberOfInspections, 1));
