
import { readFileSync } from 'fs';
import { exit } from 'process';
import { Trie } from '../../common/trie';

const file = readFileSync('./19.input', 'utf-8');

const lines = file.split('\n');

let patterns: string[] = [];
const designs: string[] = [];

let parsingPatterns = true;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { parsingPatterns = false; continue; }

    if (parsingPatterns) {
        patterns = lines[i].split(', ');
    } else {
        designs.push(lines[i]);
    }
}


const trie = Trie.buildTrie(patterns);

const waysCache: Map<string, number> = new Map<string, number>();

function countWays(w: string): number {
    if (waysCache.has(w)) {
        return waysCache.get(w);
    }

    let ways = 0;
    for (let j = 1; j <= w.length; j++) {
        if (trie.searchTrie(w.slice(0, j))) {
            if (w.slice(j).length === 0) {
                ways += 1;
            } else {
                ways += countWays(w.slice(j));
            }
        }
    }

    waysCache.set(w, ways);
    return ways;
}

let ways = 0;
for (const d of designs) {
    ways += countWays(d);
}
console.log(ways);
