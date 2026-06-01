
const Utils = {
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
    gcd: (x, y) => y === 0 ? Math.abs(x) : Utils.gcd(y, x % y),
    
    formatFraction: (num, den) => {
        if (num === 0) return "0";
        if (den === 0) return "\\text{Undefined}";
        
        const isNegative = (num < 0 && den > 0) || (num > 0 && den < 0);
        const absNum = Math.abs(num);
        const absDen = Math.abs(den);
        
        const g = Utils.gcd(absNum, absDen);
        const finalNum = absNum / g;
        const finalDen = absDen / g;
        
        if (finalDen === 1) {
            return isNegative ? `-${finalNum}` : `${finalNum}`;
        }
        
        return isNegative ? `-\\frac{${finalNum}}{${finalDen}}` : `\\frac{${finalNum}}{${finalDen}}`;
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
    formatSolution: (solStr) => {
        if (!solStr || solStr.includes('\\begin{aligned}')) return solStr;
        if (solStr.includes('=')) return `\\begin{aligned} ${solStr} \\end{aligned}`;
        return solStr;
    },
    clean: (str) => {
        if (!str) return str;
        return str
            // 1. Remove 1 as a coefficient before variables or LaTeX macros (EXCEPT before structural tags like \end, \text, \left, \right)
            .replace(/(^|[^a-zA-Z0-9\.\\])1\s*(?=[a-zA-Z]|\\(?!end|text|quad|\\|Rightarrow|implies|left|right|frac|sqrt|cdot))/g, '$1')
            
            // 2. Convert -1 coefficient to just a negative sign (EXCEPT before structural tags)
            .replace(/(^|[^a-zA-Z0-9\.\\])-1\s*(?=[a-zA-Z]|\\(?!end|text|quad|\\|Rightarrow|implies|left|right|frac|sqrt|cdot))/g, '$1-')
            
            // 3. Remove clean 0 terms added or subtracted (like + 0x, + 0\sin)
            .replace(/[\+\-]\s*0[a-zA-Z]/g, '')
            .replace(/[\+\-]\s*0\s*\\(?:sin|cos|tan|ln|log|sec|csc|cot|sqrt)/g, '')
            .replace(/\s*[\+\-]\s*0\s*(?=\\right|\\,|$|\)|\]|\}|\\end|\+|-|=)/g, '')
            
            // 4. Simplify redundant math signs
            .replace(/\+\s*-/g, '-')
            .replace(/-\s*-/g, ' + ')
            .replace(/-\s*\+/g, '-')
            .replace(/\+\s*\+/g, ' + ')
            
            // 5. Strip away unnecessary algebraic power definitions of 1
            .replace(/\^1(?![0-9])/g, '')
            .replace(/\^\{1\}/g, '')
            
            // 6. Fix lingering formatting double spaces or leading plus signs
            .replace(/^\s*\+\s*/, '')
            .replace(/([=\(\[])\s*\+\s*/g, '$1 ')
            .replace(/\s+/g, ' ')
            .trim();
    }
};
window.Utils = Utils;