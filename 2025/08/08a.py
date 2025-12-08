
from typing import Tuple, List

lines = []

with open('08.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]


class Junction:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __str__(self) -> str:
        return f'({self.x}, {self.y}, {self.z})'

    def distance(self, junction) -> float:
        return pow(pow((junction.x - self.x), 2) +
                   pow((junction.y - self.y), 2) +
                   pow((junction.z - self.z), 2), 0.5)


class Circuit:
    def __init__(self, junction: Junction):
        self.junctions = [junction]

    def __str__(self) -> str:
        return ', '.join([str(j) for j in self.junctions])


junctions: List[Junction] = []
circuits: List[Circuit] = []

for line in lines:
    positions = [int(pos) for pos in line.split(',')]
    junction = Junction(positions[0], positions[1], positions[2])
    junctions.append(junction)

for j in junctions:
    c = Circuit(j)
    circuits.append(c)

distances: List[Tuple[Junction, Junction, float]] = []
for junction in junctions:
    for junction2 in junctions:
        if junction == junction2:
            continue

        distances.append((junction, junction2, junction.distance(junction2)))

distances.sort(key=lambda x: x[2])

# for d in distances[:10]:
#     print(f'{d[0]} -> {d[1]}: {d[2]}')
# print()

# need to handle circuit-merging
for n in range(10):
    distance = distances[n*2]
    junction_to_remove = None
    for c in circuits:
        if distance[0] in c.junctions:
            if distance[1] in c.junctions:
                break
            else:
                c.junctions.append(distance[1])
                junction_to_remove = distance[1]
                break
        elif distance[1] in c.junctions:
            if distance[0] in c.junctions:
                break
            else:
                c.junctions.append(distance[0])
                junction_to_remove = distance[0]
                break

    if junction_to_remove:
        for c in circuits:
            if len(c.junctions) == 1 and c.junctions[0] == junction_to_remove:
                circuits.remove(c)
                break

    circuits.sort(key=lambda x: len(x.junctions), reverse=True)
    print(f'After {n+1} iterations, there are {len(circuits)} circuits.')
    num_single_circuits = 0
    for idx, c in enumerate(circuits):
        if len(c.junctions) == 1:
            num_single_circuits += 1
        else:
            print(f'\tCircuit #{idx+1} has {len(c.junctions)} junctions: {c}')
    if num_single_circuits > 0:
        print(f'\tAnd {num_single_circuits} circuits with a single junction')
    print()
