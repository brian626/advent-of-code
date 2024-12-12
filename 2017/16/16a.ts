
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

// s1,x3/4,pe/b

let moves: string[];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    moves = lines[i].split(',');
}

console.log(moves);

const programs: string[] = [];
for (let i = 0; i < 16; i++) {
    programs[i] = String.fromCharCode(('a'.charCodeAt(0) + i));
}


console.log(programs.join(''));

for (const m of moves) {
    switch (m[0]) {
        case 's':
            const spins = parseInt(m.slice(1));
            for (let i = 0; i < spins; i++) {
                programs.unshift(programs.pop());
            }
            break;

        case 'x':
            const [fromPos, toPos] = m.slice(1).split('/').map(x => parseInt(x));
            const temp = programs[fromPos];
            programs[fromPos] = programs[toPos];
            programs[toPos] = temp;
            break;

        case 'p':
            const [fromName, toName] = m.slice(1).split('/');
            const pos1 = programs.indexOf(fromName);
            const pos2 = programs.indexOf(toName);
            const temp2 = programs[pos1];
            programs[pos1] = programs[pos2];
            programs[pos2] = temp2;
            break;
    }
}

console.log(programs.join(''));
