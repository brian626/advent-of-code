// --- Part Two ---

// As you finish the last group's customs declaration, you notice that you misread one word in the instructions:

// You don't need to identify the questions to which anyone answered "yes"; you need to identify the questions
// to which everyone answered "yes"!

// Using the same example as above:

// abc

// a
// b
// c

// ab
// ac

// a
// a
// a
// a

// b

// This list represents answers from five groups:

// In the first group, everyone (all 1 person) answered "yes" to 3 questions: a, b, and c.
// In the second group, there is no question to which everyone answered "yes".
// In the third group, everyone answered yes to only 1 question, a. Since some people did not answer "yes"
//   to b or c, they don't count.
// In the fourth group, everyone answered yes to only 1 question, a.
// In the fifth group, everyone (all 1 person) answered "yes" to 1 question, b.

// In this example, the sum of these counts is 3 + 0 + 1 + 1 + 1 = 6.

// For each group, count the number of questions to which everyone answered "yes". What is the sum of those counts?


import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./6.input', 'utf-8');

const lines = file.split('\n');

const groups: Map<string, number>[] = new Array();
let groupNum = 0;

const groupSizes: number[] = new Array();
let groupSize = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { groupSizes.push(groupSize); groupNum += 1; groupSize = 0; continue; }

    if (groups[groupNum] === undefined) { groups[groupNum] = new Map<string, number>(); }

    groupSize += 1;

    const questions = lines[i].split('');
    questions.forEach(q => {
        if (!groups[groupNum].has(q)) { groups[groupNum].set(q, 0); }
        groups[groupNum].set(q, groups[groupNum].get(q) + 1);
    })
}

let sumQuestions = 0;

for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const groupSize = groupSizes[i];

    sumQuestions += [...group.values()].filter(x => x === groupSize).length;
}

console.log(sumQuestions);
