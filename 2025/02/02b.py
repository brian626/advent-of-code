
lines = []

with open('02.input', 'r') as f:
    lines = f.readlines()

line = lines[0].strip()

ranges = line.split(',')

invalidIds = set()

def isRepeated(id: str, patternLength: int) -> bool:
    chunks = []
    while len(id) > 0:
        chunks.append(id[:patternLength])
        id = id[patternLength:]
    
    for chunk in chunks:
        if chunk != chunks[0]:
            return False

    return True

for r in ranges:
    first, last = r.split('-')
    firstId = int(first)
    lastId = int(last)
    for id in range(firstId, lastId + 1):
        idStr = str(id)
        for patternLength in range(1, int(len(idStr) / 2) + 1):
            if len(idStr) % patternLength != 0:
                # print(f'skipping {idStr} because its length is not a multiple of {patternLength}')
                continue

            if isRepeated(idStr, patternLength):
                # print(id)
                invalidIds.add(id)

print(sum(invalidIds))
