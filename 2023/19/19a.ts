
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

enum Comparison { LessThan, GreaterThan }

class Rule {
    metric: string;
    comparison: Comparison;
    value: number;
    destination: string; // Workflow | null;

    // Examples: a<2006:qkq, m>2090:A, rfg
    constructor(r: string) {
        const [lhs, rhs] = r.split(':');
        if (rhs?.length > 0) {
            if (lhs.includes('>')) {
                const [metric, value] = lhs.split('>');
                this.metric = metric;
                this.comparison = Comparison.GreaterThan;
                this.value = parseInt(value);
            } else {
                const [metric, value] = lhs.split('<');
                this.metric = metric;
                this.comparison = Comparison.LessThan;
                this.value = parseInt(value);
            }

            this.destination = rhs;
        } else {
            this.metric = null;
            this.comparison = null;
            this.value = -1;
            this.destination = lhs;
        }
    }
}


class Workflow {
    name: string;
    rules: Rule[];

    // Example: px{a<2006:qkq,m>2090:A,rfg}
    constructor(w: string) {
        const [name, rulesPart] = w.split('{');
        this.name = name;

        this.rules = [];
        const rules = rulesPart.replace('}', '').split(',');
        for (const r of rules) {
            this.rules.push(new Rule(r));
        }
    }

    applyRules(p: Part): Workflow {
        console.log(`in workflow ${this.name}, part is ${p.x}, ${p.m}, ${p.a}, ${p.s}}`);
        for (let i = 0; i < this.rules.length; i++) {
            const rule = this.rules[i];
            console.log(`  considering rule ${rule.metric} ${rule.comparison === Comparison.GreaterThan ? '>' : '<'} ${rule.value} => ${rule.destination}`);
            if (rule.metric) {
                console.log(`  rule.metric: ${rule.metric}`);
                console.log(`  rule.comparison: ${rule.comparison === Comparison.GreaterThan ? '>' : '<'}`);
                console.log(`  p[rule.metric]: ${p[rule.metric]}`);
                console.log(`  rule.value: ${rule.value}`);
                if (rule.comparison === Comparison.GreaterThan && p[rule.metric] > rule.value) {
                    console.log(`  metric passed, proceeding to workflow ${rule.destination}`);
                    console.log();
                    return findWorkflow(rule.destination);
                } else if (rule.comparison === Comparison.LessThan && p[rule.metric] < rule.value) {
                    console.log(`  metric passed, proceeding to workflow ${rule.destination}`);
                    console.log();
                    return findWorkflow(rule.destination);
                }
            } else {
                console.log(`  no rules applied, proceeding to workflow ${rule.destination}`);
                console.log();
                return findWorkflow(rule.destination);
            }
        }
    }
}

function findWorkflow(n: string): Workflow {
    let w = workflows.find(x => x.name === n);
    return w ? w : new Workflow(`${n}{}`);
}

class Part {
    x: number;
    m: number;
    a: number;
    s: number;

    constructor(s: string) {
        const [xPart, mPart, aPart, sPart] = s.replace('{', '').replace('{', '').split(',');
        this.x = parseInt(xPart.split('=')[1]);
        this.m = parseInt(mPart.split('=')[1]);
        this.a = parseInt(aPart.split('=')[1]);
        this.s = parseInt(sPart.split('=')[1]);
    }
}

let readingWorkflows = true;

const workflows: Workflow[] = [];
const parts: Part[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { readingWorkflows = false; continue; }

    if (readingWorkflows) {
        workflows.push(new Workflow(lines[i]));
    } else {
        parts.push(new Part(lines[i]));
    }
}

console.log(workflows);
console.log();
console.log(parts);

let sum = 0;

for (const part of parts) {
    let workflow = findWorkflow('in'); // workflows.find(x => x.name === 'in');
    while (true) {
        const destination = workflow.applyRules(part);
        console.log(`destination: ${destination.name}`);
        console.log();
        if (destination.name === 'A') {
            sum += part.x + part.m + part.a + part.s;
            break;
        } else if (destination.name === 'R') {
            break;
        } else {
            workflow = destination;
        }
    }
}

console.log(sum);
