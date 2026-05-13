
import { Utils } from './worksheet_generator_utils.js';
export const sequences = {
        easy: [
            (a, b, c) => {
                let n = c + 3;
                return {
                    expr: `a_n = ${a} + (n-1)\\cdot ${b} \\; (n = ${n})`,
                    ans: `= ${a + (n - 1) * b}`,
                    sol: `\\text{Plug in } n=${n}: \\quad a_{${n}} = ${a} + (${n}-1)(${b}) = ${a + (n - 1) * b}`
                };
            }
        ],
        med: [
            (a, b, c) => {
                let n = c + 2, r = b > 0 ? b : 2;
                return {
                    expr: `a_n = ${Math.abs(a)} \\cdot ${r}^{n-1} \\; (n = ${n})`,
                    ans: `= ${Math.abs(a) * Math.pow(r, n - 1)}`,
                    sol: `\\text{Plug in } n=${n}: \\quad a_{${n}} = ${Math.abs(a)} \\cdot ${r}^{${n - 1}} = ${Math.abs(a) * Math.pow(r, n - 1)}`
                };
            }
        ],
        hard: [
            () => ({
                expr: `a_1 = 5, a_2 = 8, a_3 = 11 \\text{ find } d`,
                ans: `d = 3`,
                sol: `d = a_2 - a_1 = 8 - 5 = 3`
            }),
            (a, b, c) => ({
                expr: `a_1 = ${a},\\ a_n = a_{n-1} + ${b} \\; (a_{${c + 4}})`,
                ans: `= ${a + b * (c + 3)}`,
                sol: `\\text{Arithmetic series with } a_1=${a}, d=${b}. \\; a_{${c + 4}} = ${a} + (${c + 4}-1)(${b})`
            }),
            () => ({
                expr: `a_1 = 3, a_2 = 6, a_3 = 12 \\text{ find } r`,
                ans: `r = 2`,
                sol: `r = a_2 / a_1 = 6 / 3 = 2`
            }),
            (a, b, c) => ({
                expr: `a_n = ${c} \\cdot 2^{n-1} \\; (a_6)`,
                ans: `= ${c * Math.pow(2, 5)}`,
                sol: `\\text{Plug in } n=6: \\; a_6 = ${c} \\cdot 2^{6-1} = ${c} \\cdot 32 = ${c * Math.pow(2, 5)}`
            }),
            (a, b, c) => ({
                expr: `a_5 = ${b},\\ d = ${c} \\text{ find } a_1`,
                ans: `a_1 = ${b - 4 * c}`,
                sol: `a_5 = a_1 + 4d \\implies ${b} = a_1 + 4(${c}) \\implies a_1 = ${b} - ${4 * c}`
            }),
            (a, b, c) => ({
                expr: `a_1 = ${c}, r = 0.5 \\; (a_4)`,
                ans: `= ${c * Math.pow(0.5, 3)}`,
                sol: `a_4 = a_1 r^3 = ${c}(0.5)^3 = ${c}(0.125) = ${c * Math.pow(0.5, 3)}`
            }),
            (a, b, c, d) => ({
                expr: `a_n = 3n + ${b} \\; (a_{${d + 2}})`,
                ans: `= ${3 * (d + 2) + b}`,
                sol: `\\text{Plug in } n=${d + 2}: \\; 3(${d + 2}) + ${b} = ${3 * (d + 2) + b}`
            }),
            (a, b, c) => {
                let a2 = 2 * c - 1, a3 = 2 * a2 - 1;
                return {
                    expr: `a_1 = ${c}, a_n = 2a_{n-1} - 1 \\; (a_3)`,
                    ans: `= ${a3}`,
                    sol: `\\begin{aligned} a_2 &= 2(${c}) - 1 = ${a2} \\\\ a_3 &= 2(${a2}) - 1 = ${a3} \\end{aligned}`
                };
            },
            (a, b) => ({
                expr: `a_n = n^2 + ${b} \\; (a_5)`,
                ans: `= ${25 + b}`,
                sol: `\\text{Plug in } n=5: \\; 5^2 + ${b} = 25 + ${b}`
            }),
            () => ({
                expr: `7, 11, 15, \\dots \\text{ find } d`,
                ans: `d = 4`,
                sol: `d = 11 - 7 = 4`
            }),
            (a, b, c) => ({
                expr: `a_1 = ${c}, r = -2 \\; (a_4)`,
                ans: `= ${c * Math.pow(-2, 3)}`,
                sol: `a_4 = ${c}(-2)^3 = ${c}(-8) = ${c * Math.pow(-2, 3)}`
            }),
            () => ({
                expr: `a_n = 1/n \\; (a_{10})`,
                ans: `= 0.1`,
                sol: `a_{10} = 1/10 = 0.1`
            }),
            () => ({
                expr: `a_1=1, a_2=1, a_n=a_{n-1}+a_{n-2} \\; (a_6)`,
                ans: `= 8`,
                sol: `\\text{Fibonacci: } 1, 1, 2, 3, 5, 8`
            }),
            () => ({
                expr: `a_n = \\left(1 + \\frac{1}{n}\\right)^n \\text{ convergent?}`,
                ans: `\\text{Converges to } e`,
                sol: `\\text{This is the fundamental definition of the mathematical constant } e.`
            }),
            () => ({
                expr: `a_n = n! \\; (a_5)`,
                ans: `= 120`,
                sol: `5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120`
            }),
            () => ({
                expr: `a_n = (-1)^n \\frac{n}{n+1} \\; (a_3)`,
                ans: `= -\\frac{3}{4}`,
                sol: `a_3 = (-1)^3 \\frac{3}{3+1} = -1 \\cdot \\frac{3}{4} = -3/4`
            }),
            (a, b, c) => ({
                expr: `a_1 = ${c}, a_n = (a_{n-1})^2 \\; (a_3)`,
                ans: `= ${Math.pow(c, 4)}`,
                sol: `a_2 = ${c}^2. \\quad a_3 = (${c}^2)^2 = ${c}^4 = ${Math.pow(c, 4)}`
            }),
            (a, b, c) => ({
                expr: `\\lim_{n \\to \\infty} \\frac{${Math.abs(a)}n + 1}{${c}n + 2}`,
                ans: `= \\frac{${Math.abs(a)}}{${c}}`,
                sol: `\\text{Degrees are equal, limit is ratio of leading coefficients.}`
            }),
            (a, b, c) => ({
                expr: `a_n = \\ln(n) \\text{ find } a_{e^{${c}}}`,
                ans: `= ${c}`,
                sol: `\\ln(e^{${c}}) = ${c}\\ln(e) = ${c}`
            })
        ]
    };