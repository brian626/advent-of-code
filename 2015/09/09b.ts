
import { readFileSync } from 'fs';
import { exit } from 'process';
import { permutations } from '../../common/permutations';

const file = readFileSync('./09.input', 'utf-8');

const lines = file.split('\n');

class City {
    name: string;
    distances: Map<string, number> = new Map<string, number>();
}

const cityMap: Map<string, City> = new Map<string, City>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    const [city1, _1, city2, _2, distance] = lines[i].split(' ');

    let c = cityMap.get(city1);
    if (c === undefined) {
        c = new City();
        c.name = city1;
    }
    c.distances.set(city2, parseInt(distance));
    cityMap.set(city1, c);

    c = cityMap.get(city2);
    if (c === undefined) {
        c = new City();
        c.name = city2;
    }
    c.distances.set(city1, parseInt(distance));
    cityMap.set(city2, c);
}

// console.log(cityMap);

const cities: City[] = [];
for (const [_, v] of cityMap.entries()) {
    cities.push(v);
}

// console.log(cities);

const mySet = new Set(cities);
const perms = permutations(mySet);

// console.log(perms);

let maxTotalDistance = -1;

for (const p of perms) {
    let totalDistance = 0;
    for (let i = 0; i < p.length - 1; i++) {
        // console.log(`adding distance between ${p[i].name} and ${p[i+1].name} which is ${cityMap.get(p[i].name).distances.get(p[i+1].name)}`);
        totalDistance += cityMap.get(p[i].name).distances.get(p[i+1].name);
    }

    // console.log(totalDistance);

    maxTotalDistance = Math.max(maxTotalDistance, totalDistance);
}

console.log(maxTotalDistance);
