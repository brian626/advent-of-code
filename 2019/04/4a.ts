
// Your puzzle input is 246540-787419.

const START = 246540;
const END = 787419;

function isValid(x: number): boolean {
    // console.log(x);
    const d: number[] = x.toString().split('').map(x => parseInt(x));
    let adjacentDigitsAreSame = false;
    for (let i = 0; i < d.length - 1; i++) {
        if (d[i] > d[i+1]) {
            // console.log(`returning false for ${x} because ${d[i]} > ${d[i+1]}`);
            return false;
        }
        else if (d[i] === d[i+1]) { adjacentDigitsAreSame = true; }
    }

    // if (adjacentDigitsAreSame) { console.log(`returning ${adjacentDigitsAreSame} for ${x}`); }
    return adjacentDigitsAreSame;
}

let x = START;
let count = 0;
while (x <= END) {
    if (isValid(x)) {
        count += 1;
    }

    x += 1;
}

console.log(count);

// 1064 is too high
