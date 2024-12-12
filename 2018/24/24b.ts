
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./24.input', 'utf-8');

const lines = file.split('\n');

class Group {
    n: number;
    army: string;
    units: number;
    hp: number;
    weak: string[];
    immune: string[];
    damage: number;
    damageType: string;
    init: number;
    selected: boolean;
    target: Group;

    constructor(n: number, a: string, u: number, hp: number, w: string[], i: string[], d: number, dt: string, init: number) {
        this.n = n;
        this.army = a;
        this.units = u;
        this.hp = hp;
        this.weak = w;
        this.immune = i;
        this.damage = d;
        this.damageType = dt;
        this.init = init;
        this.selected = false;
        this.target = null;
    }

    effectivePower(): number { return this.units * this.damage; }
}

const immuneGroups: Group[] = [];
const infectionGroups: Group[] = [];
let parsingImmuneGroups = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Immune')) {
        parsingImmuneGroups = true;
    } else if (lines[i].startsWith('Infection')) {
        parsingImmuneGroups = false;
    } else {
        const matches = /(\d+) units each with (\d+) hit points (\(.*\) )?with an attack that does (\d+) (\S+) damage at initiative (\d+)/.exec(lines[i]);

        const numUnits = parseInt(matches[1]);
        const hp = parseInt(matches[2]);

        let weak: string[] = [], immune: string[] = [];
        if (matches[3]) {
            let [part1, part2] = matches[3].split('; ');
            part1 = part1?.replace(/[\(\)]/g, '');
            part2 = part2?.replace(/[\(\)]/g, '');
            if (part1?.startsWith('weak to')) {
                weak = part1.slice(7).split(',').map(x => x.trim());
            } else {
                immune = part1.slice(9).split(',').map(x => x.trim());
            }

            if (part2?.startsWith('weak to')) {
                weak = part2.slice(7).split(',').map(x => x.trim());
            } else if (part2) {
                immune = part2.slice(9).split(',').map(x => x.trim());
            }
        }

        const damage = parseInt(matches[4]);
        const damageType = matches[5];
        const init = parseInt(matches[6]);

        const g = new Group(0, '', numUnits, hp, weak, immune, damage, damageType, init);
        if (parsingImmuneGroups) {
            g.n = immuneGroups.length + 1;
            g.army = 'Immune System';
            immuneGroups.push(g);
        } else {
            g.n = infectionGroups.length + 1;
            g.army = 'Infection';
            infectionGroups.push(g);
        }
    }
}

const BOOST = 38;
for (const g of immuneGroups) {
    g.damage += BOOST;
}

// console.log(immuneGroups);
// console.log(infectionGroups);

while (true) {
    // Status
    console.log(`Immune System:`);
    for (const g of immuneGroups) { console.log(`Group ${g.n} contains ${g.units} units`); }
    if (immuneGroups.length === 0) { console.log(`No groups remain.`); }
    console.log(`Infection:`);
    for (const g of infectionGroups) { console.log(`Group ${g.n} contains ${g.units} units`); }
    if (infectionGroups.length === 0) { console.log(`No groups remain.`); }
    console.log();

    if (immuneGroups.length === 0 || infectionGroups.length === 0) { break; }

    // Target selection
    for (const g of immuneGroups) { g.selected = false; g.target = null; }
    for (const g of infectionGroups) { g.selected = false; g.target = null; }

    // const infectionTargets: number[] = [];
    infectionGroups.sort((a, b) => {
        if (b.effectivePower() === a.effectivePower()) { return b.init - a.init; }
        else { return b.effectivePower() - a.effectivePower(); }
    });
    for (let i = 0; i < infectionGroups.length; i++) {
        let maxDamage = 0;
        for (let j = 0; j < immuneGroups.length; j++) {
            if (immuneGroups[j].selected) { continue; }
            const damage = infectionGroups[i].units * calculateDamage(infectionGroups[i], immuneGroups[j]);
            console.log(`${infectionGroups[i].army} group ${infectionGroups[i].n} would deal defending group ${immuneGroups[j].n} ${damage} damage`);
            if (damage > maxDamage) {
                maxDamage = damage;
                infectionGroups[i].target = immuneGroups[j];
            } else if (damage === maxDamage) {
                if (immuneGroups[j].effectivePower() > infectionGroups[i].target?.effectivePower()) {
                    infectionGroups[i].target = immuneGroups[j];
                } else if (immuneGroups[j].effectivePower() === infectionGroups[i].target?.effectivePower()) {
                    if (immuneGroups[j].init > infectionGroups[i].target.init) {
                        infectionGroups[i].target = immuneGroups[j];
                    }
                }
            }
        }

        if (infectionGroups[i].target) {
            // console.log(`infection group ${infectionGroups[i].n} selecting target`);
            infectionGroups[i].target.selected = true;
        }
    }

    // const immuneTargets: number[] = [];
    immuneGroups.sort((a, b) => {
        if (b.effectivePower() === a.effectivePower()) { return b.init - a.init; }
        else { return b.effectivePower() - a.effectivePower(); }
    });
    for (let i = 0; i < immuneGroups.length; i++) {
        let maxDamage = 0;
        for (let j = 0; j < infectionGroups.length; j++) {
            if (infectionGroups[j].selected) { continue; }
            const damage = immuneGroups[i].units * calculateDamage(immuneGroups[i], infectionGroups[j]);
            console.log(`${immuneGroups[i].army} group ${immuneGroups[i].n} would deal defending group ${infectionGroups[j].n} ${damage} damage`);
            if (damage > maxDamage) {
                maxDamage = damage;
                immuneGroups[i].target = infectionGroups[j];
            } else if (damage === maxDamage) {
                if (infectionGroups[j].effectivePower() > immuneGroups[i].target?.effectivePower()) {
                    immuneGroups[i].target = infectionGroups[j];
                } else if (infectionGroups[j].effectivePower() === immuneGroups[i].target?.effectivePower()) {
                    if (infectionGroups[j].init > immuneGroups[i].target.init) {
                        infectionGroups[i].target = infectionGroups[j];
                    }
                }
            }
        }

        if (immuneGroups[i].target) {
            immuneGroups[i].target.selected = true;
        }
    }

    console.log();

    // Attack
    const allGroups: Group[] = [];
    allGroups.push(...immuneGroups);
    allGroups.push(...infectionGroups);
    allGroups.sort((a, b) => { return b.init - a.init; });

    for (const g of allGroups) {
        if (!g.target) { continue; }

        const damage = g.units * calculateDamage(g, g.target);
        const deaths = Math.min(g.target.units, Math.floor(damage / g.target.hp));
        console.log(`${g.army} group ${g.n} attacks defending group ${g.target.n}, killing ${deaths} units`);
        // console.log(g.army, g.n, damage);
        // console.log(g.target.army, g.target.n, g.target.hp);

        g.target.units -= deaths;
    }

    console.log();

    for (let i = immuneGroups.length - 1; i >= 0; i--) {
        if (immuneGroups[i].units === 0) { immuneGroups.splice(i, 1); }
    }
    for (let i = infectionGroups.length - 1; i >= 0; i--) {
        if (infectionGroups[i].units === 0) { infectionGroups.splice(i, 1); }
    }

    // console.log(`There are now ${immuneGroups.length} immune groups and ${infectionGroups.length} infection groups`);
}

if (immuneGroups.length > 0) {
    console.log(`YAY`);
    console.log(immuneGroups.map(x => x.units).reduce((a, b) => a + b, 0));
} else {
    console.log(`nope`);
    // console.log(infectionGroups.map(x => x.units).reduce((a, b) => a + b, 0));
}

function calculateDamage(attacker: Group, defender: Group): number {
    let damage = attacker.damage;

    if (defender.immune.includes(attacker.damageType)) {
        damage = 0;
    } else if (defender.weak.includes(attacker.damageType)) {
        damage *= 2;
    }

    return damage;
}
