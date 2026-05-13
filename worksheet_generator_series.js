
import { Utils } from './worksheet_generator_utils.js';
export const series = {
        easy: [
            (a, b, c) => {
                let n = c + 5;
                let sum = n * (2 * a + (n - 1) * b) / 2;
                return {
                    expr: `S_{${n}} = \\frac{${n}}{2} [2(${a}) + (${n}-1)(${b})]`,
                    ans: `= ${sum}`,
                    sol: `\\text{Evaluate brackets: } \\frac{${n}}{2}[${2 * a} + ${b * (n - 1)}] = ${sum}`
                };
            }
        ],
        med: [
            (a, b, c) => {
                let r = b > 0 ? b : 2, n = c + 3;
                let sum = Math.abs(a) * (Math.pow(r, n) - 1) / (r - 1);
                return {
                    expr: `S_{${n}} = ${Math.abs(a)} \\frac{${r}^{${n}} - 1}{${r} - 1}`,
                    ans: `= ${Math.round(sum)}`,
                    sol: `\\text{Geometric Sum formula evaluation.}`
                };
            }
        ],
        hard: [
            (a, b, c) => {
                let n = c + 6, sum = n * (2 * a + (n - 1) * b) / 2;
                return {
                    expr: `\\sum_{k=1}^{${n}} (${a} + (k-1)\\cdot${b})`,
                    ans: `= ${sum}`,
                    sol: `\\text{Arithmetic series: } S_n = \\frac{n}{2}(2a_1 + (n-1)d)`
                };
            },
            (a, b, c, d) => {
                let n = d + 4, sum = a * (Math.pow(2, n) - 1);
                return {
                    expr: `\\sum_{k=0}^{${n - 1}} ${a} \\cdot 2^k`,
                    ans: `= ${sum}`,
                    sol: `\\text{Geometric series: } S_n = a\\frac{r^n-1}{r-1}`
                };
            },
            () => ({
                expr: `\\sum_{k=0}^{\\infty} (0.5)^k`,
                ans: `= 2`,
                sol: `\\text{Infinite Geometric: } S = \\frac{a}{1-r} = \\frac{1}{1-0.5} = 2`
            }),
            () => ({
                expr: `\\sum_{k=1}^{10} k`,
                ans: `= 55`,
                sol: `\\text{Sum of first } n \\text{ integers: } \\frac{n(n+1)}{2} = \\frac{10(11)}{2} = 55`
            }),
            () => ({
                expr: `\\sum_{k=1}^{\\infty} 10 \\cdot (0.5)^{k-1}`,
                ans: `= 20`,
                sol: `S = \\frac{a}{1-r} = \\frac{10}{1 - 0.5} = 20`
            }),
            () => ({
                expr: `\\sum_{k=1}^{n} (3k - 1)`,
                ans: `= \\frac{3n(n+1)}{2} - n`,
                sol: `3\\sum k - \\sum 1 = 3\\frac{n(n+1)}{2} - n`
            }),
            () => ({
                expr: `\\sum_{k=1}^{6} 2^k`,
                ans: `= 126`,
                sol: `2+4+8+16+32+64 = 126`
            }),
            () => ({
                expr: `\\sum_{k=1}^{\\infty} \\frac{1}{2^k}`,
                ans: `= 1`,
                sol: `S = \\frac{1/2}{1 - 1/2} = 1`
            }),
            () => ({
                expr: `\\sum_{k=1}^{n} k^2`,
                ans: `= \\frac{n(n+1)(2n+1)}{6}`,
                sol: `\\text{Standard formula for sum of consecutive squares.}`
            }),
            () => ({
                expr: `\\sum_{k=1}^{8} (2k - 1)`,
                ans: `= 64`,
                sol: `\\text{Sum of first } n \\text{ odd integers is } n^2 \\implies 8^2 = 64`
            }),
            () => ({
                expr: `\\sum_{k=0}^{\\infty} (1/3)^k`,
                ans: `= 1.5`,
                sol: `S = \\frac{1}{1 - 1/3} = \\frac{1}{2/3} = 1.5`
            }),
            (a, b) => ({
                expr: `\\sum_{k=1}^{n} (k + ${b})`,
                ans: `= \\frac{n(n+1)}{2} + ${b}n`,
                sol: `\\sum k + \\sum ${b} = \\frac{n(n+1)}{2} + ${b}n`
            }),
            () => ({
                expr: `\\sum_{k=1}^{10} \\frac{1}{k(k+1)}`,
                ans: `= \\frac{10}{11}`,
                sol: `\\text{Telescoping sum: } (1 - 1/2) + (1/2 - 1/3) \\dots = 1 - 1/11`
            }),
            () => ({
                expr: `\\sum_{k=1}^{\\infty} \\frac{1}{k^2}`,
                ans: `= \\frac{\\pi^2}{6}`,
                sol: `\\text{Basel Problem: famous known convergence to } \\pi^2/6`
            }),
            () => ({
                expr: `\\sum_{k=1}^{n} \\left( \\frac{1}{k} - \\frac{1}{k+1} \\right)`,
                ans: `= 1 - \\frac{1}{n+1}`,
                sol: `\\text{Telescoping series: all middle terms cancel out.}`
            }),
            () => ({
                expr: `\\sum_{k=1}^{\\infty} \\frac{1}{k(k+2)}`,
                ans: `= \\frac{3}{4}`,
                sol: `\\text{Partial fractions } \\frac{1}{2}(\\frac{1}{k} - \\frac{1}{k+2}). \\text{ Telescoping leaves } 1/2(1 + 1/2)`
            }),
            () => ({
                expr: `\\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| < 1 \\text{ means?}`,
                ans: `\\text{Absolute convergence}`,
                sol: `\\text{This is the formal definition of the Ratio Test.}`
            }),
            (a, b, c) => ({
                expr: `\\text{Maclaurin for } e^x \\text{ at } x=\\ln(${c})`,
                ans: `= ${c}`,
                sol: `e^{\\ln(${c})} = ${c}`
            }),
            () => ({
                expr: `\\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n}`,
                ans: `= \\ln(2)`,
                sol: `\\text{This is the alternating harmonic series, evaluating Maclaurin } \\ln(1+x) \\text{ at } x=1`
            })
        ]
    };