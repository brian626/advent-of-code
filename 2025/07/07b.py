
from typing import List, Tuple

lines = []

with open('07.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

grid = [list(line) for line in lines]
grid_width = len(grid[0])
grid_height = len(grid)

beams: List[Tuple[int, int]] = []

# Find the initial position
for col in range(grid_width):
    if grid[0][col] == 'S':
        beams.append((0, col))
        break

num_splits = 0

def print_grid():
    for row in range(len(grid)):
        print(''.join(grid[row]))
    print()


def update_grid(beams):
    for row in range(len(grid)):
        for col in range(len(grid[0])):
            if grid[row][col] != 'S' and (row, col) in beams:
                grid[row][col] = '|'


iterations = 0

while True:
    # if iterations > 100:
    #     break
    # iterations += 1

    # print('beams at start of loop')
    # update_grid(beams)
    # print_grid()

    moved_beams: List[Tuple[int, int]] = []
    moved_beam = False
    # Move all beams down one (if possible)
    for beam in beams:
        # print(f'looking at beam {beam}')
        if beam[0] < grid_height - 1:
            # print(f'moving beam from ({beam[0], beam[1]}) to ({beam[0] + 1}, {beam[1]})')
            new_beam = (beam[0] + 1, beam[1])
            moved_beams.append(new_beam)
            moved_beam = True
        else:
            # print(f'not moving beam from ({beam[0], beam[1]})')
            moved_beams.append(beam)

    if not moved_beam:
        break

    beams = moved_beams

    # print('beams after moving down')
    # print(beams)

    # Check for splits
    new_beams: List[Tuple[int, int]] = []
    for beam in beams:
        beam_row, beam_col = beam
        if grid[beam_row][beam_col] == '^':
            new_beam_1 = (beam_row, beam_col - 1)
            new_beam_2 = (beam_row, beam_col + 1)
            new_beams.append(new_beam_1)
            new_beams.append(new_beam_2)
            num_splits += 1
        else:
            new_beams.append(beam)

    beams = list(set(new_beams))

    # print('beams after splitting')
    # print(beams)

    print()

print(num_splits)

# 877 is too low