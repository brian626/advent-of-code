
lines = []

with open('03.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

sum = 0

for line in lines:
    joltages = list(map(int, list(line)))

    pos = 0
    while len([j for j in joltages if j > 0]) > 12:
        temp = joltages[pos]
        prev_max = int(''.join(list(map(str, joltages))))
        joltages[pos] = 0
        joltage = ''.join(list(map(str, [j for j in joltages if j > 0])))

    max_joltage = int(''.join(list(map(str, joltages))))
    print(max_joltage)
    sum += max_joltage

print(sum)
