
from functools import reduce

lines = []

with open('06.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

operands = [line.split() for line in lines[:-1]]
operators = lines[-1:][0].split()

# print(operands)
# print(operators)

def transpose(values: list[str]) -> list[int]:
    new_values: list[int] = []

    matrix = [list(vals) for vals in values]
    for m in matrix:
        m.reverse()
    # print(matrix)

    while len(matrix[0]):
        new_value = []
        new_matrix = []
        for num in matrix:
            new_value += num[:1]
            new_matrix.append(num[1:])
        matrix = new_matrix
        print(f'appending {new_value}, matrix is now {matrix}')
        new_values.append(int(''.join(new_value)))

    return new_values


sum = 0
for col in range(len(operands[0])):
    values = [line[col] for line in operands]
    values = transpose(values)
    print(values, operators[col])

    # if operators[col] == '*':
    #     sum += reduce(lambda x, y: x * y, values)
    # elif operators[col] == '+':
    #     sum += reduce(lambda x, y: x + y, values)

print(sum)