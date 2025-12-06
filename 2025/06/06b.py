
from functools import reduce

lines = []

with open('06.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip('\n') for line in lines]

operators = lines[-1:][0].split()
lines = lines[:-1]

print(lines)
print(operators)

operands: list[int] = []
sum = 0

for col in range(len(lines[0]) - 1, -1, -1):
    print(col)
    num_string = ''
    for line in lines:
        if line[col] != ' ':
            num_string += line[col]

    if num_string or col == -1:
        print(f'appending {num_string}')
        operands.append(int(num_string))
    else:
        operator = operators.pop()
        if operator == '*':
            print('*'.join([str(op) for op in operands]))
            sum += reduce(lambda x, y: x * y, operands)
        elif operator == '+':
            print('+'.join([str(op) for op in operands]))
            sum += reduce(lambda x, y: x + y, operands)
        operands.clear()

operator = operators.pop()
if operator == '*':
    print('*'.join([str(op) for op in operands]))
    sum += reduce(lambda x, y: x * y, operands)
elif operator == '+':
    print('+'.join([str(op) for op in operands]))
    sum += reduce(lambda x, y: x + y, operands)
operands.clear()

print(sum)
