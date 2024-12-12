
import { readFileSync } from 'fs';
import { exit } from 'process';

class Move {
    move: number;
    input1: number | string;
    input2: number | string;

    constructor(m: number, i1: number | string, i2: number | string) {
        this.move = m;
        this.input1 = i1;
        this.input2 = i2;
    }
}

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const moves: Move[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const moveStrs = lines[i].split(',');

    for (const m of moveStrs) {
        switch (m[0]) {
            case 's':
                const spins = parseInt(m.slice(1));
                moves.push(new Move(0, spins, 0));
                break;

            case 'x':
                const [fromPos, toPos] = m.slice(1).split('/').map(x => parseInt(x));
                moves.push(new Move(1, fromPos, toPos));
                break;

            case 'p':
                const [fromName, toName] = m.slice(1).split('/');
                moves.push(new Move(2, fromName, toName));
                break;
        }
    }
}

// console.log(moves);

let programs: Map<number, string> = new Map<number, string>();
for (let i = 0; i < 16; i++) {
    programs.set(i, String.fromCharCode(('a'.charCodeAt(0) + i)));
}


// console.log(Array.from(programs.values()).join(''));

for (let d = 0; d < 10000; d++) {
    // console.log(d, 'start', Array.from(programs.values()).join(''));
    if (d % 1000 === 0) { console.log(d); }

    for (const m of moves) {
        // console.log(d, '  before ', m, Array.from(programs.values()).join(''));
        switch (m.move) {
            case 0:
                for (let i = 0; i < (m.input1 as number); i++) {
                    const temp = programs.get(programs.size - 1);
                    for (let j = programs.size - 1; j > 0; j--) {
                        programs.set(j, programs.get(j-1));
                    }
                    programs.set(0, temp);
                }
                break;

            case 1:
                const temp = programs.get(m.input2 as number);
                programs.set(m.input2 as number, programs.get(m.input1 as number));
                programs.set(m.input1 as number, temp);
                break;

            case 2:
                let pos1 = -1, pos2 = -1;
                for (const [k, v] of programs) {
                    if (v === (m.input1 as string)) { pos1 = k; }
                    else if (v === (m.input2 as string)) { pos2 = k; }
                    if (pos1 > -1 && pos2 > -1) { break; }
                }
                // console.log(`found ${m.input1} at position ${pos1} and ${m.input2} at ${pos2}`);
                programs.set(pos1, m.input2 as string);
                programs.set(pos2, m.input1 as string);
                break;
        }
        // console.log(d, '  after ', m, Array.from(programs.values()).join(''));
    }

    // console.log(d + 1, 'end', Array.from(programs.values()).join(''));
}

console.log(Array.from(programs.values()).join(''));



// 1: abcdefghijklmnop => lbdiomkhgcjanefp
// 2: lbdiomkhgcjanefp => kaboilhngcmfjepd
// 3: kaboilhngcmfjepd => kanphfedmocljbgi
