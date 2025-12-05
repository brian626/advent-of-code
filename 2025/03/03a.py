
lines = []

with open('03.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

sum = 0

for line in lines:
    joltages = list(map(int, list(line)))
    max_joltage = 0
    for i in range(0, len(joltages) - 1):
        battery = int(str(joltages[i]) + str(max(joltages[(i+1):])))
        max_joltage = max(max_joltage, battery)
    
    print(max_joltage)
    sum += max_joltage

print(sum)
