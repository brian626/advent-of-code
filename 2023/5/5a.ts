
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./5.input', 'utf-8');

const lines = file.split('\n');

class CategoryMap {
    destinationStart: number;
    sourceStart: number;
    rangeLength: number;

    constructor(d: number, s: number, r: number) {
        this.destinationStart = d;
        this.sourceStart = s;
        this.rangeLength = r;
    }
}

let seeds: number[];
let seedToSoilMaps: CategoryMap[] = [];
let soilToFertilizerMaps: CategoryMap[] = [];
let fertilizerToWaterMaps: CategoryMap[] = [];
let waterToLightMaps: CategoryMap[] = [];
let lightToTemperatureMaps: CategoryMap[] = [];
let temperatureToHumidityMaps: CategoryMap[] = [];
let humidityToLocationMaps: CategoryMap[] = [];

let i = 0;
while (i < lines.length) {
    // console.log(`line ${i}: ${lines[i]}`);
    if (lines[i].length === 0) { i++; continue; }

    const parts = lines[i].split(':');

    if (parts[0] === 'seeds') {
        seeds = parts[1].trim().split(' ').map(x => parseInt(x));
        i++;
    } else if (parts[0] === 'seed-to-soil map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            seedToSoilMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'soil-to-fertilizer map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            soilToFertilizerMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'fertilizer-to-water map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            fertilizerToWaterMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'water-to-light map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            waterToLightMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'light-to-temperature map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            lightToTemperatureMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'temperature-to-humidity map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            temperatureToHumidityMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else if (parts[0] === 'humidity-to-location map') {
        i++;
        while (lines[i].length > 0) {
            const mapParts = lines[i].split(' ').map(x => parseInt(x));
            humidityToLocationMaps.push(new CategoryMap(mapParts[0], mapParts[1], mapParts[2]));
            i++;
        }
    } else {
        i++;
    }
}

// console.log(seeds);
// console.log(seedToSoilMaps);
// console.log(soilToFertilizerMaps);
// console.log(fertilizerToWaterMaps);

let minLocation = Math.pow(2,32);
for (const seed of seeds) {
    const soil = mapXtoY(seed, seedToSoilMaps);
    const fertilizer = mapXtoY(soil, soilToFertilizerMaps);
    const water = mapXtoY(fertilizer, fertilizerToWaterMaps);
    const light = mapXtoY(water, waterToLightMaps);
    const temperature = mapXtoY(light, lightToTemperatureMaps);
    const humidity = mapXtoY(temperature, temperatureToHumidityMaps);
    const location = mapXtoY(humidity, humidityToLocationMaps);
    minLocation = Math.min(minLocation, location);
}

console.log(minLocation);

function mapXtoY(n: number, maps: CategoryMap[]): number {
    for (const map of maps) {
        if (n >= map.sourceStart && n <= map.sourceStart + map.rangeLength) {
            return map.destinationStart + (n - map.sourceStart);
        }
    }

    return n;
}
