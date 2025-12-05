
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
            print(f'a: result of combining range {r} and range {rr} is {combined_range}')
            fresh_ranges.remove(r)
            fresh_ranges.remove(rr)
            fresh_ranges.append(combined_range)
            break
        elif r[1] >= rr[0] and r[1] <= rr[1]:
            combined_range = (min(r[0], rr[0]), max(r[1], rr[1]))
            print(f'b: result of combining range {r} and range {rr} is {combined_range}')
            fresh_ranges.remove(r)
            fresh_ranges.remove(rr)
            fresh_ranges.append(combined_range)
            break


found_overlap = True

while found_overlap:
    found_overlap = False
    fresh_ranges.sort()

    for idx, r in enumerate(fresh_ranges):
        if not overlaps(r):
            print(f'range {r} does not overlap, contains {r[1] - r[0] + 1} fresh ingredients')
            print('ranges are')
            print(fresh_ranges)
            print()
        else:
            found_overlap = True
            print(f'range {r} overlaps')
            remove_overlaps(r)
            print('new ranges are')
            print(fresh_ranges)
            print()
            break

print('final ranges are')
print(fresh_ranges)

num_fresh = 0

for r in fresh_ranges:
    num_fresh += (r[1] - r[0] + 1)

print(num_fresh)


# 387045651434109 is too high
# 376778472308100 is too high
