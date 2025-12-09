
from typing import Tuple, List

lines = []

with open('09.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

red_tiles: List[Tuple[int, int]] = []
for line in lines:
    col, row = line.split(',')
    red_tiles.append((int(col), int(row)))

# print(red_tiles)

max_area = 0
max_tiles: List[Tuple[int, int]] = []

for tile in red_tiles:
    for tile2 in red_tiles:
        if tile == tile2:
            continue

        if tile[0] < tile2[0] and tile[1] < tile2[1]:
            area = (tile2[0] - tile[0] + 1) * (tile2[1] - tile[1] + 1)
            if area > max_area:
                max_area = area
                max_tiles = [tile, tile2]

print(max_area)
