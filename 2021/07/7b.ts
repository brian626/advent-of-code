// The crabs don't seem interested in your proposed solution. Perhaps you misunderstand crab engineering?

// As it turns out, crab submarine engines don't burn fuel at a constant rate. Instead, each change of 1 step
// in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step
// costs 2, the third step costs 3, and so on.

// As each crab moves, moving further becomes more expensive. This changes the best horizontal position to
// align them all on; in the example above, this becomes 5:

// Move from 16 to 5: 66 fuel
// Move from 1 to 5: 10 fuel
// Move from 2 to 5: 6 fuel
// Move from 0 to 5: 15 fuel
// Move from 4 to 5: 1 fuel
// Move from 2 to 5: 6 fuel
// Move from 7 to 5: 3 fuel
// Move from 1 to 5: 10 fuel
// Move from 2 to 5: 6 fuel
// Move from 14 to 5: 45 fuel

// This costs a total of 168 fuel. This is the new cheapest possible outcome; the old alignment
// position (2) now costs 206 fuel instead.

// Determine the horizontal position that the crabs can align to using the least fuel possible so
// they can make you an escape route! How much fuel must they spend to align to that position?

import { readFileSync } from 'fs';

const file = readFileSync('./7.input', 'utf-8');

const lines = file.split('\n');

const positions: number[] = lines[0].split(',').map(x => parseInt(x));

const minPos = Math.min(...positions);
const maxPos = Math.max(...positions);

let minFuel = 99999999999;

for (let i = minPos; i <= maxPos; i++) {
    const fuel = positions.map(x => {
        let step = 1;
        let total = 0;
        for (let n = 0; n < Math.abs(x - i); n++) {
            total += step;
            step += 1;
        }

        return total;
    }).reduce((a,b) => a + b, 0);
    minFuel = Math.min(fuel, minFuel);
}

console.log(minFuel);
