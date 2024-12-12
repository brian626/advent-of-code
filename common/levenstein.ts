
class LevensteinIterative {
    levenstein(A: string, B: string): number {
        const cache: number[][] = [];
        for (let i = 0; i < A.length + 1; i++) {
            cache[i] = [];
        }

        for (let a = 0; a < A.length + 1; a++) {
            for (let b = 0; b < B.length + 1; b++) {
                if (a === 0) {
                    cache[a][b] = b;
                } else if (b === 0) {
                    cache[a][b] = a;
                } else if (A[a - 1] === B[b - 1]) {
                    cache[a][b] = cache[a-1][b-1];
                } else {
                    cache[a][b] = Math.min(
                        cache[a-1][b-1] + 1,
                        cache[a-1][b] + 1,
                        cache[a][b-1] + 1
                    );
                }
            }
        }

        return cache[A.length][B.length];
    }
}

class LevensteinRecursive {
    A: string;
    B: string;
    cache: Map<string, number>;

    aux(a: number, b: number): number {
        if (this.cache.has(`${a},${b}`)) {
            return this.cache.get(`${a},${b}`);
        }

        let result;
        if (a === 0) {
            result = b;
        } else if (b === 0) {
            result = a;
        } else if (this.A[a-1] === this.B[b-1]) {
            result = this.aux(a-1, b-1);
        } else {
            const result1 = this.aux(a-1, b-1) + 1;
            const result2 = this.aux(a-1, b) + 1;
            const result3 = this.aux(a, b-1) + 1;
            result = Math.min(result1, result2, result3);
        }

        this.cache.set(`${a},${b}`, result);
        return result;
    }

    levenstein(A: string, B: string): number {
        this.A = A;
        this.B = B;
        this.cache = new Map<string, number>();

        return this.aux(A.length, B.length);
    }
}

// const l = new LevensteinIterative();
// console.log(l.levenstein('', 'puppy')); // 5
// console.log(l.levenstein('kitten', 'sitting')); // 3
// console.log(l.levenstein('uninformed', 'uniformed')); // 1
// console.log(l.levenstein('abcdefghij', 'isdubvrqwz')); // 10
// console.log(l.levenstein("pneumonoultramicroscopicsilicovolcanoconiosis", "sisoinoconaclovociliscipocsorcimartluonomuenp")); // 36
