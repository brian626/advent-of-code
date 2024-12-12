
import { readFileSync } from 'fs';
import { exit } from 'process';

class Rule {
    name: string;
    charMatch: string;
    ruleMatches: string[];

    constructor(n: string, m: string) {
        this.name = n;
        this.charMatch = null;
        this.ruleMatches = [];

        if (m.startsWith('"')) {
            this.charMatch = m.replace(/"/g, '');
        } else if (m.includes('|')) {
            this.ruleMatches = m.split(' | ');
        } else {
            this.ruleMatches = [m];
        }
    }
}

const file = readFileSync('./19.test', 'utf-8');

const lines = file.split('\n');

const rules: Rule[] = [];
let scanningRules = true;
let count = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        if (scanningRules) { scanningRules = false; }
        continue;
    }

    if (scanningRules) {
        const [name, matchStr] = lines[i].split(': ');
        rules.push(new Rule(name, matchStr));
    } else {
        const message = lines[i];
        if (matchesRule0(message)) {
            count++;
        }
    }
}

// console.log(rules);

console.log(count);


function matchesRule0(m: string): boolean {
    const rule0 = rules.find(x => x.name === '0');

    let matches = Array.from(rule0.ruleMatches);
    console.log(`initial state`);
    console.log(matches);
    console.log();

    let n = 10;
    while (n > 0) {
        n--;
        matches = expand(matches);
        console.log(`after ${11-n} iterations`);
        console.log(matches);
        console.log();
    }

    console.log(`final state`);
    console.log(matches);
    console.log();
    return false;
}

function expand(matches: string[]): string[] {
    const match = matches.shift();
    const terms = match.split(' ');
    const term1 = terms.shift();
    const newMatches: string[] = [];

    if (terms?.length > 0) {
        const rule = rules.find(x => x.name === term1);
        if (!rule) {
            console.log(`no rule found matching ${term1}`);
            return [];
        }
        if (rule.charMatch) {
            newMatches.push(rule.charMatch + terms.join(' '));
        } else {
            for (const r of rule.ruleMatches) {
                newMatches.push(r + terms.join(' '));
            }
        }
    } else {
        newMatches.push(term1 + terms.join(' '));
    }

    return newMatches;
}

// function expand(s: string, prefix: string): string[] {
//     console.log(`expand(${s}, ${prefix})`);
//     const r = rules.find(x => x.name === s);
//     console.log(`  matching rule is ${r.name}`);
//     if (r.charMatch) {
//         console.log(`  returning [${prefix + r.charMatch}]`);
//         console.log();
//         return [prefix + r.charMatch];
//     } else {
//         let vals: string[] = [];
//         // for (const r1 of r.ruleMatch1.map(x => rules.find(y => y.name === x))) {
//         //     vals = vals.concat(expand(r1.name, prefix));
//         // }
//         // for (const r2 of r.ruleMatch2?.map(x => rules.find(y => y.name === x))) {
//         //     vals = vals.concat(expand(r2.name, prefix));
//         // }

//         console.log(` returning [${vals}]`);
//         return vals;
//     }
// }
