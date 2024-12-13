
import { readFileSync } from 'fs';
import { exit } from 'process';
import { powerset } from '../../common/powerset';

// Parsing seems like a nightmare - just hardcode...

class State {
    elevatorFloor: number;
    floors: string[][];
    steps: number;

    constructor() {
        this.elevatorFloor = 0;
        this.floors = [];
        this.floors[0] = [];
        this.floors[1] = [];
        this.floors[2] = [];
        this.floors[3] = [];
        this.steps = 0;
    }

    duplicate(): State {
        const newState = new State();
        newState.elevatorFloor = this.elevatorFloor;
        newState.floors = [];
        newState.floors[0] = Array.from(this.floors[0]);
        newState.floors[1] = Array.from(this.floors[1]);
        newState.floors[2] = Array.from(this.floors[2]);
        newState.floors[3] = Array.from(this.floors[3]);
        newState.steps = this.steps;
        return newState;
    }

    encode(): string {
        return `${this.elevatorFloor}|${this.floors[0]}|${this.floors[1]}|${this.floors[2]}|${this.floors[3]}`;
    }

    static decode(s: string): [number, string[], string[], string[], string[]] {
        const parts = s.split('|');
        return [parseInt(parts[0]), parts[1].split(','), parts[2].split(','), parts[3].split(','), parts[4].split(',')];
    }

    finished(): boolean {
        return this.isFloorEmpty(0) && this.isFloorEmpty(1) && this.isFloorEmpty(2);
    }

    isFloorEmpty(n: number): boolean {
        return this.floors[n].length === 0;
    }
}

const states: State[] = [];

const initialState = new State();

// Test
// initialState.floors[0] = ['HM', 'LM'];
// initialState.floors[1] = ['HG'];
// initialState.floors[2] = ['LG'];
// initialState.floors[3] = [];

// Real input
initialState.floors[0] = ['ThuG', 'ThuM', 'PluG', 'StrG', 'EleG', 'EleM', 'DilG', 'DilM'];
initialState.floors[1] = ['PluM', 'StrM'];
initialState.floors[2] = ['ProG', 'ProM', 'RutG', 'RutM'];
initialState.floors[3] = [];

states.push(initialState);

const seenStates: Set<string> = new Set<string>();
let finishedState: State = null;

let iterations = 0;
while (states.length > 0) {
    const currentState = states.pop();
    iterations++;
    if (iterations % 1000 === 0) {
        console.log(`${currentState.steps} steps, ${states.length} states`);
    }

    seenStates.add(currentState.encode());
    if (currentState.finished()) { finishedState = currentState; break; }

    // Determine possible next moves
    const itemsOnElevatorsFloor = currentState.floors[currentState.elevatorFloor];

    // What can we move up a floor?
    if (currentState.elevatorFloor < 3) {
        const itemCombinations: string[][] = powerset(itemsOnElevatorsFloor).filter(x => x.length > 0);
        let movedTwoItemsUp = false;

        for (let combo of itemCombinations) {
            combo = combo.filter(x => x.length > 0 || x.length < 2);
            if (combo.length === 0 || combo.length > 2) { continue; }
            if (movedTwoItemsUp && combo.length === 1) { continue; }
            // console.log(`Considering moving combo [${combo}] with length ${combo.length} up`);
            if (safeToMove(combo, currentState.floors[currentState.elevatorFloor + 1])) {
                // console.log(`Step #${currentState.steps + 1}: It is safe to move [${combo.map(x => `'${x}'`)}] up to floor ${currentState.elevatorFloor + 2}`);
                if (combo.length === 2) { movedTwoItemsUp = true; }

                const newState = currentState.duplicate();
                for (const item of combo) {
                    newState.floors[currentState.elevatorFloor].splice(newState.floors[currentState.elevatorFloor].indexOf(item), 1);
                    newState.floors[currentState.elevatorFloor + 1].push(item);
                }
                newState.elevatorFloor++;
                newState.steps++;

                if (!seenStates.has(newState.encode())) {
                    // console.log(`U: adding ${newState.encode()}`);
                    states.push(newState);
                }
            }
        }
    }

    // What can we move down a floor?
    if (currentState.elevatorFloor > 0) {
        const itemCombinations: string[][] = powerset(itemsOnElevatorsFloor).filter(x => x.length > 0);
        let movedOneItemDown = false;

        for (let combo of itemCombinations) {
            combo = combo.filter(x => x.length > 0);
            if (combo.length === 0 || combo.length > 2) { continue; }
            if (movedOneItemDown && combo.length === 2) { continue; }
            // Don't bother moving items down to empty floors
            if ((currentState.elevatorFloor === 1 && currentState.isFloorEmpty(0)) ||
                (currentState.elevatorFloor === 2 && currentState.isFloorEmpty(0) && currentState.isFloorEmpty(1))) {
                    continue;
            }

            // console.log(`Considering moving combo [${combo}] with length ${combo.length} down`);
            if (safeToMove(combo, currentState.floors[currentState.elevatorFloor - 1])) {
                // console.log(`Step #${currentState.steps + 1}: It is safe to move [${combo.map(x => `'${x}'`)}] down to floor ${currentState.elevatorFloor}`);
                if (combo.length === 1) { movedOneItemDown = true; }

                const newState = currentState.duplicate();
                for (const item of combo) {
                    newState.floors[currentState.elevatorFloor].splice(newState.floors[currentState.elevatorFloor].indexOf(item), 1);
                    newState.floors[currentState.elevatorFloor - 1].push(item);
                }
                newState.elevatorFloor--;
                newState.steps++;

                if (!seenStates.has(newState.encode())) {
                    // console.log(`D: adding ${newState.encode()}`);
                    states.push(newState);
                }
            }
        }
    }

    // console.log();
}

if (finishedState) {
    // console.log(finishedState.encode());
    console.log(finishedState.steps);
} else {
    console.log(`Didn't find a solution.`);
}

function safeToMove(itemsToMove: string[], itemsInPlace: string[]): boolean {
    const combinedItems = itemsToMove.concat(itemsInPlace);
    const combinedMicrochips = combinedItems.filter(x => x.endsWith('M')).map(x => x.slice(0, -1));
    const combinedGenerators = combinedItems.filter(x => x.endsWith('G')).map(x => x.slice(0, -1));
    for (const m of combinedMicrochips) {
        if (combinedGenerators.length > 0 && !combinedGenerators.includes(m)) {
            return false;
        }
    }

    return true;
}
