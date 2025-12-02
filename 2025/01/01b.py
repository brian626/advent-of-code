
lines = []

with open('01.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

position = 50
count = 0

for line in lines:
    direction = line[:1]
    steps = int(line[1:])

    for i in range(steps):
        if direction == 'L':
            position -= 1
        else:
            position += 1

        if position < 0:
            position += 100
        if position >= 100:
            position -= 100
        if position == 0:
            count += 1

print(count)
