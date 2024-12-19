
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

let count = 0;
for (const d of designs) {
    if (canMake(d)) { count++; }
}
console.log(count);

function canMake(word: string): boolean {
    let search = [word];
    let foundWord = false;
    while (search.length > 0) {
        console.log(search);
        const w = search.shift();
        for (let i = 1; i <= w.length; i++) {
            if (trie.searchTrie(w.slice(0,i))) {
                if (w.slice(i).length === 0) {
                    console.log(`found ${w.slice(0,i)}, all done`);
                    foundWord = true;
                } else {
                    console.log(`found ${w.slice(0,i)}, pushing ${w.slice(i)}`);
                    if (!search.includes(w.slice(i))) {
                        search.push(w.slice(i));
                    }
                }
            } else {
                console.log(`didn't find ${w.slice(0,i)}`);
            }
        }
    }

    return foundWord;
}


// function canMake(design: string): boolean {
//     const trie: Map<string, string[]> = new Map<string, string[]>();
//     trie.set('', [design]);

//     while (!trie.has(design)) {
//         for (const [prefix, suffixes] of trie) {
//             for (const suffix of suffixes) {
//                 for (let i = 0; i < patterns.length; i++) {
//                     if (suffix.startsWith(patterns[i])) {
//                         const newPrefix = prefix + patterns[i];
//                         console.log(`suffix ${suffix} starts with ${patterns[i]}, new prefix is ${newPrefix}, remainder is ${suffix.slice(newPrefix.length)}`);
//                         const temp = trie.get(newPrefix) || [];
//                         temp.push(suffix.slice(newPrefix.length));
//                         trie.set(newPrefix, temp);
//                     }
//                 }
//             }
//         }

//         console.log(trie);
//         break;
//     }

//     return true;
// }

// // function canMake(design: string): boolean {
// //     console.log(`considering design ${design}`);
// //     let r = true;

// //     while (design.length > 0) {
// //         const matches = patterns.filter(x => design.startsWith(x));
// //         if (matches.length === 1) {
// //             // console.log(`pattern ${matches[0]} matches!`);
// //             design = design.slice(matches[0].length);
// //         } else if (matches.length > 1) {
// //             let foundMatch = true;
// //             for (let i = 0; i < matches.length; i++) {
// //                 console.log(`multiple matches, trying ${matches[i]} + sub-design ${design.slice(matches[i].length)}`);
// //                 const match = canMake(design.slice(matches[i].length));
// //                 if (!match) {
// //                     console.log(`uh oh no matches for ${design}`);
// //                     foundMatch = false;
// //                 } else {
// //                     console.log(`yay, ${matches[i]} matches for ${design}`);
// //                 }
// //             }

// //             if (!foundMatch) {
// //                 break;
// //             }
// //         } else {
// //             console.log(`uh oh no matches for ${design}`);
// //             r = false;
// //             break;
// //         }
// //     }

// //     if (r) { console.log(`we can make '${design}'!`); }
// //     console.log();

// //     return r;
// // }
