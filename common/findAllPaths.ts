export { findAllPaths }

function findAllPaths(maze: number[][], start: number[], end: number[], scoreFn: (path: number[][]) => number = null, maxScore = Infinity): number[][][] {
    const paths: number[][][] = [];
    const visited = {};

    let iterations = 0;

    function dfs(x: number, y: number, path: number[][]): number[][][] {
        // Check if out of bounds or visited
        if (x < 0 || x >= maze.length || y < 0 || y >= maze[0].length || maze[x][y] === 1 || visited[x + ',' + y]) {
            return;
        }

        // Mark current cell as visited
        visited[x + ',' + y] = true;
        path.push([x, y]);

        if (!scoreFn || (scoreFn && scoreFn(path) <= maxScore)) {
            // Check if reached the end
            if (x === end[0] && y === end[1]) {
                paths.push([...path]);
            } else {
                // Explore all possible directions
                dfs(x + 1, y, path);
                dfs(x - 1, y, path);
                dfs(x, y + 1, path);
                dfs(x, y - 1, path);
            }
        }

        // Backtrack
        path.pop();
        visited[x + ',' + y] = false;
        iterations++;
        if (iterations % 100000 === 0) { console.log(iterations, paths.length); }
    }

    dfs(start[0], start[1], []);
    // console.log(`total iterations: ${iterations}`);
    return paths;
}

// // Example maze: 0 represents open, 1 represents wall
// const maze = [
//   [0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 1, 1, 1, 0],
//   [0, 0, 0, 0, 0],
//   [1, 0, 1, 0, 0]
// ];

// const start = [0, 0];
// const end = [4, 4];

// const allPaths = findAllPaths(maze, start, end);
// console.log(allPaths);
