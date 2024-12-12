
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

const minutesAsleep: Map<string, number> = new Map<string, number>();

let currentGuardId = '';
let sleepStart = 0;
for (const e of events) {
    if (e.type === EventType.BeginsShift) {
        currentGuardId = e.guardId;
        console.log(`guard ${currentGuardId} begins shift`);
    } else if (e.type === EventType.FallsAsleep) {
        sleepStart = e.epochTime;
        console.log(`guard ${currentGuardId} falls asleep at ${sleepStart}`);
    } else if (e.type === EventType.WakesUp) {
        const m = (e.epochTime - sleepStart) / 60;
        console.log(`guard ${currentGuardId} wakes up after ${m} minutes`);

        if (minutesAsleep.has(currentGuardId)) {
            minutesAsleep.set(currentGuardId, minutesAsleep.get(currentGuardId) + m);
        } else {
            minutesAsleep.set(currentGuardId, m);
        }

        sleepStart = 0;
    }
}

// console.log(minutesAsleep);

let maxSleep = 0;
for (const m of minutesAsleep.values()) {
    maxSleep = Math.max(maxSleep, m);
}

let sleepiestGuardId = '';
for (const [k, v] of minutesAsleep.entries()) {
    if (v === maxSleep) {
        sleepiestGuardId = k;
        break;
    }
}

console.log(sleepiestGuardId);

const sleepTracker: Map<number, number> = new Map<number, number>();

let sleepStartHour = 0, sleepStartMinute = 0;
for (const e of events) {
    if (e.guardId === sleepiestGuardId) {
        if (e.type === EventType.FallsAsleep) {
            sleepStartHour = e.hour;
            sleepStartMinute = e.minute;
        } else if (e.type === EventType.WakesUp) {
            const sleepEndHour = e.hour;
            const sleepEndMinute = e.minute;
            for (let t = sleepStartHour * 60 + sleepStartMinute; t < sleepEndHour * 60 + sleepEndMinute; t++) {
                if (sleepTracker.has(t)) {
                    sleepTracker.set(t, sleepTracker.get(t) + 1);
                } else {
                    sleepTracker.set(t, 1);
                }
            }
        }
    }
}

// console.log(sleepTracker);

let sleepiestMinuteCount = 0;
for (const v of sleepTracker.values()) {
    sleepiestMinuteCount = Math.max(sleepiestMinuteCount, v);
}

let sleepiestMinute = -1;
for (const [k, v] of sleepTracker.entries()) {
    if (v === sleepiestMinuteCount) {
        sleepiestMinute = k;
        break;
    }
}

console.log(sleepiestMinute);

console.log(parseInt(sleepiestGuardId) * sleepiestMinute);

// 3403 is too low
