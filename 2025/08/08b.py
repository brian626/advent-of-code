
from typing import Tuple, List
from functools import reduce

lines = []

with open('08.input', 'r') as f:
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
    def __init__(self, junction: Junction | None):
        self.junctions = [junction] if junction else []

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
n = 0
while True:
    distance = distances[n*2]
    junction1 = distance[0]
    circuit1 = [c for c in circuits if junction1 in c.junctions][0]
    junction2 = distance[1]
    circuit2 = [c for c in circuits if junction2 in c.junctions][0]

    if circuit1 != circuit2:
        circuit1.junctions += circuit2.junctions
        circuits.remove(circuit2)

    circuits.sort(key=lambda x: len(x.junctions), reverse=True)
    if len(circuits) == 1:
        print(junction1.x * junction2.x)
        break

    n += 1
    # print(f'After {n+1} iterations, there are {len(circuits)} circuits.')
    # num_single_circuits = 0
    # for idx, c in enumerate(circuits):
    #     if len(c.junctions) == 1:
    #         num_single_circuits += 1
    #     # else:
    #     #     print(f'\tCircuit #{idx+1} has {len(c.junctions)} junctions: {c}')
    # # if num_single_circuits > 0:
    # #     print(f'\tAnd {num_single_circuits} circuits with a single junction')
    # # print()
