
import { readFileSync } from 'fs';
import { exit } from 'process';

class Aunt {
    num: number;
    children: number;
    cats: number;
    samoyeds: number;
    pomeranians: number;
    akitas: number;
    vizslas: number;
    goldfish: number;
    trees: number;
    cars: number;
    perfumes: number;

    constructor(n: number) {
        this.num = n;
        this.children = -1;
        this.cats = -1;
        this.samoyeds = -1;
        this.pomeranians = -1;
        this.akitas = -1;
        this.vizslas = -1;
        this.goldfish = -1;
        this.trees = -1;
        this.cars = -1;
        this.perfumes = -1;
    }
}

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

const aunts: Aunt[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    // Sue 1: goldfish: 6, trees: 9, akitas: 0

    const [_1, num, thing1, count1, thing2, count2, thing3, count3] = lines[i].split(' ');

    const aunt = new Aunt(parseInt(num.slice(0, -1)));
    aunt[thing1.slice(0, -1)] = parseInt(count1.slice(0, -1));
    aunt[thing2.slice(0, -1)] = parseInt(count2.slice(0, -1));
    aunt[thing3.slice(0, -1)] = parseInt(count3);

    aunts.push(aunt);
}

const threeKids = aunts.filter(x => (x.children === -1 || x.children === 3));
const sevenCats = threeKids.filter(x => (x.cats > 7 || x.cats === -1));
const twoSamoyeds = sevenCats.filter(x => (x.samoyeds === 7 || x.samoyeds === -1));
const threePomeranians = twoSamoyeds.filter(x => (x.pomeranians < 3 || x.pomeranians === -1));
const zeroAkitas = threePomeranians.filter(x => (x.akitas === 0 || x.akitas === -1));
const zeroViszlas = zeroAkitas.filter(x => (x.vizslas === 0 || x.vizslas === -1));
const fiveGoldfish = zeroViszlas.filter(x => (x.goldfish < 5 || x.goldfish === -1));
const threeTrees = fiveGoldfish.filter(x => (x.trees > 3 || x.trees === -1));
const twoCars = threeTrees.filter(x => (x.cars === 2 || x.cars === -1));
const onePerfume = twoCars.filter(x => (x.perfumes === 1 || x.perfumes === -1));

console.log(onePerfume.length);
console.log(onePerfume[0].num);
