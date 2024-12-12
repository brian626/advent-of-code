// --- Day 11: Monkey in the Middle ---
// As you finally start making your way upriver, you realize your pack is much lighter than you remember.
// Just then, one of the items from your pack goes flying overhead. Monkeys are playing Keep Away with your missing things!

// To get your stuff back, you need to be able to predict where the monkeys will throw your items. After some careful
// observation, you realize the monkeys operate based on how worried you are about each item.

// You take some notes (your puzzle input) on the items each monkey currently has, how worried you are about those items,
// and how the monkey makes decisions based on your worry level. For example:


// Each monkey has several attributes:

// Starting items lists your worry level for each item the monkey is currently holding in the order they will be inspected.

// Operation shows how your worry level changes as that monkey inspects an item. (An operation like new = old * 5 means
// that your worry level after the monkey inspected the item is five times whatever your worry level was before inspection.)

// Test shows how the monkey uses your worry level to decide where to throw an item next.

// If true shows what happens with an item if the Test was true.

// If false shows what happens with an item if the Test was false.

// After each monkey inspects an item but before it tests your worry level, your relief that the monkey's inspection didn't
// damage the item causes your worry level to be divided by three and rounded down to the nearest integer.

// The monkeys take turns inspecting and throwing items. On a single monkey's turn, it inspects and throws all of the items
// it is holding one at a time and in the order listed. Monkey 0 goes first, then monkey 1, and so on until each monkey has
// had one turn. The process of each monkey taking a single turn is called a round.

// When a monkey throws an item to another monkey, the item goes on the end of the recipient monkey's list. A monkey that
// starts a round with no items could end up inspecting and throwing many items by the time its turn comes around. If a
// monkey is holding no items at the start of its turn, its turn ends.

// In this example, the two most active monkeys inspected items 101 and 105 times. The level of monkey business in this
// situation can be found by multiplying these together: 10605.

// Figure out which monkeys to chase by counting how many items they inspect over 20 rounds. What is the level of monkey
// business after 20 rounds of stuff-slinging simian shenanigans?


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

const ROUNDS = 20;

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

            item = Math.floor(item / 3);
            // console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}.`);

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
