def dfs(graph, start_node, visited=None):
    if visited is None:
        visited = set()
    
    # Mark the current node as visited
    if start_node not in visited:
        print(start_node, end=' ')
        visited.add(start_node)
        
        # Recurse for all unvisited neighbors
        for neighbor in graph[start_node]:
            if neighbor not in visited:
                dfs(graph, neighbor, visited)
    return visited

def find_all_paths_dfs_backtrack(graph, src, dest, allPaths, current_path):
    """
    A slightly more explicit backtracking implementation.
    """
    current_path.append(src)

    if src == dest:
        allPaths.append(list(current_path)) # Append a copy of the path
    else:
        for neighbor in graph.get(src, []):
            if neighbor not in current_path:
                find_all_paths_dfs_backtrack(graph, neighbor, dest, allPaths, current_path)

    current_path.pop() # Backtrack
