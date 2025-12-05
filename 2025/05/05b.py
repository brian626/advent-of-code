
lines = []

with open('05.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

reading_fresh_ranges = True
fresh_ranges = []
ingredient_ids = []
for line in lines:
    if not line:
        reading_fresh_ranges = False
        continue

    if reading_fresh_ranges:
        start, end = line.split('-')
        fresh_ranges.append((int(start), int(end)))
    else:
        ingredient_ids.append(int(line))

# print(fresh_ranges)
# print(ingredient_ids)


def overlaps(r: tuple[int, int]) -> bool:
    for rr in fresh_ranges:
        if r == rr:
            continue
        if r[0] >= rr[0] and r[0] <= rr[1]:
            return True
        if r[1] >= rr[0] and r[1] <= rr[1]:
            return True

    return False


# combine ranges if overlaps
def remove_overlaps(r: tuple[int, int]):
    for rr in fresh_ranges:
        if r == rr:
            continue
        if r[0] >= rr[0] and r[0] <= rr[1]:
            combined_range = (min(r[0], rr[0]), max(r[1], rr[1]))
            print(combined_range)
        # if r[1] >= rr[0] and r[1] <= rr[1]:



num_fresh = 0

for idx, r in enumerate(fresh_ranges):
    if not overlaps(r):
        print(f'range {r} does not overlap, contains {r[1] - r[0] + 1} fresh ingredients')
        num_fresh += (r[1] - r[0] + 1)
    else:
        print(f'range {r} overlaps')
        remove_overlaps(r)
        print('new ranges are')
        print(fresh_ranges)
        num_fresh += (r[1] - r[0] + 1)
    print()

print(num_fresh)
