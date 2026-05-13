
import { Utils } from './worksheet_generator_utils.js';
export const algebra = {
        easy: [
            (a, b, c) => {
                let rhs = a * c + b;
                return {
                    expr: `${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs}`,
                    ans: `x = ${c}`,
                    sol: `\\begin{aligned} ${a}x &= ${rhs} ${b > 0 ? '-' : '+'} ${Math.abs(b)} \\\\ x &= ${c} \\end{aligned}`
                };
            }
        ],
        med: [
            (a, b) => {
                let mid = a + b, last = a * b;
                let ansStr = `= x^2 ${mid === 0 ? "" : (mid > 0 ? `+ ${mid}x` : `- ${Math.abs(mid)}x`)} ${last > 0 ? `+ ${last}` : `- ${Math.abs(last)}`}`;
                return {
                    expr: `(x ${a > 0 ? '+' : '-'} ${Math.abs(a)})(x ${b > 0 ? '+' : '-'} ${Math.abs(b)})`,
                    ans: ansStr,
                    sol: `\\begin{aligned} &\\text{FOIL Method: } \\\\ &${ansStr} \\end{aligned}`
                };
            }
        ],
        hard: [
            (a, b, c, d) => {
                let base = Utils.getRnd(2, 4), val = Utils.getRnd(1, 3);
                return {
                    expr: `\\log_{${base}}(x - ${c}) = ${val}`,
                    ans: `x = ${Math.pow(base, val) + c}`,
                    sol: `\\begin{aligned} x - ${c} &= ${base}^{${val}} \\implies x = ${Math.pow(base, val) + c} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let base = Utils.getRnd(2, 4), val = Utils.getRnd(2, 4);
                return {
                    expr: `${base}^{x + ${c}} = ${Math.pow(base, val)}`,
                    ans: `x = ${val - c}`,
                    sol: `\\begin{aligned} ${base}^{x+${c}} &= ${base}^{${val}} \\implies x + ${c} = ${val} \\implies x = ${val - c} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let B = -(c + d), C = c * d;
                return {
                    expr: `x^2 ${B > 0 ? `+${B}` : B}x ${C > 0 ? `+${C}` : C} = 0`,
                    ans: `x = ${c}, ${d}`,
                    sol: `\\begin{aligned} &(x - ${c})(x - ${d}) = 0 \\implies x = ${c}, \\; x = ${d} \\end{aligned}`
                };
            },
            () => ({
                expr: `2x^2 - 5x + 3 = 0`,
                ans: `x = 1, \\frac{3}{2}`,
                sol: `\\begin{aligned} &(2x - 3)(x - 1) = 0 \\implies x=\\frac{3}{2}, \\; x=1 \\end{aligned}`
            }),
            (a, b, c, d) => {
                let base = Utils.getRnd(2, 3);
                return {
                    expr: `\\log_{${base}}(x) + \\log_{${base}}(${b}) = ${c}`,
                    ans: `x = ${Math.pow(base, c) / b}`,
                    sol: `\\begin{aligned} \\log_{${base}}(${b}x) &= ${c} \\implies ${b}x = ${base}^{${c}} \\implies x = ${Math.pow(base, c) / b} \\end{aligned}`
                };
            },
            (a, b, c, d) => ({
                expr: `(x + ${a})^2 = ${Math.abs(b)}`,
                ans: `x = -${a} \\pm \\sqrt{${Math.abs(b)}}`,
                sol: `\\begin{aligned} x + ${a} &= \\pm \\sqrt{${Math.abs(b)}} \\implies x = -${a} \\pm \\sqrt{${Math.abs(b)}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{x}{${a}} - ${b} = ${c}`,
                ans: `x = ${a * (b + c)}`,
                sol: `\\begin{aligned} \\frac{x}{${a}} &= ${c + b} \\implies x = ${a * (b + c)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `x^3 - ${c}x^2 + ${d}x - 6 = 0 \\; (x=2)`,
                ans: `\\text{Evaluate } P(2)`,
                sol: `\\begin{aligned} P(2) &= 2^3 - ${c}(2)^2 + ${d}(2) - 6 \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `|2x - ${a}| = ${b}`,
                ans: `x = \\frac{${a + b}}{2}, \\frac{${a - b}}{2}`,
                sol: `\\begin{aligned} 2x - ${a} &= \\pm ${b} \\implies x = \\frac{${a} \\pm ${b}}{2} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{x+${c}}{x-${d}} = ${a}`,
                ans: `x = \\frac{${a * d + c}}{a-1}`,
                sol: `\\begin{aligned} x+${c} &= ${a}(x-${d}) \\implies x = \\frac{${a * d + c}}{${a - 1}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `x^2 + ${b}x + ${c} = 0`,
                ans: `x = \\frac{-${b} \\pm \\sqrt{${b * b - 4 * c}}}{2}`,
                sol: `\\begin{aligned} x &= \\frac{-${b} \\pm \\sqrt{${b}^2 - 4(1)(${c})}}{2(1)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `x + y = ${a}, \\; 2x - y = ${b}`,
                ans: `x = \\frac{${a + b}}{3}`,
                sol: `\\begin{aligned} &\\text{Add equations: } 3x = ${a + b} \\implies x = \\frac{${a + b}}{3} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `x^2 - ${c + d}x + ${c * d} > 0`,
                ans: `x < ${Math.min(c, d)} \\text{ or } x > ${Math.max(c, d)}`,
                sol: `\\begin{aligned} &(x - ${c})(x - ${d}) > 0 \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{x^2 - ${c * c}}{x-${c}} = x + k`,
                ans: `k = ${c}`,
                sol: `\\begin{aligned} &\\frac{(x-${c})(x+${c})}{x-${c}} = x+${c} \\implies k=${c} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `x^2 + ${b * 2}x = ${c}`,
                ans: `(x + ${b})^2 = ${c + b * b}`,
                sol: `\\begin{aligned} &x^2 + ${b * 2}x + (${b})^2 = ${c} + (${b})^2 \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{${a}}{x} + \\frac{${b}}{x} = ${c}`,
                ans: `x = \\frac{${a + b}}{${c}}`,
                sol: `\\begin{aligned} \\frac{${a + b}}{x} &= ${c} \\implies x = \\frac{${a + b}}{${c}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `2^{x} = 4^{x - ${c}}`,
                ans: `x = ${2 * c}`,
                sol: `\\begin{aligned} 2^x &= 2^{2(x-${c})} \\implies x = 2x - ${2 * c} \\implies x = ${2 * c} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `f(x) = ${Math.abs(a)}x+${b}, g(x) = x^2, \\; f(g(${c}))`,
                ans: `= ${Math.abs(a) * c * c + b}`,
                sol: `\\begin{aligned} g(${c}) &= ${c * c} \\implies f(${c * c}) = ${Math.abs(a) * c * c + b} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `|x - ${c}| < ${d}`,
                ans: `${c - d} < x < ${c + d}`,
                sol: `\\begin{aligned} -${d} &< x - ${c} < ${d} \\implies ${c - d} < x < ${c + d} \\end{aligned}`
            })
        ]
    };