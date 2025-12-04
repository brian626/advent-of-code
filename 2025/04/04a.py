
lines = []

with open('04.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

grid = lines

sum = 0


def canAccess(grid, r, c) -> bool:
    if grid[r][c] != '@':
        return False

    rolls = 0

    if r > 0:
        if c > 0:
            if grid[r-1][c-1] == '@':
                rolls += 1

        if grid[r-1][c] == '@':
            rolls += 1

        if c < len(grid[0]) - 1:
            if grid[r-1][c+1] == '@':
                rolls += 1

    if c > 0:
        if grid[r][c-1] == '@':
            rolls += 1

    if c < len(grid[0]) - 1:
        if grid[r][c+1] == '@':
            rolls += 1

    if r < len(grid) - 1:
        if c > 0:
            if grid[r+1][c-1] == '@':
                rolls += 1

        if grid[r+1][c] == '@':
            rolls += 1

        if c < len(grid[0]) - 1:
            if grid[r+1][c+1] == '@':
                rolls += 1

    # print(f'grid at ({r},{c}) is {grid[r][c]} and has {rolls} neighbors')
    return rolls < 4


for r in range(0, len(grid)):
    for c in range(0, len(grid[0])):
        if canAccess(grid, r, c):
            sum += 1

print(sum)
