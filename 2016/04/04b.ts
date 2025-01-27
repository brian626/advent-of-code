
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./04.input', 'utf-8');

const lines = file.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    console.log(isReal(lines[i]));
}



function isReal(s: string): [number, string] {
    const matches = /([a-z-]+)(\d+)\[(\S*)\]/.exec(s);
    // console.log(matches);
    const encryptedName = matches[1];
    const sectorId = parseInt(matches[2]);
    const checksum = matches[3];

    if (checksum === calculateChecksum(encryptedName.replace(/-/g, ''))) {
        return [sectorId, decryptName(encryptedName.slice(0, -1), sectorId)];
    } else {
        return [0, ''];
    }
}


function calculateChecksum(s: string): string {
    const letterMap: Map<string, number> = new Map<string, number>();
    for (const c of s) {
        letterMap.set(c, (letterMap.get(c) || 0) + 1);
    }

    const top5Counts: Set<number> = new Set<number>(Array.from(letterMap.values()).sort((a, b) => b - a).slice(0, 5));

    let checksum = '';
    for (const c of top5Counts) {
        const letters: string[] = [];
        for (const [k, v] of letterMap) {
            if (c === v) {
                letters.push(k);
            }
        }

        letters.sort((a, b) => a.localeCompare(b));

        checksum += letters.join('');
    }

    // console.log(s, checksum.slice(0, 5));
    return checksum.slice(0, 5);
}


function decryptName(s: string, id: number): string {
    let decrypted = '';

    for (const c of s) {
        if (c === '-') {
            decrypted += ' ';
        } else {
            let n = c.charCodeAt(0) + id;
            while (n > 'z'.charCodeAt(0)) { n -= 26; }
            decrypted += String.fromCharCode(n);
        }
    }

    return decrypted;
}
