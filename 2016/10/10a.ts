
import { readFileSync } from 'fs';
import { exit } from 'process';

class Bot {
    name: string;
    chips: number[];
    lowTarget: [string, string];
    highTarget: [string, string];

    constructor(s: string) {
        this.name = s;
        this.chips = [];
        this.lowTarget = ['', ''];
        this.highTarget = ['', ''];
    }
}

const file = readFileSync('./10.input', 'utf-8');

const lines = file.split('\n');

const bots: Map<string, Bot> = new Map<string, Bot>();
const outputs: number[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    if (lines[i].startsWith('value')) {
        const [_1, v, _2, _3, _4, b] = lines[i].split(' ');
        const bot = bots.get(b) || new Bot(b);
        bot.chips.push(parseInt(v));
        bots.set(b, bot);
    } else {
        const matches = /bot (\d+) gives (high|low) to (output|bot) (\d+) and (high|low) to (output|bot) (\d+)/.exec(lines[i]);
        // console.log(matches);
        const b = matches[1];
        const bot = bots.get(b) || new Bot(b);
        if (matches[2] === 'high') {
            bot.highTarget = [matches[3], matches[4]];
        } else {
            bot.lowTarget = [matches[3], matches[4]];
        }

        if (matches[5] === 'high') {
            bot.highTarget = [matches[6], matches[7]];
        } else {
            bot.lowTarget = [matches[6], matches[7]];
        }

        bots.set(b, bot);
    }
}

// console.log(bots);

const VALUEA = 61, VALUEB = 17;

let safety = 0;
while (true) {
    safety++;
    if (safety > 100000) { break; }
    let didSomething = false;

    for (const [name, bot] of bots) {
        if (bot.chips.length === 2) {
            if (bot.chips.includes(VALUEA) && bot.chips.includes(VALUEB)) {
                console.log(`bot ${name} is responsible for comparing value-${VALUEA} with value-${VALUEB} microchips`);
            }

            // console.log(`bot ${bot.name} has 2 chips`);
            didSomething = true;

            const lowChip = Math.min(...bot.chips);
            const [lowBotOrOutput, lowName] = bot.lowTarget;
            if (lowBotOrOutput === 'bot') {
                // console.log(`  giving low chip ${lowChip} to bot ${lowName}`);
                const targetBot = bots.get(lowName);
                targetBot.chips.push(lowChip);
                bots.set(lowName, targetBot);
            } else {
                outputs[parseInt(lowName)] = lowChip;
            }

            const highChip = Math.max(...bot.chips);
            const [highBotOrOutput, highName] = bot.highTarget;
            if (highBotOrOutput === 'bot') {
                // console.log(`  giving high chip ${highChip} to bot ${highName}`);
                const targetBot = bots.get(highName);
                targetBot.chips.push(highChip);
                bots.set(highName, targetBot);
            } else {
                outputs[parseInt(highName)] = highChip;
            }

            bot.chips = [];
            bots.set(bot.name, bot);
            break;
        }
    }

    // console.log(bots);
    // console.log();

    if (!didSomething) { break; }
}

// console.log(bots);
console.log(outputs);
