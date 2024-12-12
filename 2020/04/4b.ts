// --- Part Two ---
// The line is moving more quickly now, but you overhear airport security talking about
// how passports with invalid data are getting through. Better add some data validation, quick!

// You can continue to ignore the cid field, but each other field has strict rules about what
// values are valid for automatic validation:

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

// Your job is to count the passports where all required fields are both present and valid
// according to the above rules. Here are some example values:

// byr valid:   2002
// byr invalid: 2003

// hgt valid:   60in
// hgt valid:   190cm
// hgt invalid: 190in
// hgt invalid: 190

// hcl valid:   #123abc
// hcl invalid: #123abz
// hcl invalid: 123abc

// ecl valid:   brn
// ecl invalid: wat

// pid valid:   000000001
// pid invalid: 0123456789

// Here are some invalid passports:

// eyr:1972 cid:100
// hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

// iyr:2019
// hcl:#602927 eyr:1967 hgt:170cm
// ecl:grn pid:012533040 byr:1946

// hcl:dab227 iyr:2012
// ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

// hgt:59cm ecl:zzz
// eyr:2038 hcl:74454a iyr:2023
// pid:3556412378 byr:2007

// Here are some valid passports:

// pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
// hcl:#623a2f

// eyr:2029 ecl:blu cid:129 byr:1989
// iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

// hcl:#888785
// hgt:164cm byr:2001 iyr:2015 cid:88
// pid:545766238 ecl:hzl
// eyr:2022

// iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719

// Count the number of valid passports - those that have all required fields and valid values.
// Continue to treat cid as optional. In your batch file, how many passports are valid?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./4.input', 'utf-8');

const lines = file.split('\n');

class Passport {
    constructor() {
        this.fields = new Map<string, string>();
    }

    isValid(): boolean {
        return this.hasAllFields() && this.allFieldsValid();
    }

    hasAllFields(): boolean {
        return this.fields.has('byr') && this.fields.has('iyr') && this.fields.has('eyr') &&
               this.fields.has('hgt') && this.fields.has('hcl') && this.fields.has('ecl') &&
               this.fields.has('pid');
    }

    allFieldsValid(): boolean {
        // byr (Birth Year) - four digits; at least 1920 and at most 2002.
        const byr = this.fields.get('byr');
        if (byr.length !== 4 || parseInt(byr) < 1920 || parseInt(byr) > 2002) { return false; }

        // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        const iyr = this.fields.get('iyr');
        if (iyr.length !== 4 || parseInt(iyr) < 2010 || parseInt(iyr) > 2020) { return false; }

        // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        const eyr = this.fields.get('eyr');
        if (eyr.length !== 4 || parseInt(eyr) < 2020 || parseInt(eyr) > 2030) { return false; }

        // hgt (Height) - a number followed by either cm or in:
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        const hgtValue = parseInt(this.fields.get('hgt'));
        const hgtUnits = this.fields.get('hgt').slice(-2);
        if (hgtUnits === 'cm') { if (hgtValue < 150 || hgtValue > 193) { return false; } }
        else if (hgtUnits === 'in') { if (hgtValue < 59 || hgtValue > 76) { return false; } }
        else { return false; }

        // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        const hcl = this.fields.get('hcl');
        const hclRegExp = new RegExp(/#[0-9a-f]{6}/);
        if (hcl[0] !== '#' || hcl.match(hclRegExp) === null) { return false; }

        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        const ecl = this.fields.get('ecl');
        if (ecl !== 'amb' && ecl !== 'blu' && ecl !== 'brn' && ecl !== 'gry' && ecl !== 'grn' &&
            ecl !== 'hzl' && ecl !== 'oth') { return false; }

        // pid (Passport ID) - a nine-digit number, including leading zeroes.
        const pid = this.fields.get('pid');
        const pidRegExp = new RegExp(/[0-9]{9}/);
        if (pid.length !== 9 || pid.match(pidRegExp) === null) { return false; }

        return true;
    }

    fields: Map<string, string>;
}

const passportData: Passport[] = new Array();
let passportNum = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { passportNum += 1; continue; }

    if (passportData[passportNum] === undefined) {
        passportData[passportNum] = new Passport();
    }

    const fields: string[] = lines[i].split(' ');
    fields.forEach(field => {
        let [key, value] = field.split(':');
        passportData[passportNum].fields.set(key, value);
    });
}

// let f = new Set<string>();
// passportData.forEach(p => {
//     if (p.isValid()) { [...p.fields.keys()].forEach(k => { f.add(k); }); }
// });
// console.log(f);

passportData.forEach(p => {
    if (p.isValid()) { console.log(p.fields.get('hgt')); }
});

// console.log(passportData.filter(x => x.isValid()).length);
