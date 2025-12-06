
from functools import reduce

lines = []

with open('06.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

operands = [line.split() for line in lines[:-1]]
operators = lines[-1:][0].split()

# print(operands)
# print(operators)

sum = 0
for col in range(len(operands[0])):
    values = [int(line[col]) for line in operands]
    # print(values, operators[col])

    if operators[col] == '*':
        sum += reduce(lambda x, y: x * y, values)
    elif operators[col] == '+':
        sum += reduce(lambda x, y: x + y, values)

print(sum)