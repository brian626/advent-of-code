
from typing import List

lines = []

with open('11.test', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]


class Node:
    def __init__(self, label: str):
        self.label = label
        self.connections: List[str] = []

    def __str__(self):
        return f'{self.label}: {" ".join([str(n) for n in self.connections])}'


nodes: List[Node] = []

for line in lines:
    label, _ = line.split(':')
    node = Node(label)
    nodes.append(node)

node = Node('out')
nodes.append(node)

print([str(n) for n in nodes])

for line in lines:
    label, connections = line.split(':')
    node = [n for n in nodes if n.label == label][0]
    for connection in connections.strip().split(' '):
        node.connections.append(connection)

print([str(n) for n in nodes])


# Implement DFS
