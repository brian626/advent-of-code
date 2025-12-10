
from typing import Tuple, List

lines = []

with open('09.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

red_tiles: List[Tuple[int, int]] = []
for line in lines:
    col, row = line.split(',')
    red_tiles.append((int(col), int(row)))

# print(red_tiles)

max_area = 0
max_tiles: List[Tuple[int, int]] = []


def isRedOrGreen(tile: Tuple[int, int]) -> bool:
    print(f'is tile {tile} red or green?')
    if tile in red_tiles:
        print("\tit's red")
        return True

    red_tile_in_column = False
    red_tile_in_row = False

    for t in red_tiles:
        if t[0] == tile[0]:
            print("\tfound a red tile in its column")
            red_tile_in_column = True
            continue
        if t[1] == tile[1]:
            print("\tfound a red tile in its row")
            red_tile_in_row = True
            continue

    if red_tile_in_column and red_tile_in_row:
        print("\tit's green")
    else:
        print("it's neither red nor green")

    return red_tile_in_column and red_tile_in_row


for tile in red_tiles:
    for tile2 in red_tiles:
        if tile == tile2:
            continue

        if tile[0] < tile2[0] and tile[1] < tile2[1]:
            tile3: Tuple[int, int] = (tile2[0], tile[1])
            tile4: Tuple[int, int] = (tile[0], tile2[1])
            print(f'found red corners at {tile} and {tile2}, checking the other corners {tile3} and {tile4}')
            if not isRedOrGreen(tile3) or not isRedOrGreen(tile4):
                print()
                continue
            print()

            area = (tile2[0] - tile[0] + 1) * (tile2[1] - tile[1] + 1)
            if area > max_area:
                max_area = area
                max_tiles = [tile, tile2]

print(max_area)
