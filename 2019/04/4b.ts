
// Your puzzle input is 246540-787419.

const START2 = 246540;
const END2 = 787419;

function isValid(x: number): boolean {
    // console.log(x);
    const d: number[] = x.toString().split('').map(x => parseInt(x));
    // let adjacentDigitsAreSame = false;
    let repeatedDigitCount: Map<number, number> = new Map<number, number>();
    for (let i = 0; i < d.length - 1; i++) {
        if (d[i] > d[i+1]) {
            // console.log(`returning false for ${x} because ${d[i]} > ${d[i+1]}`);
            return false;
        }
        else if (d[i] === d[i+1]) {
            if (repeatedDigitCount.has(d[i])) {
                repeatedDigitCount.set(d[i], repeatedDigitCount.get(d[i]) + 1);
            } else {
                repeatedDigitCount.set(d[i], 2);
            }
            // adjacentDigitsAreSame = true;
        }
    }

    return [...repeatedDigitCount.values()].filter(x => x === 2).length > 0;
    // if (adjacentDigitsAreSame) { console.log(`returning ${adjacentDigitsAreSame} for ${x}`); }
    // return adjacentDigitsAreSame;
}

let y = START2;
let count2 = 0;
while (y <= END2) {
    if (isValid(y)) {
        count2 += 1;
    }

    y += 1;
}

console.log(count2);

// 137 is too low
// 418 is too low
