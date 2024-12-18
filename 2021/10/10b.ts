// Now, discard the corrupted lines. The remaining lines are incomplete.

// Incomplete lines don't have any incorrect characters - instead, they're
// missing some closing characters at the end of the line. To repair the
// navigation subsystem, you just need to figure out the sequence of closing
// characters that complete all open chunks in the line.

// You can only use closing characters (), ], }, or >), and you must add
// them in the correct order so that only legal pairs are formed and all
// chunks end up closed.

// In the example above, there are five incomplete lines:

// [({(<(())[]>[[{[]{<()<>> - Complete by adding }}]])})].
// [(()[<>])]({[<{<<[]>>( - Complete by adding )}>]}).
// (((({<>}<{<{<>}{[]{[]{} - Complete by adding }}>}>)))).
// {<[[]]>}<{[{[{[]{()[[[] - Complete by adding ]]}}]}]}>.
// <{([{{}}[<[[[<>{}]]]>[]] - Complete by adding ])}>.

// Did you know that autocomplete tools also have contests? It's true! The
// score is determined by considering the completion string character-by-character.
// Start with a total score of 0. Then, for each character, multiply the total
// score by 5 and then increase the total score by the point value given for
// the character in the following table:

// ): 1 point.
// ]: 2 points.
// }: 3 points.
// >: 4 points.

// So, the last completion string above - ])}> - would be scored as follows:

// Start with a total score of 0.
// Multiply the total score by 5 to get 0, then add the value of ] (2) to get a new total score of 2.
// Multiply the total score by 5 to get 10, then add the value of ) (1) to get a new total score of 11.
// Multiply the total score by 5 to get 55, then add the value of } (3) to get a new total score of 58.
// Multiply the total score by 5 to get 290, then add the value of > (4) to get a new total score of 294.

// The five lines' completion strings have total scores as follows:

// }}]])})] - 288957 total points.
// )}>]}) - 5566 total points.
// }}>}>)))) - 1480781 total points.
// ]]}}]}]}> - 995444 total points.
// ])}> - 294 total points.

// Autocomplete tools are an odd bunch: the winner is found by sorting all of the scores
// and then taking the middle score. (There will always be an odd number of scores to consider.)
// In this example, the middle score is 288957 because there are the same number of scores
// smaller and larger than it.

// Find the completion string for each incomplete line, score the completion strings,
// and sort the scores. What is the middle score?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

const incompleteLines: string[] = new Array();

lines.forEach(l => {
    if (score(l) === 0) {
        incompleteLines.push(l);
    }
});

const scores: number[] = new Array();

incompleteLines.forEach(l => {
    const score = completeLine(l);
    if (score > 0) {
        scores.push(score);
    }
});

scores.sort((a,b) => a - b);
// console.log(scores);
console.log(scores[Math.floor(scores.length / 2)]);

function completeLine(line: string): number {
    // console.log(`incomplete line: ${line}`);

    const stack: string[] = new Array();
    const chars: string[] = line.split('');

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        if (c === '(' || c === '[' || c === '{' || c === '<') {
            stack.unshift(c);
        }
        else if (c === ')' || c === ']' || c === '}' || c === '>') {
            stack.shift();
        }
    }

    // stack will now have the uncompleted chunks, but in the wrong order.
    stack.reverse();
    // console.log(`  stack: ${stack}`);

    let score = 0;
    while (stack.length > 0) {
        score *= 5;

        const c = stack.pop();
        if (c === '(') { score += 1; }
        else if (c === '[') { score += 2; }
        else if (c === '{') { score += 3; }
        else if (c === '<') { score += 4; }
    }

    // console.log(`  returning ${score}`);
    return score;
}

function score(line: string): number {
    const stack: string[] = new Array();
    const chars: string[] = line.split('');

    let corruptChar: string = '';

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        if (c === '(' || c === '[' || c === '{' || c === '<') {
            stack.unshift(c);
        }
        else if (c === ')') {
            const c2 = stack.shift();
            if (c2 !== '(') { corruptChar = c; break; }
        }
        else if (c === ']') {
            const c2 = stack.shift();
            if (c2 !== '[') { corruptChar = c; break; }
        }
        else if (c === '}') {
            const c2 = stack.shift();
            if (c2 !== '{') { corruptChar = c; break; }
        }
        else if (c === '>') {
            const c2 = stack.shift();
            if (c2 !== '<') { corruptChar = c; break; }
        }
    }

    if (corruptChar === ')') { return 3; }
    else if (corruptChar === ']') { return 57; }
    else if (corruptChar === '}') { return 1197; }
    else if (corruptChar === '>') { return 25137; }

    return 0;
}
