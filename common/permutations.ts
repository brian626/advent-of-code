export { permutations }

function permutations<T>(set: Set<T>): Set<T[]> {
  const elements = Array.from(set);
  const result: Set<T[]> = new Set();

  function permute(arr: T[], start: number) {
    if (start === arr.length - 1) {
      result.add([...arr]);
    } else {
      for (let i = start; i < arr.length; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        permute(arr, start + 1);
        [arr[start], arr[i]] = [arr[i], arr[start]]; // Backtrack
      }
    }
  }

  permute(elements, 0);
  return result;
}

// const mySet = new Set([1, 2, 3]);
// const perms = permutations(mySet);

// console.log(perms);
