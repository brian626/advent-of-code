
from typing import List, Tuple, Set

lines = []

with open('07.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

grid = [list(line) for line in lines]
grid_width = len(grid[0])
grid_height = len(grid)

paths: List[List[Tuple[int, int]]] = []

# Find the initial position
for col in range(grid_width):
    if grid[0][col] == 'S':
        paths.append([(0, col)])
        break

solutions: Set[str] = set()

def print_paths(paths):
    for path in paths:
        print(path)

while paths:
    # print(len(paths))
    # print('paths:')
    # print_paths(paths)
    # print()
    path = paths.pop()

    current_row, current_col = path[-1]
    new_row = current_row + 1

    if new_row > grid_height - 1:
        path.append((new_row, current_col))
        solutions.add(str(path))
        # print(f'{len(solutions)} paths complete ({len(paths)} paths)')
        continue

    if grid[new_row][current_col] == '^':
        left_path = path.copy()
        left_path.append((new_row, current_col - 1))
        paths.append(left_path)

        right_path = path.copy()
        right_path.append((new_row, current_col + 1))
        paths.append(right_path)
        # print(f'path splitting ({len(paths)} paths)')
    else:
        new_path = path.copy()
        new_path.append((new_row, current_col))
        paths.append(new_path)
        # print(f'path continuing ({len(paths)} paths)')

print(len(solutions))
