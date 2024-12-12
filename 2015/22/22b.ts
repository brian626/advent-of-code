
import { randomUUID, UUID } from 'crypto';
import { readFileSync } from 'fs';
import { exit, mainModule } from 'process';

const DEBUG = false;

const file = readFileSync('./22.input', 'utf-8');

class Fighter {
    name: string;
    hp: number;
    damage: number;
    armor: number;
    mana: number;
    manaSpent: number;
    actions: string[];
    spells: any[];
    activeSpells: any[];

    constructor(name = '', hp = 0, damage = 0, armor = 0, mana = 0, manaSpent = 0, actions = []) {
        this.name = name;
        this.hp = hp;
        this.damage = damage;
        this.armor = armor;
        this.mana = mana;
        this.manaSpent = manaSpent;
        this.actions = actions;
        this.spells = [
            {
                name: 'Magic Missile',
                manaCost: 53,
                effect: {
                    damage: 4
                }
            },
            {
                name: 'Drain',
                manaCost: 73,
                effect: {
                    damage: 2,
                    healing: 2
                }
            },
            {
                name: 'Shield',
                manaCost: 113,
                effect: {
                    armor: 7,
                },
                duration: 6
            },
            {
                name: 'Poison',
                manaCost: 173,
                effect: {
                    damage: 3,
                },
                duration: 6
            },
            {
                name: 'Recharge',
                manaCost: 229,
                effect: {
                    manaGain: 101,
                },
                duration: 5
            }
        ];
        this.activeSpells = [];
    }

    duplicate(): Fighter {
        const newFighter = new Fighter();
        newFighter.name = this.name;
        newFighter.hp = this.hp;
        newFighter.damage = this.damage;
        newFighter.armor = this.armor
        newFighter.mana = this.mana;
        newFighter.manaSpent = this.manaSpent;
        // newFighter.actions = Array.from(this.actions);
        for (const a of this.actions) {
            newFighter.actions.push(a);
        }
        newFighter.spells = Array.from(this.spells);
        // newFighter.activeSpells = Array.from(this.activeSpells);
        for (const s of this.activeSpells) {
            newFighter.activeSpells.push(Object.assign({}, s));
        }
        return newFighter;
    }

    takeTurn(opponent: Fighter) {
        if (this.activeSpells.length > 0) {
            debug(`  there are ${this.activeSpells.length} spells active`);
            this.actions.push(`    there are ${this.activeSpells.length} spells active: ${this.activeSpells.map(x => x.name + ', ' + x.duration + ' turns left')}`);
        }
        for (let i = 0; i < this.activeSpells.length; i++) {
            const spell = this.activeSpells[i];
            if (spell.duration > 0) {
                spell.duration--;
                if (spell.effect.damage) {
                    opponent.hp -= spell.effect.damage;
                    debug(`  ${opponent.name} takes ${spell.effect.damage} points of damage from ${spell.name}, leaving them with ${opponent.hp}`);
                    this.actions.push(`    ${opponent.name} takes ${spell.effect.damage} points of damage from ${spell.name}, leaving them with ${opponent.hp}. Spell has ${spell.duration} turns left.`);
                }
                if (spell.effect.manaGain) {
                    this.mana += spell.effect.manaGain;
                    debug(`  ${this.name} gains ${spell.effect.manaGain} points of mana from ${spell.name}, leaving them with ${this.mana}`);
                    this.actions.push(`    ${this.name} gains ${spell.effect.manaGain} points of mana from ${spell.name}, leaving them with ${this.mana}. Spell has ${spell.duration} turns left.`);
                }

                if (spell.duration === 0) {
                    if (spell.name === 'Shield') {
                        debug(`  ${this.name} loses 7 armor`);
                        this.actions.push(`    ${this.name} loses 7 armor`);
                        this.armor = 0;
                    } else {
                        debug(`  ${spell.name} fades`);
                        this.actions.push(`    ${spell.name} fades`);
                    }
                }
            }
        }
    }

    attack(opponent: Fighter, spellName: string) {
        if (this.hp <= 0) { return; }
        debug(`- ${this.name} attacks with ${this.hp} hp, ${this.mana} mana, and ${this.armor} armor!`);

        if (this.name === 'Boss') {
            opponent.hp -= Math.max(1, this.damage - opponent.armor);
            debug(`  ${opponent.name} takes ${this.damage} - ${opponent.armor} = ${Math.max(1, this.damage - opponent.armor)} points of damage, leaving them with ${opponent.hp}`);
            this.actions.push(`    ${opponent.name} takes ${this.damage} - ${opponent.armor} = ${Math.max(1, this.damage - opponent.armor)} points of damage, leaving them with ${opponent.hp}`);
        } else {
            // this.actions.push(spellName);
            const spell = this.spells.find(x => x.name === spellName);
            this.manaSpent += spell.manaCost;
            this.mana -= spell.manaCost;

            debug(`  ${this.name} casts ${spellName} for ${spell.manaCost} mana, leaving them with ${this.mana} mana (${this.manaSpent} mana spent so far)`);
            this.actions.push(`  ${this.name} casts ${spellName} for ${spell.manaCost} mana, leaving them with ${this.mana} mana (${this.manaSpent} mana spent so far)`);
            if (spell.duration) {
                const newSpell = {
                    name: spellName,
                    effect: spell.effect,
                    duration: spell.duration
                };
                if (newSpell.name === 'Shield') {
                    debug(`  ${this.name} gains 7 armor`);
                    this.actions.push(`    ${this.name} gains 7 armor`);
                    this.armor = 7;
                }
                debug(`  adding ${newSpell.name} to active spells`);
                this.actions.push(`    adding ${newSpell.name} to active spells with ${newSpell.duration} turns left`);
                this.activeSpells.push(newSpell);
            } else {
                if (spell.effect.damage) {
                    opponent.hp -= spell.effect.damage;
                    debug(`  ${opponent.name} takes ${spell.effect.damage} points of damage from ${spell.name}, leaving them with ${opponent.hp}`);
                    this.actions.push(`    ${opponent.name} takes ${spell.effect.damage} points of damage from ${spell.name}, leaving them with ${opponent.hp}`);
                }
                if (spell.effect.healing) {
                    this.hp += spell.effect.healing;
                    this.actions.push(`    ${this.name} heals ${spell.effect.healing} points of damage from ${spell.name}, leaving them with ${this.hp}`);
                }
            }
        }
    }
}


const lines = file.split('\n');

let bossHp = -1, bossDamage = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('Hit')) { bossHp = parseInt(lines[i].split(' ')[2]); }
    else if (lines[i].startsWith('Damage')) { bossDamage = parseInt(lines[i].split(' ')[1]); }
}

const boss = new Fighter('Boss', bossHp, bossDamage);

const playerHp = 50;
const playerMana = 500;
const player = new Fighter('Player', playerHp, 0, 0, playerMana);

let minMana = Infinity;

function play(player: Fighter, boss: Fighter, recursionDepth: number = 0) {
    debug(`play() ${player.name} has ${player.hp} hp and ${player.mana} mana, ${boss.name} has ${boss.hp} hp, depth ${recursionDepth}`);
    debug(`-----`);
    debug(`game state before turns`);
    debug(`${player.name} has ${player.hp} hp and ${player.mana} mana, ${boss.name} has ${boss.hp} hp`);
    debug(`active spells are ${player.activeSpells.map(x => x.name + ' with duration ' + x.duration)}`);
    debug(`-----`);

    for (let i = 0; i < player.spells.length; i++) {
        let spellAlreadyActive = false;

        for (let j = 0; j < player.activeSpells.length; j++) {
            if (player.activeSpells[j].duration > 1 && player.activeSpells[j].name === player.spells[i].name) {
                spellAlreadyActive = true;
                break;
            }
        }

        if (spellAlreadyActive) {
            debug(`  skipping spell ${player.spells[i].name} since it's currently active`);
            continue;
        }
        if (player.spells[i].manaCost > player.mana) {
            debug(`  skipping spell ${player.spells[i].name} since player doesn't have enough mana`);
            continue;
        }

        const newPlayer = player.duplicate();
        const newBoss = boss.duplicate();

        newPlayer.hp--;

        newPlayer.actions.push(`-- Player turn --`);
        newPlayer.takeTurn(newBoss);
        newBoss.takeTurn(newPlayer);
        newPlayer.attack(newBoss, player.spells[i].name);

        newPlayer.actions.push(`-- Boss turn --`);
        newPlayer.takeTurn(newBoss);
        newBoss.takeTurn(newPlayer);
        newBoss.attack(newPlayer, '');

        debug(`-----`);
        debug(`game state after both turns`);
        debug(`${newPlayer.name} has ${newPlayer.hp} hp and ${newPlayer.mana} mana, ${newBoss.name} has ${newBoss.hp} hp`);
        debug(`active spells are ${newPlayer.activeSpells.map(x => x.name)}`);
        debug(`-----`);
        debug();

        if (newPlayer.hp > 0 && newBoss.hp > 0 && newPlayer.manaSpent < minMana) {
            debug(`starting a subgame with depth ${recursionDepth + 1}`);
            play(newPlayer, newBoss, recursionDepth + 1);
        } else if (newPlayer.hp <= 0) {
            console.log(`boss won, player spent ${newPlayer.manaSpent} mana`);
            console.log(`actions were:`)
            console.log(newPlayer.actions);
            console.log();
            break;
        } else if (newBoss.hp <= 0) {
            console.log(`player won after spending ${newPlayer.manaSpent} mana`);
            console.log(`actions were:`)
            console.log(newPlayer.actions);
            console.log();
            minMana = Math.min(minMana, newPlayer.manaSpent);
            break;
        } else {
            debug(`pruning game because ${newPlayer.manaSpent} < ${minMana}`);
            break;
        }

        debug();
    }

    debug(`game at depth ${recursionDepth} ending`);
}

play(player, boss);
console.log(`min mana to win: ${minMana}`);

function debug(s = '') {
    if (DEBUG) {
        console.log(s);
    }
}
