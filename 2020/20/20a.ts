
import { readFileSync } from 'fs';
import { exit } from 'process';

class Tile {
    id: string;
    grid: string[][];
    top: string;
    left: string;
    right: string;
    bottom: string;

    constructor(id: string, g: string[][]) {
        this.id = id;
        this.grid = [];

        for (let r = 0; r < g.length; r++) {
            this.grid[r] = Array.from(g[r]);
        }

        this.top = this.grid[0].join('');
        this.bottom = this.grid[this.grid.length - 1].join('');

        this.left = '';
        this.right = '';
        for (let r = 0; r < this.grid.length; r++) {
            this.left += this.grid[r][0];
            this.right += this.grid[r][this.grid[0].length - 1];
        }
    }
}


const file = readFileSync('./20.test', 'utf-8');

const lines = file.split('\n');

const tiles: Tile[] = [];

let tileId = '';
let tileGrid: string[][] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
        if (tileId.length > 0) {
            tiles.push(new Tile(tileId, tileGrid));
            tileId = '';
            tileGrid = [];
        }
    }

    else if (lines[i].startsWith('Tile')) {
        tileId = lines[i].split(' ')[1].replace(':', '');
    } else {
        tileGrid.push(lines[i].split(''));
    }
}

console.log(tiles);
