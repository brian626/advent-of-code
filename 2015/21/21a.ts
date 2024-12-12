
import { readFileSync } from 'fs';
import { exit } from 'process';

class Item {
    name: string;
    cost: number;
    damage: number;
    armor: number;

    constructor(n: string, c: number, d: number, a: number) {
        this.name = n;
        this.cost = c;
        this.damage = d;
        this.armor = a;
    }
}

const weapons: Item[] = [
    new Item('Dagger', 8, 4, 0),
    new Item('Shortsword', 10, 5, 0),
    new Item('Warhammer', 25, 6, 0),
    new Item('Longsword', 40, 7, 0),
    new Item('Greataxe', 74, 8, 0),
];

const armor: Item[] = [
    new Item('Leather', 13, 0, 1),
    new Item('Chainmail', 31, 0, 2),
    new Item('Splintmail', 53, 0, 3),
    new Item('Bandedmail', 75, 0, 4),
    new Item('Platemail', 102, 0, 5),
];

const rings: Item[] = [
    new Item('Damage +1', 25, 1, 0),
    new Item('Damage +2', 50, 2, 0),
    new Item('Damage +3', 100, 3, 0),
    new Item('Defense +1', 20, 0, 1),
    new Item('Defense +2', 40, 0, 2),
    new Item('Defense +3', 80, 0, 3),
];

class Fighter {
    name: string;
    hp: number;
    damage: number;
    armor: number;

    constructor(n: string, h: number, d: number, a: number) {
        this.name = n;
        this.hp = h;
        this.damage = d;
        this.armor = a;
    }
}

const file = readFileSync('./21.input', 'utf-8');

const lines = file.split('\n');

let bossHp = 0;
let bossDamage = 0;
let bossArmor = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Hit')) { bossHp = parseInt(lines[i].split(' ')[2]); }
    else if (lines[i].startsWith('Damage')) { bossDamage = parseInt(lines[i].split(' ')[1]); }
    else if (lines[i].startsWith('Armor')) { bossArmor = parseInt(lines[i].split(' ')[1]); }
}

let minCost = Math.pow(2, 32);
const playerHp = 100;

while (true) {
    // Buy one weapon (five choices)
    for (let w = 0; w < weapons.length; w++) {
        const playerWeapon = weapons[w];

        // Buy zero or one armor (six choices)
        for (let a = 0; a <= armor.length; a++) {
            let playerArmor: Item = null;
            if (a !== armor.length) { playerArmor = armor[a]; }

            // Buy zero, one, or two rings (21 choices)
            for (let r1 = 0; r1 <= rings.length; r1++) {
                for (let r2 = 0; r2 <= rings.length; r2++) {
                    if (r1 === r2) { continue; }

                    let playerRing1: Item = null;
                    let playerRing2: Item = null;
                    if (r1 !== rings.length && r2 !== rings.length) {
                        playerRing1 = rings[r1];
                        playerRing2 = rings[r2];
                    } else if (r2 === rings.length) {
                        playerRing1 = rings[r1];
                    }

                    const boss: Fighter = new Fighter('Boss', bossHp, bossDamage, bossArmor);
                    const player: Fighter = new Fighter('Player', playerHp, 0, 0);

                    let totalCost = playerWeapon.cost;

                    console.log(`Player buys weapon ${playerWeapon.name} for cost ${playerWeapon.cost}`);
                    player.damage = playerWeapon.damage;

                    if (playerArmor) {
                        console.log(`Player buys armor ${playerArmor.name} for cost ${playerArmor.cost}`);
                        totalCost += playerArmor.cost;
                        player.armor = playerArmor.armor;
                    } else {
                        console.log(`Player buys no armor`);
                    }

                    if (playerRing1) {
                        console.log(`Player buys ring 1 ${playerRing1.name} for cost ${playerRing1.cost}`);
                        totalCost += playerRing1.cost;
                        player.damage += playerRing1.damage;
                        player.armor += playerRing1.armor;

                        if (playerRing2) {
                            console.log(`Player buys ring 2 ${playerRing2.name} for cost ${playerRing2.cost}`);
                            totalCost += playerRing2.cost;
                            player.damage += playerRing2.damage;
                            player.armor += playerRing2.armor;
                        }
                    } else {
                        console.log(`Player buys no rings`);
                    }

                    if (totalCost > minCost) {
                        console.log(`combination is too expensive, skipping`);
                        console.log();
                        continue;
                    }

                    console.log(`Total cost: ${totalCost}`);

                    console.log(player);
                    console.log(boss);

                    const winner = fight(player, boss);
                    console.log(winner);
                    console.log();

                    if (winner === player.name) {
                        minCost = Math.min(totalCost, minCost);
                    }
                }
            }
        }
    }

    break;
}

console.log(minCost);


function fight(p1: Fighter, p2: Fighter): string {
    while (p1.hp > 0 && p2.hp > 0) {
        const p1Damage = p1.damage - p2.armor;
        p2.hp -= p1Damage;
        console.log(`The player deals ${p1.damage}-${p2.armor} = ${p1.damage - p2.armor} damage; the boss goes down to ${p2.hp} hit points.`);
        if (p2.hp <= 0) { break; }

        const p2Damage = p2.damage - p1.armor;
        p1.hp -= p2Damage;
        console.log(`The boss deals ${p2.damage}-${p1.armor} = ${p2.damage - p1.armor} damage; the player goes down to ${p1.hp} hit points.`);
    }

    return p1.hp <= 0 ? p2.name : p1.name;
}
