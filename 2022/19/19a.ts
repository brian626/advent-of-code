// --- Day 19: Not Enough Minerals ---

// Your scans show that the lava did indeed form obsidian!

// The wind has changed direction enough to stop sending lava droplets toward you, so you and the elephants exit the cave.
// As you do, you notice a collection of geodes around the pond. Perhaps you could use the obsidian to create some
// geode-cracking robots and break them open?

// To collect the obsidian from the bottom of the pond, you'll need waterproof obsidian-collecting robots. Fortunately,
// there is an abundant amount of clay nearby that you can use to make them waterproof.

// In order to harvest the clay, you'll need special-purpose clay-collecting robots. To make any type of robot, you'll
// need ore, which is also plentiful but in the opposite direction from the clay.

// Collecting ore requires ore-collecting robots with big drills. Fortunately, you have exactly one ore-collecting robot
// in your pack that you can use to kickstart the whole operation.

// Each robot can collect 1 of its resource type per minute. It also takes one minute for the robot factory (also conveniently
// from your pack) to construct any type of robot, although it consumes the necessary resources available when construction begins.

// The robot factory has many blueprints (your puzzle input) you can choose from, but once you've configured it with a blueprint,
// you can't change it. You'll need to work out which blueprint is best.


// The elephants are starting to look hungry, so you shouldn't take too long; you need to figure out which blueprint would maximize
// the number of opened geodes after 24 minutes by figuring out which robots to build and when to build them.


// Determine the quality level of each blueprint by multiplying that blueprint's ID number with the largest number of geodes that
// can be opened in 24 minutes using that blueprint. In this example, the first blueprint has ID 1 and can open 9 geodes,
// so its quality level is 9. The second blueprint has ID 2 and can open 12 geodes, so its quality level is 24. Finally,
// if you add up the quality levels of all of the blueprints in the list, you get 33.

// Determine the quality level of each blueprint using the largest number of geodes it could produce in 24 minutes. What do you
// get if you add up the quality level of all of the blueprints in your list?

import { readFileSync } from 'fs';

const file = readFileSync('./19.test', 'utf-8');

const lines = file.split('\n');

class Blueprint {
    num: number;
    oreRobotCostInOre: number;
    clayRobotCostInOre: number;
    obsidianRobotCostInOre: number;
    obsidianRobotCostInClay: number;
    geodeRobotCostInOre: number;
    geodeRobotCostInObsidian: number;
    score: number;

    constructor (n: string, o: string, c: string, oo: string, oc: string, gor: string, gob: string) {
        this.num = Number(n);
        this.oreRobotCostInOre = Number(o);
        this.clayRobotCostInOre = Number(c);
        this.obsidianRobotCostInOre = Number(oo);
        this.obsidianRobotCostInClay = Number(oc);
        this.geodeRobotCostInOre = Number(gor);
        this.geodeRobotCostInObsidian = Number(gob);
        this.score = 0;
    }
}

const blueprintRegEx = new RegExp('Blueprint (\\d+): Each ore robot costs (\\d+) ore. Each clay robot costs (\\d+) ore. Each obsidian robot costs (\\d+) ore and (\\d+) clay. Each geode robot costs (\\d+) ore and (\\d+) obsidian.');

const blueprints: Blueprint[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const blueprintParts = blueprintRegEx.exec(lines[i]);

    blueprints.push(new Blueprint(blueprintParts[1], blueprintParts[2], blueprintParts[3], blueprintParts[4], blueprintParts[5], blueprintParts[6], blueprintParts[7]));
}

// console.log(blueprints);

for (let i = 0; i < blueprints.length; i++) {
    console.log(`***** Blueprint ${i+1}*****`);
    const bp = blueprints[i];
    let ore = 0;
    let clay = 0;
    let obsidian = 0;
    let geodes = 0;
    let oreRobots = 1;
    let clayRobots = 0;
    let obsidianRobots = 0;
    let geodeRobots = 0;
    let buildingOreRobot = false;
    let buildingClayRobot = false;
    let buildingObsidianRobot = false;
    let buildingGeodeRobot = false;

    for (let j = 1; j < 10; j++) {
        console.log(`== Minute ${j} ==`);

        // Can we make a geode robot?
        if (ore >= bp.geodeRobotCostInOre && obsidian >= bp.geodeRobotCostInObsidian) {
            console.log(`Spend ${bp.geodeRobotCostInObsidian} in obsidian and ${bp.geodeRobotCostInOre} ore to start building an geode-collecting robot.`)
            ore -= bp.geodeRobotCostInOre;
            obsidian -= bp.geodeRobotCostInObsidian;
            // geodeRobots++;
            buildingGeodeRobot = true;
        }

        // Can we make an obsidian robot?
        if (ore >= bp.obsidianRobotCostInOre && clay >= bp.obsidianRobotCostInClay) {
            console.log(`Spend ${bp.obsidianRobotCostInOre} in clay and ${bp.obsidianRobotCostInOre} ore to start building an obsidian-collecting robot.`)
            ore -= bp.obsidianRobotCostInOre;
            clay -= bp.obsidianRobotCostInClay;
            // obsidianRobots++;
            buildingObsidianRobot = true;
        }

        // Can we make a clay robot?
        if (ore >= bp.clayRobotCostInOre) {
            console.log(`Spend ${bp.clayRobotCostInOre} ore to start building a clay-collecting robot.`)
            ore -= bp.clayRobotCostInOre;
            // clayRobots++;
            buildingClayRobot = true;
        }

        // // Can we make an ore robot?
        // if (ore >= bp.oreRobotCostInOre) {
        //     ore -= bp.oreRobotCostInOre;
        //     console.log(`Spend ${bp.oreRobotCostInOre} ore to start building `)
        //     oreRobots++;
        // }

        // Collect materials
        console.log(`${oreRobots} ore-collecting robot(s) collect ${oreRobots} ore; you now have ${ore + oreRobots} ore.`)
        ore += oreRobots;

        if (clayRobots > 0) {
            console.log(`${clayRobots} clay-collecting robot(s) collect ${clayRobots} clay; you now have ${clay + clayRobots} clay.`)
            clay += clayRobots;
        }

        if (obsidianRobots > 0) {
            console.log(`${obsidianRobots} obsidian-collecting robot(s) collect ${obsidianRobots} obsidian; you now have ${obsidian + obsidianRobots} obsidian.`)
            obsidian += obsidianRobots;
        }

        if (geodeRobots > 0) {
            console.log(`${geodeRobots} geode-collecting robot(s) collect ${geodeRobots} geodes; you now have ${geodes + geodeRobots} geodes.`)
            geodes += geodeRobots;
        }

        // Build robots
        if (buildingGeodeRobot) {
            geodeRobots++;
            buildingGeodeRobot = false;
            console.log(`The new geode-collecting robot is ready; you now have ${geodeRobots} of them.`);
        }

        if (buildingObsidianRobot) {
            obsidianRobots++;
            buildingObsidianRobot = false;
            console.log(`The new obsidian-collecting robot is ready; you now have ${obsidianRobots} of them.`);
        }

        if (buildingClayRobot) {
            clayRobots++;
            buildingClayRobot = false;
            console.log(`The new clay-collecting robot is ready; you now have ${clayRobots} of them.`);
        }

        console.log(``);
    }

    console.log(``);

    bp.score = bp.num * geodes;
}

console.log(blueprints.reduce((a,b) => a + b.score, 0));
