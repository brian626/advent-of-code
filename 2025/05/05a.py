
lines = []

with open('05.input', 'r') as f:
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

print(fresh_ranges)
print(ingredient_ids)

num_fresh = 0


def is_fresh(id: int) -> bool:
    for range in fresh_ranges:
        if id >= range[0] and id <= range[1]:
            return True

    return False


for id in ingredient_ids:
    if is_fresh(id):
        num_fresh += 1

print(num_fresh)
