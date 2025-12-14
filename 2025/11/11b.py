
from dfs import find_all_paths_dfs_backtrack

lines = []

with open('11.input', 'r') as f:
    lines = f.readlines()

lines = [line.strip() for line in lines]

graph = {}
for line in lines:
    label, nbrs = line.split(':')
    neighbors = nbrs.strip().split()
    if label in graph:
        graph[label] = graph[label] + neighbors
    else:
        graph[label] = neighbors


graph['out'] = []

all_paths = []
find_all_paths_dfs_backtrack(graph, 'svr', 'out', all_paths, [])

count = 0
for path in all_paths:
    if 'fft' in path and 'dac' in path:
        count += 1

print(count)
