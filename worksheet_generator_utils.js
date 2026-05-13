
export const Utils = {
    getRnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    shuffle: (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    },
    generateNiceParams: () => {
        let a, k1, k2, m, n, p, q, val_den;
        do {
            a = Utils.getRnd(-5, 5);
            k1 = Utils.getRnd(1, 3);
            k2 = Utils.getRnd(1, 3);
            m = Utils.getRnd(-5, 5);
            n = Utils.getRnd(-5, 5);
            p = Utils.getRnd(-5, 5);
            q = Utils.getRnd(-5, 5);
            val_den = k2 * (n * a + q);
        } while (a === 0 || m === 0 || n === 0 || val_den === 0 || Math.abs(m) === Math.abs(n));
        return { a, k1, k2, m, n, p, q };
    },
    poly2: (a, b, c) => {
        let res = "";
        if (a === 1) res += "x^2"; else if (a === -1) res += "-x^2"; else res += `${a}x^2`;
        if (b > 0) res += ` + ${b === 1 ? "" : b}x`; else if (b < 0) res += ` - ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
        if (c > 0) res += ` + ${c}`; else if (c < 0) res += ` - ${Math.abs(c)}`;
        return res;
    },
    minusA: (a) => a > 0 ? `(x - ${a})` : a < 0 ? `(x + ${Math.abs(a)})` : `(x)`,
    linear: (a, b) => {
        let res = '';
        if (a === 1) res += 'x'; else if (a === -1) res += '-x'; else res += `${a}x`;
        if (b > 0) res += ` + ${b}`; if (b < 0) res += ` - ${Math.abs(b)}`;
        return res;
    },
    gcd: function (x, y) {
        x = Math.abs(x); y = Math.abs(y);
        return y === 0 ? x : this.gcd(y, x % y);
    },
    formatSolution: (solStr) => {
        if (!solStr || solStr.includes('\\begin{aligned}')) return solStr;
        if (solStr.includes('=')) return `\\begin{aligned} ${solStr} \\end{aligned}`;
        return solStr;
    }
};