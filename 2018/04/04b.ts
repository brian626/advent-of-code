
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./04.input', 'utf-8');

enum EventType {
    BeginsShift,
    FallsAsleep,
    WakesUp
}

class Event {
    guardId: string;
    type: EventType;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    epochTime: number;

    constructor(id: string, timestamp: string, eventText: string) {
        this.guardId = id;

        if (eventText === 'begins shift') { this.type = EventType.BeginsShift; }
        else if (eventText === 'falls asleep') { this.type = EventType.FallsAsleep; }
        else if (eventText === 'wakes up') { this.type = EventType.WakesUp; }

        const [ymd, hm] = timestamp.split(' ');
        [this.year, this.month, this.day] = ymd.split('-').map(x => parseInt(x));
        [this.hour, this.minute] = hm.split(':').map(x => parseInt(x));

        this.epochTime = (this.minute * 60) +
                         (this.hour * 3600) +
                         (this.day * 86400) +
                         (this.month * 2678400) +
                         (this.year * 32140800);
    }
}

const lines = file.split('\n');

const events: Event[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const match = /\[([\d -:]+)\] (.*)/.exec(lines[i]);
    // console.log(match[1], match[2]);
    const timestamp = match[1];
    let eventText = match[2];

    let guardId = '';
    if (eventText.startsWith('Guard')) {
        const [id, word1, word2] = eventText.slice(7).split(' ');
        guardId = id;
        eventText = [word1, word2].join(' ');
    }

    // console.log(guardId, timestamp, eventText);
    events.push(new Event(guardId, timestamp, eventText));
}


events.sort((a, b) => a.epochTime - b.epochTime);

let guardId = '';
for (const e of events) {
    if (e.guardId !== '') {
        guardId = e.guardId;
    } else {
        e.guardId = guardId;
    }
}

console.log(events);

const minutesAsleep: Map<number, string[]> = new Map<number, string[]>();

let currentGuardId = '';
let sleepStartHour = 0, sleepStartMinute = 0;
for (const e of events) {
    if (e.type === EventType.BeginsShift) {
        currentGuardId = e.guardId;
        console.log(`guard ${currentGuardId} begins shift`);
    } else if (e.type === EventType.FallsAsleep) {
        sleepStartHour = e.hour;
        sleepStartMinute = e.minute;
        console.log(`guard ${currentGuardId} falls asleep at ${e.epochTime}`);
    } else if (e.type === EventType.WakesUp) {
        // const m = (e.epochTime - sleepStart) / 60;
        // console.log(`guard ${currentGuardId} wakes up after ${m} minutes`);

        for (let i = sleepStartHour * 60 + sleepStartMinute; i < e.hour * 60 + e.minute; i++) {
            if (minutesAsleep.has(i)) {
                const guardIds = minutesAsleep.get(i);
                guardIds.push(currentGuardId);
                minutesAsleep.set(i, guardIds);
            } else {
                minutesAsleep.set(i, [currentGuardId]);
            }
        }
    }
}

// console.log(minutesAsleep);

let sleepiestGuardId = '';
let sleepiestMinute = 0;
let maxMinutesAsleep = 0;
for (const [minute, guardIds] of minutesAsleep) {
    const guardIdCount: Map<string, number> = new Map<string, number>();
    for (const g of guardIds) {
        if (guardIdCount.has(g)) {
            guardIdCount.set(g, guardIdCount.get(g) + 1);
        } else {
            guardIdCount.set(g, 1);
        }
    }

    for (const [k, v] of guardIdCount) {
        if (v > maxMinutesAsleep) {
            maxMinutesAsleep = v;
            sleepiestGuardId = k;
            sleepiestMinute = minute;
        }
    }
}

console.log(sleepiestGuardId, sleepiestMinute);
console.log(parseInt(sleepiestGuardId) * sleepiestMinute);
