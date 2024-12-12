const PATTERN = [
    208845,
    205870,
    203236,
    201264,
    202272,
    200917,
    204960,
    206640,
    209988,
    208420,
    211236,
    208638,
    208004,
    205910,
    205450,
    202170,
    202301,
    198560,
    199386,
    194805,
    197232,
    197650,
    200515,
    199732,
    202462,
    203138,
    205542,
    205800
];


const TIME = 1000000000;

let valuePos = 0;

for (let i = 10000; i < TIME; i++) {
    valuePos++;
    if (valuePos >= PATTERN.length) {
        valuePos = 0;
    }
}

console.log(PATTERN[valuePos]);
