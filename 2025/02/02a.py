
lines = []

with open('02.input', 'r') as f:
    lines = f.readlines()

line = lines[0].strip()

ranges = line.split(',')

sum = 0

def isRepeatedTwice(id: str) -> bool:
    halfLen = int(len(id) / 2)
    for i in range(halfLen):
        if id[i] != id[i+halfLen]:
            return False
    
    return True

for r in ranges:
    first, last = r.split('-')
    firstId = int(first)
    lastId = int(last)
    for id in range(firstId, lastId + 1):
        idStr = str(id)
        if len(idStr) % 2 != 0:
            continue

        if isRepeatedTwice(idStr):
            sum += id

print(sum)
