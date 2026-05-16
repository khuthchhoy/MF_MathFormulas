
const series = {
    easy: [
        // Family: Finite Arithmetic Series Summation
        (a, b, c, d) => {
            let n = Math.abs(c) % 5 + 6; 
            let start = a !== 0 ? a : 2;
            let diff = b !== 0 ? b : 4;
            let insideBrackets = 2 * start + (n - 1) * diff;
            let sum = (n * insideBrackets) / 2;
            
            return {
                expr: `\\text{Evaluate } S_{${n}} \\text{ given } a_1 = ${start}, \\, d = ${diff}`,
                ans: `= ${sum}`,
                sol: `\\begin{aligned}
                    &\\text{Use the partial sum formula: } S_n = \\frac{n}{2}[2a_1 + (n-1)d] \\\\
                    &S_{${n}} = \\frac{${n}}{2} \\left[ 2(${start}) + (${n}-1)(${diff}) \\right] \\\\
                    &= \\frac{${n}}{2} \\left[ ${2 * start} + ${n - 1} \\cdot ${diff} \\right] \\\\
                    &= \\frac{${n}}{2} \\left[ ${insideBrackets} \\right] = ${sum}
                \\end{aligned}`
            };
        }
    ],
    med: [
        // Family: Telescoping Cancellations
        (a, b, c, d) => {
            return {
                expr: `\\sum_{k=1}^{n} \\left( \\frac{1}{k} - \\frac{1}{k+1} \\right)`,
                ans: `= 1 - \\frac{1}{n+1}`,
                sol: `\\begin{aligned}
                    &\\text{Expand out the early terms to visualize the sequence cancellation:} \\\\
                    &= \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\dots + \\left(\\frac{1}{n} - \\frac{1}{n+1}\\right) \\\\
                    &\\text{All interior cascading fractions cancel out, leaving:} \\\\
                    &= 1 - \\frac{1}{n+1}
                \\end{aligned}`
            };
        }
    ],
    hard: [
        // Family: Infinite Geometric Sum Convergency
        (a, b, c, d) => {
            let firstTerm = Math.abs(a) > 0 ? Math.abs(a) : 3;
            const denominators = [2, 3, 4];
            let den = denominators[Math.abs(b) % 3];
            let numAns = firstTerm * den;
            let denAns = den - 1;
            
            let common = Utils.gcd ? Utils.gcd(numAns, denAns) : 1;
            let finalNum = numAns / common;
            let finalDen = denAns / common;
            let ansStr = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;
            
            return {
                expr: `\\sum_{k=0}^{\\infty} ${firstTerm} \\cdot \\left(\\frac{1}{${den}}\\right)^k`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{An infinite geometric series with } a = ${firstTerm} \\text{ and } r = \\frac{1}{${den}}. \\\\
                    &\\text{Since } |r| < 1, \\text{ it converges using } S = \\frac{a}{1 - r}: \\\\
                    &S = \\frac{${firstTerm}}{1 - \\frac{1}{${den}}} = \\frac{${firstTerm}}{\\frac{${den - 1}}{${den}}} = \\frac{${numAns}}{${denAns}} ${common > 1 ? ` = ${ansStr}` : ''}
                \\end{aligned}`
            };
        },
        // Family: Famous Classical Series Constants
        (a, b, c, d) => {
            return {
                expr: `\\sum_{k=1}^{\\infty} \\frac{1}{k^2}`,
                ans: `= \\frac{\\pi^2}{6}`,
                sol: `\\begin{aligned}
                    &\\text{This is the famous Basel Problem, originally solved by Euler.} \\\\
                    &\\text{It is a classic convergent } p\\text{-series with } p=2, \\text{ summing to } \\frac{\\pi^2}{6}.
                \\end{aligned}`
            };
        }
    ]
};