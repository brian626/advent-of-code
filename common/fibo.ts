function fibo(n: number): number {
    if (n === 0) { return 0; }

    let previous_previous = 0;
    let previous = 1;

    for (let i = 0; i < n -1; i++) {
        const current = previous_previous + previous;
        [previous, previous_previous] = [current, previous];
    }

    return previous;
}


// console.log(fibo(9));
