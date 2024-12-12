from collections import Counter
import string

A, pairs = open('14.input', 'r').read().split('\n\n')
B = {}
for x in pairs.splitlines():
    i, j = x.split(' -> ')
    B[i] = j

# print(B)

polymer = {}
for x in B.keys():
    polymer[x] = 0

# print(polymer)

total = dict.fromkeys(string.ascii_uppercase, 0)
for i in range(len(A)):
    total[A[i]] += 1

# print(total)

for i in range(len(A)-1):
    polymer[A[i:i+2]] += 1

# print(polymer)

for step in range(40):
    temp_poly = polymer.copy()
    for x in (y for (y, z) in polymer.items() if z > 0):
        t1 = x[:1] + B[x]
        t2 = B[x] + x[1:]
        temp_poly[t1] += polymer[x]
        temp_poly[t2] += polymer[x]
        temp_poly[x] -= polymer[x]
        total[B[x]] += polymer[x]
    polymer = temp_poly.copy()

print(polymer)
print(total)

count = Counter(total)
count += Counter()
print(count.most_common()[0][1] - count.most_common()[-1][1])
